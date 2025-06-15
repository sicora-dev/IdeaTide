import { Inbox } from "lucide-react";

interface EmptyIdeasChatProps {
  title: string;
  description: string;
}

export default function EmptyIdeasChat({ title, description }: EmptyIdeasChatProps) {
  return (
    <div className="flex flex-col justify-center items-center py-8 px-4">
      <div className="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <Inbox size={32} className="text-base-content/30" />
      </div>
      
      <h3 className="text-lg font-medium text-base-content/70 mb-2">
        {title}
      </h3>
      <div className="w-[700px]"></div>
      
      <p className="text-sm text-base-content/50 text-center max-w-xs">
        {description}
      </p>
    </div>
  );
}
