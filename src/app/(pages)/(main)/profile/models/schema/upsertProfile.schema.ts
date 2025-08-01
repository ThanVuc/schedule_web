import { z } from "zod";

export const UpsertProfileSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Tên người dùng không được để trống")
        .max(128, "Tên người dùng không được quá 128 ký tự"),
    description: z.string()
        .max(300, "Tiểu sử người dùng không được quá 300 ký tự")
        .optional(),
    slug: z.string().optional(),
    email: z.string(),
    dateOfBirth: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true
            const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
            if (!regex.test(val)) return false;
            const [day, month, year] = val.split("-").map(Number);
            const date = new Date(year, month - 1, day);

            return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            );
        }, {
            message: "Ngày sinh phải đúng định dạng DD-MM-YYYY và hợp lệ"
        }),
    gender: z.boolean().optional(),
    newUpdatedAt: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true
            const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
            if (!regex.test(val)) return false;
            const [day, month, year] = val.split("-").map(Number);
            const date = new Date(year, month - 1, day);

            return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            );
        }),
    createdAt: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true
            const regex = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
            if (!regex.test(val)) return false;
            const [day, month, year] = val.split("-").map(Number);
            const date = new Date(year, month - 1, day);

            return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            );
        }),
    motivation: z.string().max(300, "Động lực không được quá 300 ký tự").optional(),
    author: z.string().max(128, "Tên tác giả không được quá 128 ký tự").optional()
})