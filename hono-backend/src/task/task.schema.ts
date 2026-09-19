import { z } from "zod";

export const TaskStatus = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const TaskSchema = z.object({
  title: z.string().min(3).max(50),
  content: z.string().max(500).optional().default(""),
  status: TaskStatus.default("TODO"),
  deadline: z
    .string()
    .date()
    .transform((val) => new Date(val))
    .optional(),
});

export const ChangePositionSchema = z.object({
  id: z.string(),
  status: TaskStatus,
  index: z.number().int().min(0),
});
