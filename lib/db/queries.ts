import { type SelectIdea, type InsertIdea } from './schema';
import { createClient } from 'libs/supabase/server/server';

// Obtener ideas del usuario
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
    
    return result || [];
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
    
    return result;
  } catch (error) {
    console.error('Error fetching idea:', error);
    return null;
  }
}

// Crear nueva idea
export async function createIdea(data: InsertIdea): Promise<SelectIdea | null> {
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
    
    return result;
  } catch (error) {
    console.error('Error creating idea:', error);
    return null;
  }
}

// Actualizar idea
export async function updateIdea(id: number, userId: string, data: Partial<InsertIdea>): Promise<SelectIdea | null> {
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
    
    return result;
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

// Obtener todas las ideas para estadísticas del dashboard
export async function getAllIdeasForStats(userId: string): Promise<SelectIdea[]> {
  try {
    const supabase = await createClient();
    
    const { data: allIdeas, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !allIdeas) {
      console.error('Error fetching ideas for stats:', error);
      return [];
    }

    return allIdeas;
  } catch (error) {
    console.error('Error fetching ideas for stats:', error);
    return [];
  }
}

export async function getIdeaMessages(ideaId: number) {
  try {
    const supabase = await createClient();
    console.log('Fetching messages for ideaId:', ideaId);
    
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('idea_id', ideaId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    console.log('Fetched messages:', messages);
    
    return messages || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function sendMessage(ideaId: number, userId: string, content: string) {
  try {
    const supabase = await createClient();
    
    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        idea_id: ideaId,
        user_id: userId,
        content,
        created_at: new Date().toISOString(),
        type: 'user'
      }])
      .select()
      .single();
    
    if (error || !message) {
      console.error('Error sending message:', error);
      return null;
    }
    
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}