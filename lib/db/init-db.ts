import { getDataSource } from "@/app/api/connection";

getDataSource()
  .then(() => console.log("Database initialized on server start"))
  .catch((err) => console.error("Failed to initialize database:", err));
