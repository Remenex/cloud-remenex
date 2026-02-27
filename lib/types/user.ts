import { User } from "@/app/api/entities/user.entity";

export type CreateUser = Omit<User, "id" | "createdAt" | "updatedAt">;
