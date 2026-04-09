import { User } from "@/app/api/entities/user.entity";
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { File } from "./entities/file.entity";

export const AppDataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cloud_remenex",
  synchronize: true,
  logging: true,
  entities: [User, File],
};

let AppDataSource: DataSource;

export const getDataSource = async (): Promise<DataSource> => {
  if (AppDataSource?.isInitialized) return AppDataSource;

  AppDataSource = new DataSource(AppDataSourceOptions);
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource;
};
