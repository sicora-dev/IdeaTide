"use client";

import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import EmptyIdeasChat from "./EmptyIdeasChat";
import { fetchUserIdeas } from "@/lib/actions/ideas";
import useSWR from 'swr';
import { IdeaChatItem } from "./IdeaChatItem";

const fetcher = () => fetchUserIdeas()

export default function IdeasChatList() {
  console.log("TIdeasChatList render");

  const params = useParams()
  const currentIdeaId = params.ticketId as string | undefined;

  const { data: userIdeas, isLoading: loading } = useSWR('user-ideas-chat', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60000,
    suspense: false,
  });

  return (
    <div className="bg-base-100 rounded-xl w-full flex flex-col flex-1 overflow-y-auto">
      <div className="overflow-y-auto overflow-x-hidden h-full w-full p-2">
        {/* Loading cuando no se ha inicializado o cuando no hay tickets cargados aún */}
        {loading && userIdeas?.length === 0 ? (
          <div className="max-md:w-[100dvw] max-sm:w-[100dvw] overflow-hidden">
            
          </div>
        ) : userIdeas?.length === 0 && !loading ? (
          <EmptyIdeasChat
            title={"No ideas found"}
            description={"No ideas found..."}
          />
        ) : (
          userIdeas?.map((idea, index) => {
            const isSelected = currentIdeaId === idea.id;
            const isLastItem = index >= 4 && index === userIdeas.length - 1;

            return (
              <div key={idea.id} className="cursor-pointer">
                <Link
                  href={`/dashboard/chat/${idea.id}`}
                  className="block"
                >
                  <IdeaChatItem key={idea.id} idea={idea} isSelected={isSelected} isLastItem={isLastItem}/>
                </Link>
                <hr className="mt-1 mb-1" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}