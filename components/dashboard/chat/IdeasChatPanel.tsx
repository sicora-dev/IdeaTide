"use client";

import { useEffect, useState } from "react";
import { IdeasChatToolbar } from "@/components/dashboard/chat/IdeasChatToolbar";
import IdeasChatList from "./IdeasChatList";
import { usePathname } from "next/navigation";

export default function IdeasChatPanel() {
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false);
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
      className={`max-md:w-full max-md:overflow-x-hidden relative flex  ${isFiltersPanelOpen ? "gap-5" : ""} ${shouldHideOnMobile ? "max-md:hidden" : ""}`}
    >
      <div className="max-md:w-full">
        <div className="h-full w-full overflow-y-hidden flex md:w-96 flex-col">
          <IdeasChatToolbar
            setIsFiltersPanelOpen={setIsFiltersPanelOpen}
            isFiltersPanelOpen={isFiltersPanelOpen}
          />
          <IdeasChatList />
        </div>
      </div>

      {isFiltersPanelOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40 max-md:w-full"
          onClick={() => setIsFiltersPanelOpen(false)}
        ></div>
      )}

      <div
        className={`max-md:w-full transition-transform duration-300 max-md:pr-6 max-md:pb-6 ease-in-out ${
          isFiltersPanelOpen
            ? "absolute top-0 right-0 w-[90%] h-full z-50 md:relative md:w-auto md:right-auto translate-x-0"
            : "translate-x-full md:translate-x-0"
        }`}
      >
        {/* <FiltersPanel
          isOpen={isFiltersPanelOpen}
          onClose={() => setIsFiltersPanelOpen(false)}
        /> */}
      </div>
    </div>
  );
}
