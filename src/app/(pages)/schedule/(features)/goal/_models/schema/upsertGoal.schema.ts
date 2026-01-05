import { z } from "zod";

export const UpsertGoalSchema = z.object({
  name: z.string().trim().min(1, "Tên mục tiêu không được để trống").max(126, "Tiêu đề không thể vượt quá 126 ký tự"),
  start_date: z.number(),
  end_date: z.number(),
  status_id: z.string(),
  difficulty_id: z.string(),
  priority_id: z.string(),
  category_id: z.string(),
  short_descriptions: z.string().trim().max(256, 'Mô tả ngắn không thể vượt quá 256 ký tự'),
  detailed_description: z.string().max(512, 'Mô tả chi tiết không được vượt quá 512 ký tự ').optional(),
  tasks: z.array(z.object({
    name: z.string().trim().min(1).max(126, 'Tên mục tiêu không thể vượt quá 126 ký tự'),
    is_completed: z.boolean(),
  })).optional(),
}
).refine((data) => data.end_date > data.start_date, {
  message: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
  path: ["end_date"],
});
