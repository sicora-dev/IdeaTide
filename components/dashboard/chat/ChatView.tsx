"use client";

import ChatBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { use, useEffect, useState } from "react";
import { SelectIdea } from "@/lib/db/schema";
import useSWR from "swr";
import { getAuthenticatedUser } from "@/libs/supabase/client/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ChatViewProps {
  ideaPromise: Promise<SelectIdea | null>;
  messagesPromise: Promise<any[]>;
}

const fetcher = () => getAuthenticatedUser()

export default function ChatView({
  ideaPromise,
  messagesPromise,
}: ChatViewProps) {
  const ideaDetails = use(ideaPromise);
  const initialMessages = use(messagesPromise);
  const [messages, setMessages] = useState<any[]>([]);
  const { data: user, isLoading: loading } = useSWR('user-info-chat', fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60000,
    suspense: false,
  });

  useEffect(() => {
    const sortedMessages = [...initialMessages].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    setMessages(sortedMessages);
  }, [initialMessages]);

  console.log("ChatView render");
  console.log("messagesPromise", initialMessages);

  const onAddMessage = (newMessageContent: string) => {
    // Crear el mensaje optimista (se muestra inmediatamente)
    const optimisticMessage = {
      id: `temp-${Date.now()}`, // ID temporal
      content: newMessageContent,
      created_at: new Date().toISOString(),
      type: 'user',
      user_id: user?.user.id,
      idea_id: ideaDetails?.id,
    };

    // Actualizar el estado local inmediatamente
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
  };

  return (
    <>
      <div className={`overflow-y-auto grow-1 flex-1`}>
        <div
          className={`flex flex-col overflow-y-auto h-full border-2 rounded-md bg-popover  md:relative top-0 left-0 transition-transform duration-300`}
        >
          {/* Header del Chat */}
          <div className="m-4 p-4 flex items-center justify-between rounded-xl bg-secondary">
            {/* Izquierda: Botón de volver y Nombre del cliente */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard/chat">
                <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h3 className="font-bold text-lg capitalize">{ideaDetails?.title}</h3>        
            </div>
          </div>

          {/* Contenido del chat (Mensajes e Input) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages-container">
            {/* Spinner de carga inicial */}
            {!ideaDetails && (
              <div className="flex justify-center py-2">
                <div className="loading loading-spinner loading-md"></div>
              </div>
            )}

            {/* Listado de Mensajes */}
            {messages.map((msg, index, array) => {
              const currentDate = new Date(msg.created_at).toDateString();
              const previousDate =
                index > 0 ? new Date(array[index - 1].created_at).toDateString() : null;
              const showDateLabel = currentDate !== previousDate;

              return (
                <div key={`${msg.id}-${index}`}>
                  {showDateLabel && (
                    <div className="flex items-center justify-center mb-5">
                      <div className="rounded-lg py-2 px-4 w-fit">
                        {currentDate === new Date().toDateString()
                          ? "Today"
                          : new Date(msg.created_at).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                      </div>
                    </div>
                  )}
                  <ChatBubble 
                    key={msg.id}
                    ideaId={ideaDetails?.id} 
                    message={msg} 
                  />
                </div>
              );
            })}
          </div>

          {/* Input de Mensajes */}
          <div>
            <ChatInput
              ideaId={ideaDetails?.id}
              userId={user?.user.id}
              onMessageSent={onAddMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
}