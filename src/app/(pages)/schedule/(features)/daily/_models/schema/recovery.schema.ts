import z from "zod";

export const recoverySchema = z.object({
  source_date: z.number(),
  target_date: z.number(),
}).superRefine((data, ctx) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  if (data.source_date !== undefined && data.source_date >= todayTime) {
    ctx.addIssue({
      path: ["source_date"],
      message: "ngày lấy dữ liệu phải nhỏ hơn ngày hiện tại",
      code: z.ZodIssueCode.custom,
    });
  }

  if (data.target_date !== undefined && data.target_date < todayTime) {
    ctx.addIssue({
      path: ["target_date"],
      message: "ngày áp dụng phải là ngày hiện tại hoặc lớn hơn",
      code: z.ZodIssueCode.custom,
    });
  }
});
