import * as t from "drizzle-orm/sqlite-core";

export const users = t.sqliteTable(
  "users",
  {
    id: t.integer().primaryKey({ autoIncrement: true }),
    email: t.text().notNull(),
    name: t.text(),
    photo: t.text(),
    createdAt: t.integer("created_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull()
      .$onUpdate(() => new Date()),
    role: t.text().$type<"ADMIN" | "USER">().default("USER"),
    status: t.text().$type<"ACTIVE" | "INACTIVE" | "SUSPENDED">().default("ACTIVE"),
  },
  (table) => [t.uniqueIndex("users_email_idx").on(table.email)]
);

export const additionalInfo = t.sqliteTable(
  "additional_info",
  {
    id: t.integer().primaryKey({ autoIncrement: true }),
    password: t.text(),
    userId: t.integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    signupMethod: t.text("signup_method").$type<"EMAIL" | "GOOGLE">().default("EMAIL"),
    createdAt: t.integer("created_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [t.uniqueIndex("additional_info_user_id_idx").on(table.userId)]
);

export const tasks = t.sqliteTable(
  "tasks",
  {
    id: t.text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: t.text().notNull(),
    content: t.text(),
    status: t.text().notNull(),
    position: t.integer().notNull().default(0),
    deadline: t.integer("deadline", { mode: "timestamp" }),
    userId: t.integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: t.integer("created_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    t.index("tasks_user_id_idx").on(table.userId),
    t.index("tasks_status_position_idx").on(table.status, table.position),
  ]
);
