"use client";
interface MessageBubbleProps {
  message: any;
  ideaId: number | undefined;
}

const MessageContent = ({ content }: { content: string }) => {
  const formattedContent = content
    .replace(/\n\s*\n/g, '\n')
    .trim();

  return (
    <div className="whitespace-pre-line">
      {formattedContent}
    </div>
  );
};

export default function MessageBubble({ ideaId, message }: MessageBubbleProps) {
  const isUserMessage = message.type === "user";

  return (
    <div className={`flex chat ${isUserMessage ? "justify-end chat-end" : "justify-start chat-start"} mb-4`}>
      <div className="max-w-[80%]">
        <div className={`max-w-full px-4 py-2 rounded-lg long-text relative chat-bubble ${isUserMessage ? "dark:text-[#a6adbb] text-primary" : ""} ${
          isUserMessage 
            ? message.failure 
              ? "bg-base-200/60 border-2 border-error/20" 
              : "bg-base-200"
            : "bg-accent text-white"
        }`}>

          {/* Mostrar el mensaje original o traducido */}
          <MessageContent content={message.message} />
        </div>
        <div
          className={`flex flex-col ${
            isUserMessage ? "items-end" : "items-start"
          } mt-2 gap-1`}
        >
          <span className={`font-light text-sm text-gray-500`}>
            {message.received_at}
          </span>
        </div>
      </div>
    </div>
  );
}