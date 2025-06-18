// components/messages/Chat/ChatLoader.tsx (Server Component)
import ChatView from "./ChatView";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { fetchIdeaById } from "@/lib/actions/ideas";
import { getChatMessagesBySession, getSessionById } from "@/lib/db/queries";

interface ChatServerProps {
  ideaId: number;
  sessionId: string;
  userId: string;
}

export default async function ChatLoader({ ideaId, sessionId, userId }: ChatServerProps) {
  const ideaPromise = fetchIdeaById(ideaId);
  const sessionPromise = getSessionById(sessionId, userId);
  
  const messagesPromise = Promise.all([ideaPromise, sessionPromise])
    .then(([idea, session]) => {
      if (!idea || !session) {
        return [];
      }
      return getChatMessagesBySession(sessionId, userId);
    });

  return (
    <NuqsAdapter>
      <ChatView
        ideaPromise={ideaPromise}
        messagesPromise={messagesPromise}
        sessionPromise={sessionPromise}
      />
    </NuqsAdapter>
  );
}
