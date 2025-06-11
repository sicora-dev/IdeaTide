import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

// Configuración de conexión a Supabase
const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

// Schema definitions (optional - only if you plan to use products)
export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull()
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  try {
    // Always search the full table, not per page
    if (search) {
      const searchResults = await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000);
      
      return {
        products: searchResults,
        newOffset: null,
        totalProducts: searchResults.length
      };
    }

    if (offset === null) {
      return { products: [], newOffset: null, totalProducts: 0 };
    }

    const totalProducts = await db.select({ count: count() }).from(products);
    const moreProducts = await db.select().from(products).limit(5).offset(offset);
    const newOffset = moreProducts.length >= 5 ? offset + 5 : null;

    return {
      products: moreProducts,
      newOffset,
      totalProducts: totalProducts[0]?.count || 0
    };
  } catch (error) {
    console.warn('Products table not found or error accessing it:', error);
    // Return empty state when table doesn't exist
    return {
      products: [],
      newOffset: null,
      totalProducts: 0
    };
  }
}

export async function deleteProductById(id: number) {
  try {
    await db.delete(products).where(eq(products.id, id));
    return { success: true };
  } catch (error) {
    console.warn('Error deleting product:', error);
    return { success: false, error: 'Product not found or table does not exist' };
  }
}

// Function to check if products table exists
export async function checkProductsTableExists(): Promise<boolean> {
  try {
    await db.select().from(products).limit(1);
    return true;
  } catch {
    return false;
  }
}