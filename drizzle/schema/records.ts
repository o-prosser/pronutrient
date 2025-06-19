import { relations, sql } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const recordsTable = pgTable("records", {
  id: uuid("id")
    .notNull()
    .unique()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  barcode: varchar("barcode", { length: 70 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 255 }),
  servingSize: numeric("servingSize").notNull(),
  servings: numeric("servings").notNull(),
  carbohydrates: numeric("carbohydrates"),
  energy: numeric("energy"),
  fat: numeric("fat"),
  fiber: numeric("fiber"),
  protein: numeric("protein"),
  salt: numeric("salt"),
  sugars: numeric("sugars"),
  saturatedFat: numeric("saturatedFat"),
  userId: uuid("userId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: date("date", { mode: "date" }).notNull(),
  meal: varchar("meal", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type InsertRecord = typeof recordsTable.$inferInsert;
export type SelectRecord = typeof recordsTable.$inferSelect;

export const recordsRelations = relations(recordsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [recordsTable.userId],
    references: [usersTable.id],
  }),
}));
