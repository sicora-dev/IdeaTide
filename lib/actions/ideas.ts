'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createIdea, updateIdea, deleteIdea } from '@/lib/db/queries';
import { createIdeaSchema, updateIdeaSchema } from '@/lib/validations/ideas';
import { statusToDatabase, priorityToDatabase, effortToDatabase, impactToDatabase } from '@/lib/utils/translations';
import { createClient } from 'libs/supabase/server/server';
import { getAuthenticatedUser } from 'libs/supabase/server/auth';
import { Idea } from '../types/ideas';

export async function fetchUserIdeas(): Promise<Idea[]> {
  const response = await fetch('/api/ideas', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch ideas');
  }

  const { ideas } = await response.json();
  return ideas;
}

// Crear nueva idea
export async function createIdeaAction(formData: FormData) {
  try {
    const { user } = await getAuthenticatedUser();
    
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      subcategory: formData.get('subcategory') as string,
      priority: formData.get('priority') as string,
      estimated_effort: formData.get('estimated_effort') as string,
      potential_impact: formData.get('potential_impact') as string,
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };

    const validatedData = createIdeaSchema.parse(rawData);
    
    await createIdea({
      ...validatedData,
      status: 'new',
      priority: priorityToDatabase(validatedData.priority) as "low" | "medium" | "high" ,
      estimated_effort: effortToDatabase(validatedData.estimated_effort) as "low" | "medium" | "high",
      potential_impact: impactToDatabase(validatedData.potential_impact) as "low" | "medium" | "high",
      is_favorite: false,
      user_id: user.id,
    });

    revalidatePath('/dashboard/ideas');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error creating idea:', error);
    throw new Error('Error al crear la idea');
  }
  
  redirect('/dashboard/ideas');
}

// Actualizar idea
export async function updateIdeaAction(id: number, formData: FormData) {
  try {
    const { user } = await getAuthenticatedUser();
    
    const rawData = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, value])
    );

    const validatedData = updateIdeaSchema.parse(rawData);
    
    // Convertir campos a inglés para BD
    const dataToUpdate: any = { ...validatedData };
    if (validatedData.priority) {
      dataToUpdate.priority = priorityToDatabase(validatedData.priority);
    }
    if (validatedData.estimated_effort) {
      dataToUpdate.estimated_effort = effortToDatabase(validatedData.estimated_effort);
    }
    if (validatedData.potential_impact) {
      dataToUpdate.potential_impact = impactToDatabase(validatedData.potential_impact);
    }
    
    await updateIdea(id, user.id, dataToUpdate);

    revalidatePath('/dashboard/ideas');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error updating idea:', error);
    throw new Error('Error al actualizar la idea');
  }
}

// Toggle favorito
export async function toggleFavoriteAction(id: number, currentFavorite: boolean) {
  try {
    const { user } = await getAuthenticatedUser();
    
    await updateIdea(id, user.id, { is_favorite: !currentFavorite });

    revalidatePath('/dashboard/ideas');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Error al actualizar favorito');
  }
}

// Eliminar idea
export async function deleteIdeaAction(id: number) {
  try {
    const { user } = await getAuthenticatedUser();
    
    const success = await deleteIdea(id, user.id);
    
    if (!success) {
      throw new Error('No se pudo eliminar la idea');
    }

    revalidatePath('/dashboard/ideas');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error deleting idea:', error);
    throw new Error('Error al eliminar la idea');
  }
}

// Cambiar estado de idea
export async function updateIdeaStatusAction(id: number, status: string) {
  try {
    const { user } = await getAuthenticatedUser();
    
    await updateIdea(id, user.id, { 
      status: statusToDatabase(status) 
    });

    revalidatePath('/dashboard/ideas');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error updating status:', error);
    throw new Error('Error al actualizar el estado');
  }
}