
import { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import IdeasChatPanel from "@/components/dashboard/chat/IdeasChatPanel";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <main className="h-full flex flex-col pt-2">
      <div className="h-full flex gap-5 overflow-y-auto relative">
        <NuqsAdapter>
          <IdeasChatPanel />
        </NuqsAdapter>
        {children}
      </div>
    </main>
  );
}
