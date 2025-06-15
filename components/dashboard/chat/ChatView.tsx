"use client";

import ChatBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { use } from "react";
import { SelectIdea } from "@/lib/db/schema";

interface ChatViewProps {
  ideaPromise: Promise<SelectIdea | null>;
  messagesPromise: Promise<any[]>;
}

export default function ChatView({
  ideaPromise,
  messagesPromise,
}: ChatViewProps) {
  const ideaDetails = use(ideaPromise);
  const initialMessages = use(messagesPromise);

  console.log("ChatView render");
  const sortedMessages = [...initialMessages].sort(
    (a, b) => new Date(a.received_at).getTime() - new Date(b.received_at).getTime()
  );

  return (
    <>
      <div className={`max-md:absolute max-md:translate-x-[100dvw] overflow-y-auto grow-1 flex-1`}>
        <div
          className={`flex flex-col overflow-y-auto h-full rounded-xl bg-base-100 md:relative top-0 left-0 transition-transform duration-300 translate-x-full md:translate-x-0`}
        >
          {/* Header del Chat */}
          <div className="m-4 p-4 bg-base-200 flex items-center justify-between rounded-xl">
            {/* Izquierda: Botón de volver y Nombre del cliente */}
            <div className="flex items-center gap-3">
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
            {sortedMessages.map((msg, index, array) => {
              const currentDate = new Date(msg.received_at).toDateString();
              const previousDate =
                index > 0 ? new Date(array[index - 1].received_at).toDateString() : null;

            const showDateLabel = currentDate !== previousDate;
            const nextMessage = index < array.length - 1 ? array[index + 1] : null;

              return (
                <div key={`${msg.id}-${index}`}>
                  {showDateLabel && (
                    <div className="flex items-center justify-center mb-5">
                      <div className="rounded-lg py-2 px-4 w-fit">
                        {currentDate === new Date().toDateString()
                          ? "Today"
                          : new Date(msg.received_at).toLocaleDateString("en-US", {
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
              addMessage={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  );
}