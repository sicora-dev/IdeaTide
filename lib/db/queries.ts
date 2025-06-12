import {  type SelectIdea, type InsertIdea } from './schema';
import { statusToUI, priorityToUI, effortToUI, impactToUI } from '@/lib/utils/translations';
import { createClient } from 'libs/supabase/server/server';

// Obtener ideas del usuario autenticado
export async function getIdeas(userId: string, search?: string): Promise<SelectIdea[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('ideas')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

   if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    
    const { data: result, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }
    
    // Traducir estados de inglés a español para UI
    return (result || []).map(idea => ({
      ...idea,
      status: statusToUI(idea.status),
      priority: priorityToUI(idea.priority),
      estimated_effort: effortToUI(idea.estimated_effort),
      potential_impact: impactToUI(idea.potential_impact),
    }));
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return [];
  }
}

// Obtener una idea específica
export async function getIdeaById(id: number, userId: string): Promise<SelectIdea | null> {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !result) {
      console.error('Error fetching idea:', error);
      return null;
    }
    
    // Traducir a español
    return {
      ...result,
      status: statusToUI(result.status),
      priority: priorityToUI(result.priority),
      estimated_effort: effortToUI(result.estimated_effort),
      potential_impact: impactToUI(result.potential_impact),
    };
  } catch (error) {
    console.error('Error fetching idea:', error);
    return null;
  }
}

// Crear nueva idea
export async function createIdea(data: Omit<SelectIdea, 'id' | 'created_at' | 'updated_at'>): Promise<SelectIdea | null> {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase
      .from('ideas')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error || !result) {
      console.error('Error creating idea:', error);
      return null;
    }
    
    return {
      ...result,
      status: statusToUI(result.status),
      priority: priorityToUI(result.priority),
      estimated_effort: effortToUI(result.estimated_effort),
      potential_impact: impactToUI(result.potential_impact),
    };
  } catch (error) {
    console.error('Error creating idea:', error);
    return null;
  }
}

// Actualizar idea
export async function updateIdea(id: number, userId: string, data: Partial<SelectIdea>): Promise<SelectIdea | null> {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase
      .from('ideas')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !result) {
      console.error('Error updating idea:', error);
      return null;
    }
    
    return {
      ...result,
      status: statusToUI(result.status),
      priority: priorityToUI(result.priority),
      estimated_effort: effortToUI(result.estimated_effort),
      potential_impact: impactToUI(result.potential_impact),
    };
  } catch (error) {
    console.error('Error updating idea:', error);
    return null;
  }
}

// Eliminar idea
export async function deleteIdea(id: number, userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error deleting idea:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting idea:', error);
    return false;
  }
}

// Obtener estadísticas del dashboard
export async function getDashboardStats(userId: string) {
  try {
    const supabase = await createClient();
    
    const { data: allIdeas, error } = await supabase
      .from('ideas')
      .select('status, is_favorite')
      .eq('user_id', userId);

    if (error || !allIdeas) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalIdeas: 0,
        inProgress: 0,
        completed: 0,
        favorites: 0
      };
    }

    const totalIdeas = allIdeas.length;
    const inProgress = allIdeas.filter(idea => idea.status === 'in_progress').length;
    const completed = allIdeas.filter(idea => idea.status === 'completed').length;
    const favorites = allIdeas.filter(idea => idea.is_favorite).length;

    return {
      totalIdeas,
      inProgress,
      completed,
      favorites
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalIdeas: 0,
      inProgress: 0,
      completed: 0,
      favorites: 0
    };
  }
}