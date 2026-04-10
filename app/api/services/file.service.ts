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

  async uploadAndCreate(
    file: globalThis.File,
    user: User,
    visibility: FileVisibility,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const plan = PLANS[user.plan];

    let filePath: string | null = null;

    try {
      const userFilesCount = await this.repo.count({
        where: { userId: user.id },
      });

      if (userFilesCount >= plan.maxVideos) {
        throw new Error("You reached your plan limit for number of videos.");
      }

      if (file.size > plan.maxVideoSize) {
        throw new Error("File exceeds maximum allowed size for your plan.");
      }

      const totalSize = await this.repo
        .createQueryBuilder("file")
        .select("SUM(file.size)", "sum")
        .where("file.userId = :userId", { userId: user.id })
        .getRawOne();

      if (parseInt(totalSize.sum || 0) + file.size > plan.maxStorage) {
        throw new Error("You exceeded your storage limit.");
      }

      const fileId = randomUUID();
      const userFolder = path.join(process.cwd(), "storage/uploads", user.id);

      await mkdir(userFolder, { recursive: true });

      const extension = file.name.split(".").pop();
      const filename = `${fileId}.${extension}`;
      filePath = path.join(userFolder, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      const thumbFilename = `${fileId}.png`;
      const thumbPath = path.join(userFolder, thumbFilename);

      await execAsync(
        `ffmpeg -i "${filePath}" -ss 00:00:01 -vframes 1 "${thumbPath}"`,
      );

      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of csv=p=0 "${filePath}"`,
      );

      const durationSeconds = Math.floor(parseFloat(stdout));
      const durationFormatted = formatDuration(durationSeconds);

      if (durationSeconds > plan.maxDuration) {
        throw new Error("Video is too long for your current plan.");
      }

      const { stdout: resolutionOut } = await execAsync(
        `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${filePath}"`,
      );

      const [width, height] = resolutionOut.split(",").map(Number);

      if (plan.quality === "1080p" && height > 1080) {
        throw new Error("Max resolution for your plan is 1080p.");
      } else if (plan.quality === "4K" && height > 2180) {
        throw new Error("Max resolution for your plan is 4K");
      }

      const newFile = queryRunner.manager.create(File, {
        id: fileId,
        originalName: file.name,
        filename,
        path: filePath,
        mimeType: file.type,
        size: file.size,
        visibility: visibility,
        user: user,
        thumbnail: thumbFilename,
        duration: durationFormatted,
      });

      const savedFile = await queryRunner.manager.save(newFile);

      await queryRunner.commitTransaction();
      return savedFile;
    } catch (error) {
      if (filePath) {
        await unlink(filePath).catch(() => {});
      }

      await queryRunner.rollbackTransaction();

      throw error instanceof Error ? error : new Error(String(error));
    } finally {
      await queryRunner.release();
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
