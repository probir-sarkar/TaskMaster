import type { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";
import type { AppEnv } from "../types";

// Created per-request so the secret comes from the request env (Cloudflare Workers).
export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const middleware = jwt({ secret: c.env.JWT_SECRET, alg: "HS256", cookie: "token" });
  await middleware(c, next);
};
