import z from "zod";

export const apiTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  status: z.string(),
  position: z.number(),
  createdAt: z.string(),
  deadline: z.string().or(z.null()).optional().default("")
});

export const apiTaskListSchema = z.array(apiTaskSchema);

export type ApiTaskType = z.infer<typeof apiTaskSchema>;
