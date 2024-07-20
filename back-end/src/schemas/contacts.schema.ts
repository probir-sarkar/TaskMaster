import z from "zod";

export const createContactSchema = z.object({
  firstName: z.string().min(3).max(14),
  lastName: z.string().min(3).max(14),
  email: z.string().email(),
  phone: z.string().min(6).max(18),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  other: z.object({}).optional(),
  address: z.object({
    line1: z.string().min(1).max(255),
    line2: z.string().max(255).optional(),
    city: z.string().min(1).max(255),
    state: z.string().min(1).max(255),
    country: z.string().min(1).max(255),
    zipCode: z.string().min(1).max(255),
  }),
});

export const contactSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(3).max(14).optional(),
  lastName: z.string().min(3).max(14).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(6).max(18).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});
