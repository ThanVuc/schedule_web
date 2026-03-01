import z from "zod";

export const generateWorkAISchema = z.object({
  prompts: z.array(
    z.string().trim().min(1, "Yêu cầu không được để trống")
  ).min(1, "Phải có ít nhất một yêu cầu"),
  local_date: z.string(),
  additional_context: z.string().trim().optional(),
});
