// app/dashboard/tickets/[ticketId]/page.tsx
export const dynamic = "force-dynamic";

import ChatLoader from "@/components/dashboard/chat/ChatLoader";
import ChatViewSkeleton from "@/components/skeletons/ChatViewSkeleton";
import { getOrCreateLatestSession } from "@/lib/actions/chat";
import { getIdeaSessions } from "@/lib/db/queries";
import { getAuthenticatedUser } from "@/libs/supabase/server/auth";
import { redirect } from "next/navigation";

export default async function ChatPage({
  params
}: {
  params: Promise<{ ideaId: number }>;
}) {
  const ideaId = (await params).ideaId;
  const { user } = await getAuthenticatedUser()
  const session = await getOrCreateLatestSession(ideaId, user.id);

  if (!session) {
    return <ChatViewSkeleton />;
  }

  const url = `/dashboard/chat/${ideaId}/sessions/${session.id}`;
  redirect(url);
}