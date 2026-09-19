import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, eq, gt, gte, lt, lte, sql } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { createDb } from "../db";
import { tasks } from "../db/schema";
import { AppEnv, requireAuth } from "../middlewares/auth";
import { ChangePositionSchema, TaskSchema } from "./task.schema";

export const taskRoutes = new Hono<AppEnv>();

taskRoutes.use("*", requireAuth);

// ---------------------------------------------------------------------------
// List tasks
// ---------------------------------------------------------------------------
taskRoutes.get("/task", async (c) => {
  const payload = c.get("jwtPayload");
  const db = createDb(c.env.DB);

  const data = await db.select().from(tasks).where(eq(tasks.userId, payload.id));
  return c.json({ success: true as const, data }, 200);
});

// ---------------------------------------------------------------------------
// Add task (placed at position 0 of its status column)
// ---------------------------------------------------------------------------
taskRoutes.post("/task", zValidator("json", TaskSchema), async (c) => {
  const { title, content, status, deadline } = c.req.valid("json");
  const payload = c.get("jwtPayload");
  const db = createDb(c.env.DB);

  await db.batch([
    db
      .update(tasks)
      .set({ position: sql`${tasks.position} + 1` })
      .where(and(eq(tasks.userId, payload.id), eq(tasks.status, status))),
    db.insert(tasks).values({ title, content, status, deadline, userId: payload.id })
  ]);
  return c.json({ success: true as const }, 201);
});

// ---------------------------------------------------------------------------
// Update task
// ---------------------------------------------------------------------------
taskRoutes.put("/task/:id", zValidator("json", TaskSchema), async (c) => {
  const id = c.req.param("id");
  const { title, content, deadline } = c.req.valid("json");
  const payload = c.get("jwtPayload");
  const db = createDb(c.env.DB);

  const updated = await db
    .update(tasks)
    .set({ title, content, deadline })
    .where(and(eq(tasks.id, id), eq(tasks.userId, payload.id)))
    .returning({ id: tasks.id });

  if (updated.length === 0) return c.json({ success: false as const, message: "Task not found" }, 404);
  return c.json({ success: true as const }, 200);
});

// ---------------------------------------------------------------------------
// Delete task
// ---------------------------------------------------------------------------
taskRoutes.delete("/task/:id", async (c) => {
  const id = c.req.param("id");
  const payload = c.get("jwtPayload");
  const db = createDb(c.env.DB);

  const found = await db.select().from(tasks).where(eq(tasks.id, id));
  const task = found[0];

  if (!task) return c.json({ success: false as const, message: "Task not found" }, 404);
  if (task.userId !== payload.id) return c.json({ success: false as const, message: "Forbidden" }, 403);

  await db.batch([
    db
      .update(tasks)
      .set({ position: sql`${tasks.position} - 1` })
      .where(
        and(eq(tasks.userId, payload.id), eq(tasks.status, task.status), gt(tasks.position, task.position))
      ),
    db.delete(tasks).where(eq(tasks.id, id))
  ]);
  return c.json({ success: true as const }, 200);
});

// ---------------------------------------------------------------------------
// Change position / status (drag & drop reorder)
// ---------------------------------------------------------------------------
taskRoutes.post("/task/change-position", zValidator("json", ChangePositionSchema), async (c) => {
  const { id, status, index } = c.req.valid("json");
  const payload = c.get("jwtPayload");
  const db = createDb(c.env.DB);

  const found = await db.select().from(tasks).where(eq(tasks.id, id));
  const task = found[0];

  if (!task) return c.json({ success: false as const, message: "Task not found" }, 404);
  if (task.userId !== payload.id) return c.json({ success: false as const, message: "Forbidden" }, 403);

  const statements: BatchItem<"sqlite">[] = [];

  if (task.status !== status) {
    // Close the gap in the old column, open a gap in the new one
    statements.push(
      db
        .update(tasks)
        .set({ position: sql`${tasks.position} - 1` })
        .where(
          and(eq(tasks.userId, payload.id), eq(tasks.status, task.status), gt(tasks.position, task.position))
        ),
      db
        .update(tasks)
        .set({ position: sql`${tasks.position} + 1` })
        .where(and(eq(tasks.userId, payload.id), eq(tasks.status, status), gte(tasks.position, index)))
    );
  } else {
    if (task.position > index) {
      statements.push(
        db
          .update(tasks)
          .set({ position: sql`${tasks.position} + 1` })
          .where(
            and(
              eq(tasks.userId, payload.id),
              eq(tasks.status, status),
              gte(tasks.position, index),
              lt(tasks.position, task.position)
            )
          )
      );
    }
    if (task.position < index) {
      statements.push(
        db
          .update(tasks)
          .set({ position: sql`${tasks.position} - 1` })
          .where(
            and(
              eq(tasks.userId, payload.id),
              eq(tasks.status, status),
              gt(tasks.position, task.position),
              lte(tasks.position, index)
            )
          )
      );
    }
  }

  statements.push(db.update(tasks).set({ position: index, status }).where(eq(tasks.id, id)));
  await db.batch(statements as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]]);
  return c.json({ success: true as const }, 200);
});
