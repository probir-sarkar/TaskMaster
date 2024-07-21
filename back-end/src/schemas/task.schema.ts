import z from "zod";

export const TaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
});
