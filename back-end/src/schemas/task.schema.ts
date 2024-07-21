import z from "zod";

export const TaskSchema = z.object({
  title: z.string().min(3).max(50),
  content: z.string().max(500).optional().default(""),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  deadline: z
    .string()
    .date()
    .transform((val) => new Date(val))
    .optional()
});

export const changePositionSchema = z.object({
  id: z.string(),
  status: z.string(),
  index: z.number()
});
