// app/dashboard/tickets/[ticketId]/page.tsx
export const dynamic = "force-dynamic";

import ChatLoader from "@/components/dashboard/chat/ChatLoader";
import ChatViewSkeleton from "@/components/skeletons/ChatViewSkeleton";
import { Suspense } from "react";

export default async function ChatPage({
  params
}: {
  params: Promise<{ ideaId: number }>;
}) {
  const ideaId = (await params).ideaId;

  console.log("ChatPage render");

  return (
    <>
      {/* Chat */}
      <Suspense fallback={<ChatViewSkeleton />}>
        <ChatLoader ideaId={ideaId} />
      </Suspense>
    </>
  );
}