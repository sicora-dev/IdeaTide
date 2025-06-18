"use server"

import { generateEmbedding } from '@/libs/gemini/gemini';
import { User } from '../types/users';
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

    const { id, title, description } = result
    const embedding = await generateEmbedding(`${title}\n${description}`)
    const vectorString = JSON.stringify(Array.from(embedding || [])[0]?.values)
    // Guardar el embedding
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ embedding: vectorString })
      .eq('id', id)

    if (updateError) throw updateError
    
    return result;
  } catch (error) {
    console.error('Error creating idea:', error);
    return null;
  }
}

// Actualizar idea
export async function updateIdea(ideaId: number, userId: string, data: Partial<InsertIdea>): Promise<SelectIdea | null> {
  try {
    const supabase = await createClient();
    
    const { data: result, error } = await supabase
      .from('ideas')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ideaId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error || !result) {
      console.error('Error updating idea:', error);
      return null;
    }
    
    const { id, title, description } = result
    const embedding = await generateEmbedding(`${title}\n${description}`)
    const vectorString = JSON.stringify(Array.from(embedding || [])[0]?.values)
    // Guardar el embedding
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ embedding: vectorString })
      .eq('id', id)

    if (updateError) throw updateError
    
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

export async function findSimilarIdeas(ideaId: string, limit: number = 5) {
  const supabase = await createClient();

  const { data: baseIdea, error: ideaError } = await supabase
    .from('ideas')
    .select('title, description')
    .eq('id', ideaId)
    .single()

  if (ideaError) throw ideaError

  const embedding = await generateEmbedding(`${baseIdea.title}\n${baseIdea.description}`)
  console.log('Generated embedding for idea:', embedding);

  // Buscar ideas similares
  const { data: related, error } = await supabase.rpc('match_ideas', {
    query_embedding: JSON.stringify(Array.from(embedding || [])[0]?.values),
    match_count: 5
  })

  if (error) throw error

  return related
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

export async function sendMessage(userId: string, sessionId: string, content: string, type: 'user' | 'ai' | 'system' = 'user') {
  try {
    const supabase = await createClient();
    
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert([{
        user_id: userId,
        session_id: sessionId,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        type: type
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

export async function updateUserData(userData: Partial<User>) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.updateUser({
      email: userData.email,
      password: userData.password,
      phone: userData.phone

    })
    
    if (error) {
      console.error('Error updating user data:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user data:', error);
    return null;
  }
}

export async function getChatMessagesBySession(sessionId: string, userId: string) {
  try {
    const supabase = await createClient();

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }

    return messages || [];
  } catch (error) {
    console.error("Unexpected error fetching chat messages:", error);
    return [];
  }
}

export async function getSessionById(sessionId: string, userId: string) {
  try { 
    const supabase = await createClient();

    const { data: session, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    if (error || !session) {
      console.error("Error fetching session:", error);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Unexpected error fetching session:", error);
    return null;
  }
}

export async function getIdeaSessions(ideaId: number, userId: string) {
  try {
    const supabase = await createClient();

    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("idea_id", ideaId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
      return [];
    }

    return sessions || [];
  } catch (error) {
    console.error("Unexpected error fetching sessions:", error);
    return [];
  }
}

export async function createSession(ideaId: number, userId: string) {
  try {
    const supabase = await createClient();

    const { data: session, error } = await supabase
      .from("chat_sessions")
      .insert([
        {
          idea_id: ideaId,
          user_id: userId,
          title: "Nueva sesión",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error || !session) {
      console.error("Error creating session:", error);
      return null;
    }

    return session;
  } catch (error) {
    console.error("Unexpected error creating session:", error);
    return null;
  }
}
