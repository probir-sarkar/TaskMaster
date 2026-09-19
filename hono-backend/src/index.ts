import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";

import { authRoutes } from "./auth/auth.routes";
import { taskRoutes } from "./task/task.routes";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(logger());

app.use("/api/*", (c, next) => cors({ origin: (_origin, ctx) => ctx.env.CLIENT_URL, credentials: true })(c, next));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1/auth", authRoutes);
app.route("/api/v1", taskRoutes);

app.notFound((c) => c.json({ success: false, message: "Route not found" }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  console.error(err);
  return c.json({ success: false, message: "Internal server error" }, 500);
});

export default app;
