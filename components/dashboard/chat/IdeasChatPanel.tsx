"use client";

import { useEffect, useState } from "react";
import { IdeasChatToolbar } from "@/components/dashboard/chat/IdeasChatToolbar";
import IdeasChatList from "./IdeasChatList";
import { usePathname } from "next/navigation";
import { SessionsPanel } from "./SessionsPanel";

export default function IdeasChatPanel() {
  const [isSessionsPanelOpen, setIsSessionsPanelOpen] = useState(false);
  const [shouldHideOnMobile, setShouldHideOnMobile] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    const chatIndex = pathSegments.findIndex(segment => segment === 'chat');
    const hasIdAfterChat = chatIndex !== -1 && pathSegments[chatIndex + 1];
    
    setShouldHideOnMobile(!!hasIdAfterChat);
  }, [pathname]);

  return (
    <div
      className={`max-md:w-full max-md:overflow-x-hidden relative flex ${isSessionsPanelOpen ? "gap-5" : ""} ${shouldHideOnMobile ? "max-md:hidden" : ""}`}
    >
      {/* Main Panel */}
      <div className="max-md:w-full">
        <div className="h-full w-full overflow-y-hidden flex md:w-96 flex-col bg-gradient-to-b from-card to-card/50 border-2 border-border/50 rounded-xl shadow-sm">
          <IdeasChatToolbar
            setIsFiltersPanelOpen={setIsSessionsPanelOpen}
            isFiltersPanelOpen={isSessionsPanelOpen}
          />
          <div className="flex-1 overflow-y-auto">
            <IdeasChatList />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSessionsPanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40 max-md:w-full transition-opacity duration-300"
          onClick={() => setIsSessionsPanelOpen(false)}
        ></div>
      )}

      {/* Sessions Panel */}
      <div
        className={`max-md:w-full transition-all duration-300 max-md:pr-6 max-md:pb-6 ease-in-out ${
          isSessionsPanelOpen
            ? "absolute top-0 right-0 w-[90%] h-full z-50 md:relative md:w-auto md:right-auto translate-x-0 opacity-100"
            : "translate-x-full md:translate-x-0 opacity-0 md:opacity-100"
        }`}
      >
        <div className="h-full bg-gradient-to-b from-card to-card/50 border-2 border-border/50 rounded-xl shadow-lg">
          <SessionsPanel
            isOpen={isSessionsPanelOpen}
            onClose={() => setIsSessionsPanelOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}