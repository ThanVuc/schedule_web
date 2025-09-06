import z from "zod";

export const RoleSchema = z.object({
    role_ids: z.array(z.string()).optional(),
});