// app/dashboard/chat/[ideaId]/sessions/[sessionId]/page.tsx

import { notFound } from "next/navigation";
import { Suspense } from "react";
import ChatLoader from "@/components/dashboard/chat/ChatLoader";
import ChatViewSkeleton from "@/components/skeletons/ChatViewSkeleton";
import { getAuthenticatedUser } from "@/libs/supabase/client/auth";
import { getChatMessagesBySession, getIdeaById, getSessionById } from "@/lib/db/queries";

type Props = {
  params: {
    ideaId: string;
    sessionId: string;
  };
};

export default async function ChatSessionPage({ params }: Props) {
  const { user } = await getAuthenticatedUser();
  const userId = user?.id;

  if (!userId) notFound();

  const ideaId = Number(params.ideaId);
  const sessionId = params.sessionId;

  if (isNaN(ideaId) || !sessionId) notFound();

  return (
    <>
      {/* Chat */}
      <Suspense fallback={<ChatViewSkeleton />}>
        <ChatLoader ideaId={ideaId} sessionId={sessionId} userId={userId}/>
      </Suspense>
    </>
  );
}
