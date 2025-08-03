import { z } from "zod";

export const UpsertPermissionSchema = z.object({
  name: z.string().min(1, "Tên quyền không được để trống"),
  description: z.string().optional(),
  resource_id: z.string().min(1, "Resource không được để trống"),
  actions_ids: z.array(z.string()).min(1, "Bạn cần chọn ít nhất 1 hành động"),
});
