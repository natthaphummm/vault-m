

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

export const recipeCosts = sqliteTable('recipe_costs', {
  id: integer('id').primaryKey(),
  recipeId: integer('recipe_id').notNull().references(() => crafting.id, { onDelete: 'cascade' }),
  itemId: integer('item_id').notNull().references(() => items.id),
  amount: integer('amount').notNull(),
  remove: integer('remove', { mode: 'boolean' }).notNull().default(true),
});

export const recipeResults = sqliteTable('recipe_results', {
  id: integer('id').primaryKey(),
  recipeId: integer('recipe_id').notNull().references(() => crafting.id, { onDelete: 'cascade' }),
  itemId: integer('item_id').notNull().references(() => items.id),
  amount: integer('amount').notNull(),
  type: text('type', { enum: ['success', 'fail'] }).notNull(),
});

export const craftingRelations = relations(crafting, ({ many }) => ({
  costs: many(recipeCosts),
  results: many(recipeResults),
}));

export const recipeCostsRelations = relations(recipeCosts, ({ one }) => ({
  recipe: one(crafting, {
    fields: [recipeCosts.recipeId],
    references: [crafting.id],
  }),
  item: one(items, {
    fields: [recipeCosts.itemId],
    references: [items.id],
  }),
}));

export const recipeResultsRelations = relations(recipeResults, ({ one }) => ({
  recipe: one(crafting, {
    fields: [recipeResults.recipeId],
    references: [crafting.id],
  }),
  item: one(items, {
    fields: [recipeResults.itemId],
    references: [items.id],
  }),
}));