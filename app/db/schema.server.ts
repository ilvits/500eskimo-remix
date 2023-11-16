import { type InferInsertModel, type InferSelectModel, relations, sql } from 'drizzle-orm';
import { boolean, decimal, index, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Role = InferSelectModel<typeof roles>;
export type Product = InferSelectModel<typeof products>;
export type Category = InferSelectModel<typeof categories>;
export type Order = InferSelectModel<typeof orders>;
export type OrderItem = InferSelectModel<typeof orderItems>;

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  roleId: integer('role_id')
    .notNull()
    .references(() => roles.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    categoryId: integer('categoryId')
      .notNull()
      .references(() => categories.id),
    sku: text('sku').notNull().unique(),
    title: text('title').notNull(),
    description: text('description'),
    price: decimal('price').notNull(),
    image: text('image').notNull(),
    rating: integer('rating'),
    stock: text('stock'),
    tags: text('tags').array(),
    numReviews: integer('numReviews'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => {
    return {
      priceIdx: index('price_idx').on(table.price),
      titleIdx: index('title_idx').on(table.title),
      categoryIdx: index('category_idx').on(table.categoryId),
      ratingIdx: index('rating_idx').on(table.rating),
      stockIdx: index('stock_idx').on(table.stock),
      numReviewsIdx: index('numReviews_idx').on(table.numReviews),
      createdAtIdx: index('created_at_idx').on(table.createdAt),
      updatedAtIdx: index('updated_at_idx').on(table.updatedAt),
      tagsIdx: index('tags_idx').on(table.tags).using(sql.raw(`USING gin (tags)`)),
    };
  }
);

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  tags: many(tags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  phone: text('phone').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));

export const orders = pgTable(
  'orders',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    status: text('status').notNull(),
    total: decimal('total').notNull(),
    deliveryMethod: text('delivery_method').notNull(),
    deliveredAt: timestamp('delivered_at'),
    delivered: boolean('delivered')
      .$default(() => false)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => {
    return {
      userIdIdx: index('user_id_idx').on(table.userId),
      statusIdx: index('status_idx').on(table.status),
      totalIdx: index('total_idx').on(table.total),
      deliveredIdx: index('delivered_idx').on(table.delivered),
      deliveredAtIdx: index('delivered_at_idx').on(table.deliveredAt),
      deliveryMethodIdx: index('delivery_method_idx').on(table.deliveryMethod),
      createdAtIdx: index('created_at_idx').on(table.createdAt),
      updatedAtIdx: index('updated_at_idx').on(table.updatedAt),
    };
  }
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItems = pgTable(
  'order_items',
  {
    id: serial('id').primaryKey(),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id),
    price: decimal('price').notNull(),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => {
    return {
      orderIdIdx: index('order_id_idx').on(table.orderId),
      productIdIdx: index('product_id_idx').on(table.productId),
      priceIdx: index('price_idx').on(table.price),
      quantityIdx: index('quantity_idx').on(table.quantity),
      createdAtIdx: index('created_at_idx').on(table.createdAt),
    };
  }
);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
