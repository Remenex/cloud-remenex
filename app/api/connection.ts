import { DataSource, DataSourceOptions } from "typeorm";

export const AppDataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_DB || "cloud-remenex",
  synchronize: true,
  logging: true,
  entities: [],
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
