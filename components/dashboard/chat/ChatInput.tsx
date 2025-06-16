"use client";

import {  useState } from "react";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface ChatInputProps {
  ideaId: number | undefined;
  userId: string;
  onMessageSent?: (value: string) => void
}

export default function ChatInput({
  ideaId,
  userId,
  onMessageSent
}: ChatInputProps) {
  const [input, setInput] = useState<string>("");

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSend = async () => {
    if (!input.trim() || !ideaId || !userId) return;

    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: input.trim(),
          ideaId: ideaId,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      // Limpiar el input después del envío exitoso
      setInput("");
      
      // Llamar al callback si existe
      if (onMessageSent) {
        onMessageSent(input);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message. Please try again.');
    }
  };

  return (
    <div className="px-2 border-2 border-base-200 rounded-box mx-4 mb-4 mt-2">
      <div className={`w-full flex items-center p-2`}>
        <Textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type your message..."
          ></Textarea>
      </div>
      <div className="flex items-center justify-between w-full pb-2">
        <div className="space-x-2 flex items-center">
          <div className="h-8 w-[1px] rotate-30 bg-base-200" />
        </div>

        <div>
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm btn-circle z-10 relative group-hover:bg-base-300 group-hover:border-base-300"
            onClick={handleSend}
          >
            <SendHorizonal size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}