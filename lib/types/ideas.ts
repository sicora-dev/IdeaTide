export type IdeaStatus = 'nueva' | 'en_progreso' | 'en_revision' | 'completada';
export type Priority = 'baja' | 'media' | 'alta';
export type Effort = 'Baja' | 'Media' | 'Alta';
export type Impact = 'Bajo' | 'Medio' | 'Alto';

export interface Idea {
  id: number;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  status: IdeaStatus;
  priority: Priority;
  tags: string[];
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  estimated_effort: Effort;
  potential_impact: Impact;
  user_id: string;
}