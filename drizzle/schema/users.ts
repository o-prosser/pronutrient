import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { sessionsTable } from "./sessions";

export const usersTable = pgTable("users", {
  id: uuid("id")
    .notNull()
    .unique()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 70 }).notNull().unique(),
  firstName: varchar("firstName", { length: 50 }).notNull(),
  lastName: varchar("lastName", { length: 50 }),
  avatar: text("avatar"),
  password: text("password").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  sessions: many(sessionsTable),
}));
