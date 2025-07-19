import { z } from "zod";

export const UpsertRoleSchema = z.object({
    name: z.string().min(1, "Tên vai trò không được để trống")
    .max(30, "Tên vai trò không được quá 30 ký tự"),
    description: z.string()
    .max(512, "Mô tả vai trò không được quá 512 ký tự")
    .optional(),
    permissions: z.array(z.string()).optional(),
})
