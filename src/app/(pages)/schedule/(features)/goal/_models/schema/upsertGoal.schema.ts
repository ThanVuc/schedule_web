import { z } from "zod";

export const UpsertGoalSchema = z.object({
  name: z.string().min(1, "Tên mục tiêu không được để trống").max(100, "Tiêu đề không thể vượt quá 100 ký tự"),
  start_date: z.number(),
  end_date: z.number(),
  status_id: z.string(),
  difficulty_id: z.string(),
  priority_id: z.string(),
  category_id: z.string(),
  short_descriptions: z.string().max(200).optional(),
  detailed_description: z.string().max(500).optional(),
  tasks: z.array(z.object({
    name: z.string().min(1).max(100),
    is_completed: z.boolean(),
  })).optional(),
}
).refine((data) => data.end_date > data.start_date, {
  message: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
  path: ["end_date"],
});
