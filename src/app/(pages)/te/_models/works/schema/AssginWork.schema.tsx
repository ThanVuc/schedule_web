import z from "zod";


export const AssignWorkSchema = z.object({
    name: z.string().trim().min(1, "Tên công việc không được để trống").nonempty("Không được để trống").max(500, "Tên công việc không thể vượt quá 500 ký tự"),
    avatar_url: z.string().optional(),
})