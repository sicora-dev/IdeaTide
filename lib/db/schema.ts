import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  bigserial,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

export const ideaStatusEnum = pgEnum('idea_status', [
  'new', 
  'in_progress', 
  'under_review', 
  'completed'
]);

export const priorityEnum = pgEnum('priority_level', ['low', 'medium', 'high']);
export const effortEnum = pgEnum('effort_level', ['low', 'medium', 'high']);  
export const impactEnum = pgEnum('impact_level', ['low', 'medium', 'high']);

// Tabla principal de ideas
export const ideas = pgTable('ideas', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  subcategory: varchar('subcategory', { length: 100 }).notNull(),
  status: ideaStatusEnum('status').notNull().default('new'),
  priority: priorityEnum('priority').notNull().default('medium'),
  tags: text('tags').array().default([]),
  estimated_effort: effortEnum('estimated_effort').notNull().default('medium'),
  potential_impact: impactEnum('potential_impact').notNull().default('medium'),
  is_favorite: boolean('is_favorite').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  user_id: uuid('user_id').notNull(),
});

// Tabla de categorías
export const categories = pgTable('categories', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  nameEs: varchar('name_es', { length: 100 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#6B7280'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Tabla de subcategorías
export const subcategories = pgTable('subcategories', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  categoryId: bigserial('category_id', { mode: 'number' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  nameEs: varchar('name_es', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Tipos TypeScript
export type SelectIdea = typeof ideas.$inferSelect;
export type InsertIdea = typeof ideas.$inferInsert;
export type SelectCategory = typeof categories.$inferSelect;
export type SelectSubcategory = typeof subcategories.$inferSelect;

// Mapeos para traducción (inglés de BD -> español de UI)
export const statusTranslations = {
  'new': 'nueva',
  'in_progress': 'en_progreso', 
  'under_review': 'en_revision',
  'completed': 'completada'
} as const;

export const priorityTranslations = {
  'low': 'baja',
  'medium': 'media',
  'high': 'alta'
} as const;

export const effortTranslations = {
  'low': 'Baja',
  'medium': 'Media', 
  'high': 'Alta'
} as const;

export const impactTranslations = {
  'low': 'Bajo',
  'medium': 'Medio',
  'high': 'Alto'
} as const;