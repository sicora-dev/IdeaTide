import { CircleAlert} from "lucide-react";
import { useState } from "react";

import { Idea } from "@/lib/types/ideas";

interface TicketItemProps {
  idea: Idea;
  isSelected: boolean;
  isLastItem: boolean;
}

export function IdeaChatItem({
  idea,
  isSelected,
  isLastItem
}: TicketItemProps) {
  const [selectedStatus, setSelectedStatus] = useState(idea.status);
  const [searchUser, setSearchUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div>
      <div
        className={`p-3 rounded-xl cursor-pointer transition-colors border-transparent hover:bg-input ${
          isSelected ? "sm:border sm:border-accent" : ""
        }`}
      >
        {/* Título del idea y estado */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1 items-center max-w-[60%]">
            <h3 className="font-bold capitalize truncate">
              {idea.title?.toLocaleLowerCase() ?? "unknown"}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm truncate max-w-[90%]">
            {idea.description || "No description available"}
          </h4>
        </div>
      </div>
    </div>
  );
}