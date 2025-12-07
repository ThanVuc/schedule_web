import { z } from "zod";

export const UpsertGoalSchema = z.object({
    name: z.string().min(1, "Tên mục tiêu không được để trống"),
    start_date: z.date({
        error: "Ngày bắt đầu là bắt buộc",
    }),
    end_date: z.date({
        error: "Ngày kết thúc là bắt buộc",
    }),
    status_id: z.string().min(1, "Trạng thái là bắt buộc"),
    difficulty_id: z.string().min(1, "Độ khó là bắt buộc"),
    priority_id: z.string().min(1, "Độ ưu tiên là bắt buộc"),
    category_id: z.string().min(1, "Danh mục là bắt buộc"),
    short_descriptions: z.string().optional(),
    detailed_description: z.string().optional(),
    sub_tasks: z.array(z.object({
        name: z.string().min(1).max(100),
        is_completed: z.boolean(),
    })).optional(),
}
);