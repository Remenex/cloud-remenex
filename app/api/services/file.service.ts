import { File } from "@/app/api/entities/file.entity";
import { FileVisibility } from "@/lib/types/file";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";

export class FileService {
  constructor(private dataSource: DataSource) {}

  private get repo(): Repository<File> {
    return this.dataSource.getRepository(File);
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

      const newFile = queryRunner.manager.create(File, {
        id: fileId,
        originalName: file.name,
        filename,
        path: filePath,
        mimeType: file.type,
        size: file.size,
        visibility: visibility,
        user: user,
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
}
