import z from "zod";

export const getListRoleSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    user_id: z.string().uuid("ID không hợp lệ"),
    role_ids: z.array(z.string()).optional(),
});