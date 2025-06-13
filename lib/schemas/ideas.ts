import { z } from 'zod';
import type {
  IdeaStatus,
  Priority,
  Effort,
  Impact,
  Idea,
  CreateIdeaInput,
  UpdateIdeaInput,
  IdeaFormInput,
  ToggleFavoriteInput
} from '../types/ideas';

// Enums como const para validación
export const IdeaStatusEnum = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress', 
  UNDER_REVIEW: 'under_review',
  COMPLETED: 'completed'
} as const;

export const PriorityEnum = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export const EffortEnum = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high'
} as const;

export const ImpactEnum = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

// Schema base para ideas
export const ideaSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres'),
  category: z.string().min(1, 'La categoría es requerida'),
  subcategory: z.string().min(1, 'La subcategoría es requerida'),
  status: z.enum([
    IdeaStatusEnum.NEW,
    IdeaStatusEnum.IN_PROGRESS,
    IdeaStatusEnum.UNDER_REVIEW,
    IdeaStatusEnum.COMPLETED
  ]).default(IdeaStatusEnum.NEW),
  priority: z.enum([
    PriorityEnum.LOW,
    PriorityEnum.MEDIUM,
    PriorityEnum.HIGH
  ]).default(PriorityEnum.MEDIUM),
  tags: z.array(z.string()).nullable().default([]),
  created_at: z.date(),
  updated_at: z.date(),
  is_favorite: z.boolean().default(false),
  estimated_effort: z.enum([
    EffortEnum.LOW,
    EffortEnum.MEDIUM,
    EffortEnum.HIGH
  ]).default(EffortEnum.MEDIUM),
  potential_impact: z.enum([
    ImpactEnum.LOW,
    ImpactEnum.MEDIUM,
    ImpactEnum.HIGH
  ]).default(ImpactEnum.MEDIUM),
  user_id: z.string().uuid(),
});

// Schema para crear ideas (sin id, fechas, user_id)
export const createIdeaSchema = ideaSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

// Schema para actualizar ideas (todo opcional excepto id)
export const updateIdeaSchema = ideaSchema.partial()

// Schema para formularios (strings que se convierten después)
export const ideaFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres'),
  category: z.string().min(1, 'La categoría es requerida'),
  subcategory: z.string().min(1, 'La subcategoría es requerida'),
  status: z.string().default(IdeaStatusEnum.NEW),
  priority: z.string().default(PriorityEnum.MEDIUM),
  tags: z.string().default(''), // Como string separado por comas
  estimated_effort: z.string().default(EffortEnum.MEDIUM),
  potential_impact: z.string().default(ImpactEnum.MEDIUM),
});

// Schema para toggle favorite
export const toggleFavoriteSchema = z.object({
  id: z.number(),
  is_favorite: z.boolean(),
});

// Helpers para traducción
export const statusTranslations = {
  [IdeaStatusEnum.NEW]: 'Nueva',
  [IdeaStatusEnum.IN_PROGRESS]: 'En Progreso', 
  [IdeaStatusEnum.UNDER_REVIEW]: 'En Revisión',
  [IdeaStatusEnum.COMPLETED]: 'Completada'
};

export const priorityTranslations = {
  [PriorityEnum.LOW]: 'Baja',
  [PriorityEnum.MEDIUM]: 'Media',
  [PriorityEnum.HIGH]: 'Alta'
};

export const effortTranslations = {
  [EffortEnum.LOW]: 'Bajo',
  [EffortEnum.MEDIUM]: 'Medio',
  [EffortEnum.HIGH]: 'Alto'
};

export const impactTranslations = {
  [ImpactEnum.LOW]: 'Bajo',
  [ImpactEnum.MEDIUM]: 'Medio', 
  [ImpactEnum.HIGH]: 'Alto'
};
// ...eliminados los tipos export type Idea, CreateIdeaInput, etc...