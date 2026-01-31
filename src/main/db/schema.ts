
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
  email: text('email'),
});

export const items = sqliteTable('items', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  category: text('category').notNull(),
  image: text('image'),
});

export const inventory = sqliteTable('inventory', {
  itemId: integer('item_id').primaryKey().references(() => items.id),
  amount: integer('amount').notNull(),
});
