import { z } from "zod";

export const UpsertUserSchema = z.object({
    img: z.string().min(1, "Ảnh không được để trống"),
    name: z.string().min(1, "Tên người dùng không được để trống")
    .max(30, "Tên người dùng không được quá 30 ký tự"),
    email: z.string().min(1, "Email không được để trống")
    .max(100, "Email không được quá 100 ký tự")
    .email("Email không hợp lệ"),
    role: z.string().min(1, "Vai trò không được để trống"),
    state: z.string().min(1, "Trạng thái không được để trống"),
    LastLoginAt: z.string().min(1, "Thời gian đăng nhập không được để trống"),
    LastUpdateAt: z.string().min(1, "Thời gian cập nhật không được để trống"),
    CreatedAt: z.string().min(1, "Thời gian tạo không được để trống"),
})
