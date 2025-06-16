// components/messages/Chat/ChatLoader.tsx (Server Component)
import { fetchMessages } from "@/lib/actions/chat";
import ChatView from "./ChatView";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { fetchIdeaById } from "@/lib/actions/ideas";
import { SelectIdea } from "@/lib/db/schema";

interface ChatServerProps {
  ideaId: number;
}

export default async function ChatLoader({ ideaId }: ChatServerProps) {
  const ideaPromise = fetchIdeaById(ideaId);
  const messagesPromise = ideaPromise.then((idea: SelectIdea | null) => {
    if (!idea) {
      return Promise.resolve([]);
    }
    return fetchMessages(idea.id);
  });

  return (
    <NuqsAdapter>
      <ChatView
        ideaPromise={ideaPromise}
        messagesPromise={messagesPromise}
      />
    </NuqsAdapter>
  );
}
