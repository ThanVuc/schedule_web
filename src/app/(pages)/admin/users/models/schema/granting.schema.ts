import z from "zod";

export const GrantingSchema = z.object({
    user_id: z.string().optional(),
    email: z.string().optional(),
    role_ids: z.array(z.string()).optional(),
    nameRole: z.string().min(2, "Tên vai trò không được để trống").optional(),
    description: z.string().min(5, "Mô tả không được để trống").optional()
});