import { SelectIdea } from '@/lib/db/schema';
import { Idea } from '@/lib/types/ideas';
import {GoogleGenAI, Content} from '@google/genai';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('La variable de entorno GEMINI_API_KEY no está definida.');
}

// Inicialización para el SDK @google/genai
const genAI = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai' | 'system';
  created_at: string;
}

export async function generateAIChatResponse(
  messages: ChatMessage[],
  newMessage: string,
  ideaContext: SelectIdea
): Promise<string> {
  try {

    console.log('Generando respuesta de IA con contexto de idea:', ideaContext);
    console.log('Historial de mensajes:', messages);
    console.log('Nuevo mensaje:', newMessage);
    const chat = genAI.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: `Eres un asistente de IA especializado en ayudar con el desarrollo de ideas y proyectos.
          Contexto de la idea:
          - Título: ${ideaContext.title}
          - Descripción: ${ideaContext.description || 'No especificada'}
          - Estado: ${ideaContext.status || 'En desarrollo'}

          Instrucciones:
          - Proporciona respuestas útiles y constructivas.
          - Mantén un tono profesional pero amigable.
          - Si necesitas más información, haz preguntas específicas.
          - Basa tus respuestas en el historial de conversación.`
      }
    });
    

    const lastMessages = messages.slice(-6);
      for (const msg of lastMessages) {
        if (msg.type === 'user') {
          await chat.sendMessage({ message: msg.content });
        }
      }

    const response = await chat.sendMessage({ message: newMessage });
    const aiText = response.text;
    return aiText || 'No se pudo generar una respuesta de la IA.';


  } catch (error: any) {
    if (error?.message?.includes('429') || error?.code === 429) {
      return 'Se alcanzó el límite de uso. Intenta nuevamente en un minuto.';
    }
    console.error('Error al generar la respuesta de la IA:', error);
    throw new Error('No se pudo generar la respuesta de la IA');
  }
}

export async function generateCombinatedIdeas(
  ideas: Idea[],
){
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        text: `Combina las siguientes ideas en una sola idea coherente y completa:
        ${ideas.map(idea => `- ${idea.title}: ${idea.description || 'No especificada'}`).join('\n')}
        Instrucciones:
        - Crea una idea principal que integre los conceptos clave de todas las ideas.
        - Si es posible, sugiere sub-ideas o extensiones que complementen la idea principal.
        - Mantén un tono profesional y constructivo.
        - La respuesta debe ser clara y fácil de entender.`,
      },
      config: {
        temperature: 0.7,
        topP: 0.9
      }
    });
    const content = result.text;
    if (!content) {
      throw new Error('No se pudo generar una idea combinada.');
    }
    return content;
  } catch (error: any) {
    console.error('Error al generar ideas combinadas:', error);
    if (error?.message?.includes('429') || error?.code === 429) {
      return 'Se alcanzó el límite de uso. Intenta nuevamente en un minuto.';
    }
    throw new Error('No se pudo generar una idea combinada');
  }
}

export async function generateEmbedding(text: string) {
  const result = await genAI.models.embedContent({ 
    model: 'embedding-001',
    contents: text 
  })
  console.log('Generated embedding:', result.embeddings?.values());
  return result?.embeddings?.values()
}