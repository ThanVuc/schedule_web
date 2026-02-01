import z from "zod";

export const upsertScheduleSchema = z.object({
    name: z.string().min(1, "Tên công việc không được để trống").max(126, "Tên công việc không thể vượt quá 126 ký tự"),
    start_date: z.number(),
    end_date: z.number(),
    repeat_range: z.object({
        from: z.number().optional(),
        to: z.number().optional(),
    }).optional(),
    status_id: z.string(),
    goal_id: z.string().optional(),
    type_id: z.string(),
    difficulty_id: z.string(),
    priority_id: z.string(),
    category_id: z.string(),
    short_descriptions: z.string().max(200, "Mô tả ngắn không thể vượt quá 200 ký tự").optional(),
    detailed_description: z.string().max(500, "Mô tả chi tiết không thể vượt quá 500 ký tự").optional(),
    notifications: z.object({
        beforeFiveMinApp: z.boolean().optional(),
        beforeThirtyMinApp: z.boolean().optional(),
        beforeFiveMinEmail: z.boolean().optional(),
        beforeThirtyMinEmail: z.boolean().optional(),
    }),
    sub_tasks: z.array(z.object({
        name: z.string().min(1).max(100),
        is_completed: z.boolean(),
    })).optional(),
}
).refine((data) => data.end_date > data.start_date, {
    message: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
    path: ["end_date"],
})