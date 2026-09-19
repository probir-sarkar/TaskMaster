import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { authRoutes } from "./routes/auth";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(logger());

app.use("/api/*", (c, next) => cors({ origin: (_origin, ctx) => ctx.env.CLIENT_URL, credentials: true })(c, next));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1/auth", authRoutes);

app.notFound((c) => c.json({ success: false, message: "Route not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ success: false, message: "Internal server error" }, 500);
});

export default app;
