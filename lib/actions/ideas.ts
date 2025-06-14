'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { 
  createIdea, 
  updateIdea, 
  deleteIdea, 
  getIdeas, 
  getIdeaById,
  getAllIdeasForStats 
} from '@/lib/db/queries';
import { createIdeaSchema, updateIdeaSchema } from '@/lib/schemas/ideas';
import { getAuthenticatedUser } from 'libs/supabase/server/auth';
import { Idea, IdeaStatus } from '../types/ideas';
import { SelectIdea } from '../db/schema';
// Obtener ideas del usuario (con traducción)
export async function fetchUserIdeas(search?: string): Promise<Idea[]> {
  try {
    const { user } = await getAuthenticatedUser();
    const ideas = await getIdeas(user.id, search);
    
    return ideas;
  } catch (error) {
    console.error('Error fetching user ideas:', error);
    throw new Error('Error al obtener las ideas');
  }
}

// Obtener idea por ID (con traducción)
export async function fetchIdeaById(id: number): Promise<SelectIdea | null> {
  try {
    const { user } = await getAuthenticatedUser();
    const idea = await getIdeaById(id, user.id);
    
    if (!idea) {
      return null;
    }
    
    return idea;
  } catch (error) {
    console.error('Error fetching idea by id:', error);
    throw new Error('Error al obtener la idea');
  }
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
      priority: validatedData.priority as "low" | "medium" | "high",
      estimated_effort: validatedData.estimated_effort as "low" | "medium" | "high",
      potential_impact: validatedData.potential_impact as "low" | "medium" | "high",
      is_favorite: false,
      user_id: user.id,
    });

    revalidatePath('/dashboard/ideas');
  } catch (error) {
    console.error('Error creating idea:', error);
    throw new Error('Error al crear la idea');
  }
}

// Actualizar idea
export async function updateIdeaAction(id: number, formData: FormData) {
  try {
    const { user } = await getAuthenticatedUser();
    
    const entries = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, value])
    );
    const rawData = {
      ...entries,
      tags: entries.tags
        ? (entries.tags as string).split(',').map(tag => tag.trim()).filter(Boolean)
        : undefined,
    };
    const validatedData = updateIdeaSchema.parse(rawData);
    
    // Convertir campos a inglés para BD
    const dataToUpdate: any = { ...validatedData };
    if (validatedData.priority) {
      dataToUpdate.priority = validatedData.priority;
    }
    if (validatedData.estimated_effort) {
      dataToUpdate.estimated_effort = validatedData.estimated_effort;
    }
    if (validatedData.potential_impact) {
      dataToUpdate.potential_impact = validatedData.potential_impact;
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
export async function updateIdeaStatusAction(id: number, status: IdeaStatus) {
  try {
    const { user } = await getAuthenticatedUser();
    
    await updateIdea(id, user.id, { 
      status: status 
    });

    revalidatePath('/dashboard/ideas');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error updating status:', error);
    throw new Error('Error al actualizar el estado');
  }
}

// Obtener estadísticas del dashboard
export async function getDashboardStats(userId: string) {
  try {
    const allIdeas = await getAllIdeasForStats(userId);

    // Procesar estadísticas
    const totalIdeas = allIdeas.length;
    const inProgress = allIdeas.filter(idea => idea.status === 'in_progress').length;
    const completed = allIdeas.filter(idea => idea.status === 'completed').length;

    // Obtener las 3 ideas más recientes (traducidas)
    const recentIdeas = allIdeas.slice(0, 3);

    // Función para procesar datos mensuales
    const processMonthlyData = (ideas: any[], dateField: 'created_at' | 'updated_at', statusFilter?: string) => {
      const monthCounts: { [key: string]: number } = {};
      
      // Inicializar últimos 8 meses con 0
      const months = [];
      for (let i = 7; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
        months.push({ month: monthName, value: 0, fullDate: monthKey });
        monthCounts[monthKey] = 0;
      }

      // Filtrar ideas por estado si se especifica
      const filteredIdeas = statusFilter 
        ? ideas.filter(idea => idea.status === statusFilter)
        : ideas;

      // Contar ideas por mes
      filteredIdeas.forEach(idea => {
        const dateStr = idea[dateField];
        if (dateStr) {
          const monthKey = dateStr.slice(0, 7);
          if (monthCounts.hasOwnProperty(monthKey)) {
            monthCounts[monthKey]++;
          }
        }
      });

      // Actualizar valores
      return months.map(month => ({
        ...month,
        value: monthCounts[month.fullDate]
      }));
    };

    // Generar datos para gráficos
    const monthlyCharts = {
      createdByMonth: processMonthlyData(allIdeas, 'created_at'),
      completedByMonth: processMonthlyData(allIdeas, 'updated_at', 'completed'),
      inProgressByMonth: processMonthlyData(allIdeas, 'updated_at', 'in_progress')
    };

    return {
      totalIdeas,
      inProgress,
      completed,
      recentIdeas,
      monthlyCharts
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalIdeas: 0,
      inProgress: 0,
      completed: 0,
      recentIdeas: [],
      monthlyCharts: {
        createdByMonth: [],
        completedByMonth: [],
        inProgressByMonth: []
      }
    };
  }
}