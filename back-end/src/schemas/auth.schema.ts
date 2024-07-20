import { z } from "zod";

export const googleCallbackSchema = z.object({
  name: z.string(),
  picture: z.string().optional(),
  email: z.string().email(),
  email_verified: z.boolean(),
  sub: z.string(),
});
