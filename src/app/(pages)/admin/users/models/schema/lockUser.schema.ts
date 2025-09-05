import z from "zod";

export const LockUserSchema = z.object({
   user_id: z.string().optional(),
   lock_reason: z.string().min(1, "Lý do không được để trống").max(500, "Lý do không được vượt quá 500 ký tự"),
});