import z from "zod";


export const UpdateWorkSchema = z.object({
    name: z.string().trim().min(1, "Tên công việc không được để trống").nonempty("Không được để trống").max(500, "Tên công việc không thể vượt quá 500 ký tự"),
    description: z.string().trim().max(5000, "Mô tả công việc không thể vượt quá 5000 ký tự").optional(),
    status: z.number().int().min(0).max(4, "Trạng thái không hợp lệ"),
    priority: z.number().int().min(0).max(2, "Mức độ ưu tiên không hợp lệ"),
    due_date: z.string().optional(),
    story_point: z.number().int().positive().optional(),
    sprint_id: z.string().optional(),
    assignee_id: z.string().optional(),
    assignee_name: z.string().optional(),
    version: z.number().int().positive().optional(),
})