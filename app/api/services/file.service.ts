import { File } from "@/app/api/entities/file.entity";
import { FileVisibility } from "@/lib/types/file";
import { randomUUID } from "crypto";
import { mkdir, readdir, rmdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { exec } from "child_process";
import { promisify } from "util";

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
    return await this.repo.findOneBy({ id });
  }

  async uploadAndCreate(
    file: globalThis.File,
    user: User,
    visibility: FileVisibility,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let filePath: string | null = null;

    try {
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
      throw error;
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
      if (!file) {
        throw new Error("File not found");
      }

      if (file.path) {
        const folderPath = path.dirname(file.path);

        await unlink(file.path).catch((err) => {
          console.warn("Failed to delete file from disk:", err);
        });

        const filesInFolder = await readdir(folderPath);
        if (filesInFolder.length === 0) {
          await rmdir(folderPath).catch((err) => {
            console.warn("Failed to delete folder:", err);
          });
        }
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
