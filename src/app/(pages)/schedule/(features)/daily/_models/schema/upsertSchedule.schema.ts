import z, { number } from "zod";

export const upsertScheduleSchema = z.object({
    name: z.string().trim().min(1, "Tên công việc không được để trống").max(126, "Tên công việc không thể vượt quá 126 ký tự"),
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
    short_descriptions: z.string().trim().max(256, "Mô tả ngắn không thể vượt quá 256 ký tự").optional(),
    detailed_description: z.string().trim().max(512, "Mô tả chi tiết không thể vượt quá 512 ký tự").optional(),
    notifications: z.object({
        beforeFiveMinApp: z.boolean().optional(),
        beforeThirtyMinApp: z.boolean().optional(),
        beforeFiveMinEmail: z.boolean().optional(),
        beforeThirtyMinEmail: z.boolean().optional(),
    }),
    update_type: z.number().optional(),
    sub_tasks: z.array(z.object({
        name: z.string().min(1).max(126),
        is_completed: z.boolean(),
    })).optional(),
}
).refine((data) => data.end_date > data.start_date, {
    message: "Giờ kết thúc phải lớn hơn giờ bắt đầu",
    path: ["end_date"],
})