// Enums como tipos TS
export type IdeaStatus = 'new' | 'in_progress' | 'under_review' | 'completed';
export type Priority = 'low' | 'medium' | 'high';
export type Effort = 'low' | 'medium' | 'high';
export type Impact = 'low' | 'medium' | 'high';

// Idea principal
export interface Idea {
  id?: number | undefined;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  status: IdeaStatus;
  priority: Priority;
  tags?: string[] | null;
  created_at: Date;
  updated_at: Date;
  is_favorite: boolean;
  estimated_effort: Effort;
  potential_impact: Impact;
  user_id: string;
}

// Para crear idea (sin id, fechas, user_id)
export interface CreateIdeaInput {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  status?: IdeaStatus;
  priority?: Priority;
  tags?: string[];
  estimated_effort?: Effort;
  potential_impact?: Impact;
  is_favorite?: boolean;
}

// Para actualizar idea (id obligatorio, resto opcional)
export interface UpdateIdeaInput {
  id: number;
  title?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  status?: IdeaStatus;
  priority?: Priority;
  tags?: string[];
  estimated_effort?: Effort;
  potential_impact?: Impact;
  is_favorite?: boolean;
}

// Para formularios (strings, tags como string)
export interface IdeaFormInput {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  status?: string;
  priority?: string;
  tags?: string;
  estimated_effort?: string;
  potential_impact?: string;
}

// Para toggle favorite
export interface ToggleFavoriteInput {
  id: number;
  is_favorite: boolean;
}