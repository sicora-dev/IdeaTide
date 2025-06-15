import { redirect } from "next/navigation";
import EmptyMessages from "@/components/dashboard/chat/EmptyMessages";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  console.log("ChatPage render");


  const ideas: string | any[] = [];

  if (!ideas || ideas.length === 0) {
    return <EmptyMessages />;
  }

  const firstIdeaId = ideas[0].id;

  const query = new URLSearchParams(searchParams).toString();
  const url = `/dashboard/chat/${firstIdeaId}${query ? `?${query}` : ""}`;

  redirect(url);
}