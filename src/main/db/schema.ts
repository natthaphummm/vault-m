

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

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

export const crafting = sqliteTable('crafting', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  successChance: integer('success_chance').notNull().default(0),
});

export const craftingCosts = sqliteTable('crafting_costs', {
  id: integer('id').primaryKey(),
  craftingId: integer('crafting_id').notNull().references(() => crafting.id, { onDelete: 'cascade' }),
  itemId: integer('item_id').notNull().references(() => items.id),
  amount: integer('amount').notNull(),
  remove: integer('remove', { mode: 'boolean' }).notNull().default(true),
});

export const craftingResults = sqliteTable('crafting_results', {
  id: integer('id').primaryKey(),
  craftingId: integer('crafting_id').notNull().references(() => crafting.id, { onDelete: 'cascade' }),
  itemId: integer('item_id').notNull().references(() => items.id),
  amount: integer('amount').notNull(),
  type: text('type', { enum: ['success', 'fail'] }).notNull(),
});

export const craftingRelations = relations(crafting, ({ many }) => ({
  costs: many(craftingCosts),
  results: many(craftingResults),
}));

export const craftingCostsRelations = relations(craftingCosts, ({ one }) => ({
  crafting: one(crafting, {
    fields: [craftingCosts.craftingId],
    references: [crafting.id],
  }),
  item: one(items, {
    fields: [craftingCosts.itemId],
    references: [items.id],
  }),
}));

export const craftingResultsRelations = relations(craftingResults, ({ one }) => ({
  crafting: one(crafting, {
    fields: [craftingResults.craftingId],
    references: [crafting.id],
  }),
  item: one(items, {
    fields: [craftingResults.itemId],
    references: [items.id],
  }),
}));