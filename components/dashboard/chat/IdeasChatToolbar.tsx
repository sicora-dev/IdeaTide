"use client";

import { useState } from "react";
import {  ListFilter, Search } from "lucide-react";
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
    <div>
      <div className="flex items-center gap-2">
        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search ideas..." 
          className="pl-8 !border-none !ring-0 !outline-none"
          value={searchQuery}
          onChange={(e) => handleInputValueChange(e.target.value)}
        />

        <button
          onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}
          className="btn btn-circle btn-ghost btn-sm relative mr-2"
        >
          <ListFilter />
        </button>
      </div>
    </div>
  );
}
