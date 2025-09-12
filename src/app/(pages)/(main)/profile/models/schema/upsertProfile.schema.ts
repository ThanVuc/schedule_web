import { z } from "zod";

export const UpsertProfileSchema = z.object({
    id: z.string(),
    fullname: z.string().min(1, "Tên người dùng không được để trống")
        .max(128, "Tên người dùng không được quá 128 ký tự").optional(),
    email: z.string(),
    avatar_url: z.string().optional(),
    bio: z.string()
        .max(300, "Tiểu sử người dùng không được quá 300 ký tự")
        ,
    slug: z.string(),
    date_of_birth: z.any(),
    gender: z.boolean(),
    created_at: z.number().min(0, "Ngày tạo không hợp lệ").optional(),
    updated_at: z.number().min(0, "Ngày cập nhật không hợp lệ").optional(),
    sentence: z.string().max(300, "Động lực không được quá 300 ký tự"),
    author: z.string().max(128, "Tên tác giả không được quá 128 ký tự")
})