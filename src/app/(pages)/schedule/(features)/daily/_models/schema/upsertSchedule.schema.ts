import z from "zod";

export const upsertScheduleSchema = z.object({
    title: z.string().min(2).max(100),
    start: z.date(),
    end: z.date(),
    goal: z.string().optional(),
    workType: z.string(),
    status: z.string(),
    difficulty: z.string(),
    priority: z.string(),
    category: z.string(),
    shortDescription: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    appNotifications: z.array(z.string()).optional(),
    emailNotifications: z.string().optional(),
    miniTasks: z.array(z.object({
        title: z.string().min(1).max(100),
        isCompleted: z.boolean(),
    })).optional(),
})