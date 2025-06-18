import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getChatMessagesBySession, sendMessage } from '@/lib/db/queries';
import { generateAIChatResponse } from '@/libs/gemini/gemini';
import { fetchIdeaById } from '@/lib/actions/ideas';

// Ruta POST /api/chat
export async function POST(request: Request) {
  try {
    // 1. Parsear el cuerpo JSON para obtener el mensaje del usuario y sesión
    const { ideaId, userId, sessionId, message: userMessage } = await request.json();

    // 2. Recuperar el historial de conversación desde la base de datos
    const history = await getChatMessagesBySession(sessionId, userId);
    const idea = await fetchIdeaById(ideaId);
    if (!idea) {
      return NextResponse.json({ error: 'Idea no encontrada.' }, { status: 404 });
    }

    const response = await generateAIChatResponse(history, userMessage, idea)

    // 7. Guardar en BD: mensaje de usuario y respuesta de IA
    try {
      await sendMessage(userId, sessionId, userMessage, 'user');
      await sendMessage(userId, sessionId, response, 'ai');
    } catch (dbError) {
      console.error('Error al guardar los mensajes en la base de datos:', dbError);
      return NextResponse.json({ error: 'Error al guardar los mensajes.' }, { status: 500 });
    }

    // 8. Devolver la respuesta como JSON
    return NextResponse.json({ response: response });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return NextResponse.json({ error: 'Error al procesar el chat.' }, { status: 500 });
  }
}
