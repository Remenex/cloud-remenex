import { User } from "@/app/api/entities/user.entity";
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

export const AppDataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cloud_remenex",
  synchronize: true,
  logging: true,
  entities: [User],
};

declare global {
  var _appDataSource: DataSource | undefined;
}

export const getDataSource = async (): Promise<DataSource> => {
  if (global._appDataSource && global._appDataSource.isInitialized) {
    return global._appDataSource;
  }

  const AppDataSource = new DataSource(AppDataSourceOptions);
  global._appDataSource = await AppDataSource.initialize();
  console.log("DataSource initialized");

  return global._appDataSource;
};
