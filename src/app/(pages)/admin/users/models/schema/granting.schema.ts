import z from "zod";

export const GrantingSchema = z.object({
    userId: z.string().uuid(),
    email: z.string().min(1, "Email không được để trống"),
    roleId: z.array(z.string()).optional(),
    nameRole: z.string().min(2, "Tên vai trò không được để trống"),
    description: z.string().min(5, "Mô tả không được để trống")
});