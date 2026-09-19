import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import { authRoutes } from "./auth/auth.routes";
import { taskRoutes } from "./task/task.routes";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.use(
  "/api/*",
  cors({
    origin: ["https://task-master.probir.dev", "http://localhost:5173"],
    credentials: true
  })
);

app.route("/api/v1/auth", authRoutes);
app.route("/api/v1", taskRoutes);

app.notFound((c) => c.json({ success: false, message: "Route not found" }, 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  console.error(err);
  return c.json({ success: false, message: "Internal server error" }, 500);
});

export default app;
