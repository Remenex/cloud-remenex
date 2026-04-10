import { File } from "@/app/api/entities/file.entity";
import { FileVisibility } from "@/lib/types/file";
import { randomUUID } from "crypto";
import { mkdir, readdir, rmdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { exec } from "child_process";
import { promisify } from "util";
import { PLANS } from "@/lib/config/plans";
import { promises as fs } from "fs";

const execAsync = promisify(exec);

enum FileStatus {
  UPLOADING = "UPLOADING",
  PROCESSING = "PROCESSING",
  READY = "READY",
  FAILED = "FAILED",
}

export class FileService {
  constructor(private dataSource: DataSource) {}

  private get repo(): Repository<File> {
    return this.dataSource.getRepository(File);
  }

  async getUserFiles(userId: string) {
    return await this.repo.find({
      where: { userId: userId },
      order: { createdAt: "DESC" },
    });
  }

  async getFileById(id: string) {
    return await this.repo.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

async uploadAndCreate(file: globalThis.File, user: User, visibility: FileVisibility) {
  const plan = PLANS[user.plan];

  await this.validateUpload(file, user, plan);

  const fileId = randomUUID();
  const userFolder = path.join(process.cwd(), "storage/uploads", user.id);

  await mkdir(userFolder, { recursive: true });

  const extension = file.name.split(".").pop();
  const filename = `${fileId}.${extension}`;
  const filePath = path.join(userFolder, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const newFile = this.repo.create({
    id: fileId,
    originalName: file.name,
    filename,
    path: filePath,
    mimeType: file.type,
    size: file.size,
    visibility,
    user,
    status: FileStatus.PROCESSING,
  });

  const savedFile = await this.repo.save(newFile);

  this.processVideo(savedFile).catch(console.error);

  return savedFile;
}


private async processVideo(file: File) {
  try {
    const optimizedPath = file.path.replace(".mp4", "_optimized.mp4");
    const thumbPath = file.path.replace(".mp4", ".png");

    await execAsync(`
      ffmpeg -i "${file.path}" \
      -c:v libx264 -preset medium -crf 23 \
      -c:a aac -b:a 128k \
      -movflags +faststart \
      "${optimizedPath}"
    `);

    await execAsync(`
      ffmpeg -i "${file.path}" -ss 00:00:01 -vframes 1 "${thumbPath}"
    `);

    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of csv=p=0 "${optimizedPath}"`
    );

    const duration = formatDuration(Math.floor(parseFloat(stdout)));

    await this.repo.update(file.id, {
      path: optimizedPath,
      thumbnail: path.basename(thumbPath),
      duration,
      status: FileStatus.READY,
    });

  } catch (err) {
    await this.repo.update(file.id, {
      status: FileStatus.FAILED
    });

    console.error("Processing failed:", err);
  }
}

private async validateUpload(file: globalThis.File, user: User, plan: any) {
  const count = await this.repo.count({ where: { userId: user.id } });

  if (count >= plan.maxVideos) {
    throw new Error("Video limit reached");
  }

  if (file.size > plan.maxVideoSize) {
    throw new Error("File too large");
  }

  const totalSize = await this.repo
    .createQueryBuilder("file")
    .select("SUM(file.size)", "sum")
    .where("file.userId = :userId", { userId: user.id })
    .getRawOne();

  if ((parseInt(totalSize.sum || 0) + file.size) > plan.maxStorage) {
    throw new Error("Storage limit exceeded");
  }
}


  async deleteFileById(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const file = await queryRunner.manager.findOne(File, { where: { id } });
      if (!file) throw new Error("File not found");

      if (file.path) {
        const folderPath = path.dirname(file.path);

        await fs
          .unlink(file.path)
          .catch((err) => console.warn("Failed to delete file:", err));

        await fs
          .rm(folderPath, { recursive: true, force: true })
          .catch((err) => console.warn("Failed to delete folder:", err));
      }

      await queryRunner.manager.remove(File, file);

      await queryRunner.commitTransaction();

      return { success: true, message: "File deleted successfully" };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateFileName(id: string, newName: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const file = await queryRunner.manager.findOne(File, { where: { id } });
      if (!file) throw new Error("File not found");

      file.originalName = newName;
      const updatedFile = await queryRunner.manager.save(file);

      await queryRunner.commitTransaction();
      return updatedFile;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateVisibility(id: string, visible: FileVisibility) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const file = await queryRunner.manager.findOne(File, { where: { id } });
      if (!file) throw new Error("File not found");

      file.visibility = visible;
      const updatedFile = await queryRunner.manager.save(file);

      await queryRunner.commitTransaction();
      return updatedFile;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserUsage(user: User) {
    const plan = PLANS[user.plan];

    const videosUsed = await this.repo.count({ where: { userId: user.id } });

    const totalSizeResult = await this.repo
      .createQueryBuilder("file")
      .select("SUM(file.size)", "sum")
      .where("file.userId = :userId", { userId: user.id })
      .getRawOne();

    const storageUsed =
      parseInt(totalSizeResult.sum || "0", 10) / (1024 * 1024 * 1024);

    const bandwidthUsed = 0;

    return {
      videosUsed,
      storageUsed,
      bandwidthUsed,
      videosLimit: plan.maxVideos === Infinity ? Infinity : plan.maxVideos,
      storageLimit:
        plan.maxStorage === Infinity
          ? Infinity
          : plan.maxStorage / (1024 * 1024 * 1024),
      bandwidthLimit: 50,
    };
  }
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [
    h.toString().padStart(2, "0"),
    m.toString().padStart(2, "0"),
    s.toString().padStart(2, "0"),
  ].join(":");
}
