import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import {
  relations,
  type InferSelectModel,
  type InferInsertModel,
} from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

// export const cake = pgTable("cake", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   description: text("description"),
//   price: text("price").notNull(),
//   image: text("image").notNull(),
//   category: text("category"),
//   rating: text("rating"),
//   stock: text("stock"),
//   numReviews: text("numReviews"),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// });

// export const category = pgTable("category", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// });
