import { File } from "@/app/api/entities/file.entity";

export enum FileVisibility {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
}

export type CreateFile = Omit<
  File,
  "id" | "path" | "filename" | "createdAt" | "updatedAt"
>;
