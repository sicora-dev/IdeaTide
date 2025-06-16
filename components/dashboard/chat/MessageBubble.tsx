"use client";
interface MessageBubbleProps {
  message: any;
  ideaId: number | undefined;
}

const MessageContent = ({ content }: { content: string }) => {
  console.log("MessageContent", content);
  const formattedContent = content

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
        <div className={`max-w-full px-4 py-2 rounded-lg long-text relative chat-bubble ${isUserMessage ? "text-primary" : ""} ${
          isUserMessage ? "bg-rainbow" : "bg-accent text-white"
        }`}>
          {/* Mostrar el mensaje original o traducido */}
          <MessageContent content={message.content} />
        </div>
      </div>
    </div>
  );
}