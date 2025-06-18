"use client";

import {  useState } from "react";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  ideaId: number | undefined;
  userId: string;
  sessionId: string;
  onMessageSent?: (userInput: string, aiResponse: string) => void
}

export default function ChatInput({
  ideaId,
  userId,
  sessionId,
  onMessageSent
}: ChatInputProps) {
  const [input, setInput] = useState<string>("");

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSend = async () => {
    if (!input.trim() || !ideaId || !userId) return;

    
    try {
      const response = await fetch('/api/messages/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          ideaId: ideaId,
          userId: userId,
          sessionId: sessionId
        }),
      });

      if (response.status != 200) {
        throw new Error('Failed to send message: ' + response.statusText);
      }

      const result = await response.json();
      console.log('Message sent successfully 🎉:', result);
      
      // Limpiar el input después del envío exitoso
      setInput("");
      
      // Llamar al callback si existe
      if (onMessageSent) {
        onMessageSent(input, result.response);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message. Please try again.');
    }
  };

  return (
    <div className="px-2 border-2 border-base-200 rounded-box mx-4 mb-4 mt-2 flex">
      <div className={`w-full flex items-center p-2`}>
        <Textarea
        className="resize-none w-full h-16 bg-secondary border-0 focus:ring-0 focus:outline-none"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type your message..."
          ></Textarea>
      </div>
      <div className="items-center self-end justify-between w-fit pb-2">
        <Button
          variant={"default"}
          tabIndex={0}
          role="button"
          className="p-3 py-0 text-primary btn btn-sm btn-circle z-10 bg-rainbow group-hover:bg-rainbow-hover group-hover:border-base-300"
          onClick={handleSend}
        >
          <SendHorizonal size={16} />
        </Button>
      </div>
    </div>
  );
}