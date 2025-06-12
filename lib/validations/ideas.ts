import { z } from 'zod';

export const createIdeaSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres'),
  category: z.string().min(1, 'La categoría es requerida'),
  subcategory: z.string().min(1, 'La subcategoría es requerida'),
  priority: z.enum(['baja', 'media', 'alta']).default('media'),
  tags: z.array(z.string()).default([]),
  estimated_effort: z.enum(['Baja', 'Media', 'Alta']).default('Media'),
  potential_impact: z.enum(['Bajo', 'Medio', 'Alto']).default('Medio'),
});

export const updateIdeaSchema = createIdeaSchema.partial();

export const toggleFavoriteSchema = z.object({
  is_favorite: z.boolean(),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;