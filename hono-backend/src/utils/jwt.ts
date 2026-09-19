import { sign } from "hono/jwt";

export const generateToken = (user: { id: number; name: string | null }, secret: string) => {
  const now = Math.floor(Date.now() / 1000);
  return sign({ id: user.id, name: user.name, iat: now, exp: now + 24 * 60 * 60 }, secret);
};
