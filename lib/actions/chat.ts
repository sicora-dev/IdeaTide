"use server"

import { createSession, getChatMessagesBySession, getIdeaMessages, getIdeaSessions, getSessionById, sendMessage } from "../db/queries";


export async function postMessage(userId: string, sessionId: string, content: string, type: 'user' | 'ai' | 'system' = 'user') {
  const result = await sendMessage(userId, sessionId, content, type);
  if (!result) {
    throw new Error("Failed to send message");
  }
}

export async function fetchSessionMessages(sessionId: string, userId: string) {
  const messages = await getChatMessagesBySession(sessionId, userId);
  return messages;
}

export async function fetchSessionById(sessionId: string, userId: string) {
  try {
    const session = await getSessionById(sessionId, userId);
    if (!session) {
      throw new Error("Session not found");
    }
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    throw new Error("Failed to fetch session");
  }
}

export async function fetchSessions(ideaId: number, userId: string) {
  try {
    const sessions = await getIdeaSessions(ideaId, userId);
    return sessions;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw new Error("Failed to fetch sessions");
  }
}

export async function getOrCreateLatestSession(ideaId: number, userId: string) {
  const sessions = await getIdeaSessions(ideaId, userId);

  if (sessions.length > 0) {
    return sessions[0]; // última sesión
  }

  const newSession = await createSession(ideaId, userId);
  return newSession;
}