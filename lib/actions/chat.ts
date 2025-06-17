"use server"
import { getIdeaMessages, sendMessage } from "../db/queries";

export async function fetchMessages(ideaId: number) {
  const response = await getIdeaMessages(ideaId);

  return response;
}

export async function postMessage(ideaId: number, userId: string, content: string) {
  const result = await sendMessage(ideaId, userId, content);
  if (!result) {
    throw new Error("Failed to send message");
  }
}