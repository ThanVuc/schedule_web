import z from "zod";


export const AssignWorkSchema = z.object({
    id: z.string().optional(),
    email: z.string(),
    avatar_url: z.string().optional(),
})