import z from "zod";

export const upsertScheduleSchema = z.object({
    name: z.string().min(1,"vui lòng nhập tiêu đề").max(100, "tiêu đề không được quá 100 ký tự"),
    start_date: z.number(),
    end_date: z.number(),
    goal_id: z.string().optional(),
    type_id: z.string(),
    status_id: z.string(),
    difficulty_id: z.string(),
    priority_id: z.string(),
    category_id: z.string(),
    short_descriptions: z.string().max(200).optional(),
    detailed_description: z.string().max(500).optional(),
    appNotifications: z.array(z.string()).optional(),
    emailNotifications: z.string().optional(),
    sub_tasks: z.array(z.object({
        name: z.string().min(1).max(100),
        is_completed: z.boolean(),
    })).optional(),
})