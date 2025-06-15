"use client";

import { useState } from "react";
import { Filter, MailPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function IdeasChatToolbar({
  setIsFiltersPanelOpen,
  isFiltersPanelOpen,
}: {
  setIsFiltersPanelOpen: (value: boolean) => void;
  isFiltersPanelOpen: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputValueChange = (value: string) => {
    setSearchQuery(value);
  }

  return (
    <>
      <div className="form-control">
        <div className="flex items-center gap-2">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search ideas..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleInputValueChange(e.target.value)}
          />

          <label
            htmlFor="proactive-modal"
            className="btn btn-circle btn-ghost btn-sm cursor-pointer"
          >
            <MailPlus strokeWidth={1.5} className="h-5 w-5" />
          </label>

          <button
            onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
            className="btn btn-circle btn-ghost btn-sm relative mr-2"
          >
            <Filter />
          </button>
        </div>
      </div>
    </>
  );
}
