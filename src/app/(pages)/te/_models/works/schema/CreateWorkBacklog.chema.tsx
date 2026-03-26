import z from "zod";


export const CreateWorkBacklogSchema = z.object({
    name: z.string().trim().min(1, "Tên công việc không được để trống").nonempty("Không được để trống").max(500, "Tên công việc không thể vượt quá 500 ký tự"),
    description: z.string().trim().max(5000, "Mô tả công việc không thể vượt quá 5000 ký tự").optional(),
    Assignee_id: z.string().optional(),
    Status: z.number().optional(),
    Priority: z.number().optional(),
    Story_point: z.number().optional(),
    Due_date: z.string().optional(),
    Sprint_id: z.string().optional(),
})