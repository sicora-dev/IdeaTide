import { CircleAlert, MessageCircle, Calendar } from "lucide-react";
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
  
  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className={`w-full transition-all duration-200 ${!isLastItem ? 'mb-3' : ''}`}>
      <div
        className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 
          ${isSelected 
            ? "bg-primary/10 border-2 border-primary/20 shadow-md" 
            : "bg-card hover:bg-accent/50 border-2 border-transparent hover:border-accent/30"
          } hover:shadow-lg hover:scale-[1.02]`}
      >
        {/* Indicador de selección */}
        {isSelected && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
        )}

        {/* Header con título y estado */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <h3 className="font-semibold text-base capitalize truncate text-foreground group-hover:text-primary transition-colors">
              {idea.title?.toLowerCase() ?? "Untitled Idea"}
            </h3>
          </div>
          
          {/* Badge de estado */}
          {idea.status && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(idea.status)}`}>
              {idea.status}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {idea.description || "No description available"}
          </p>
        </div>

        {/* Footer con metadatos */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {/* Ícono de mensajes */}
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat</span>
            </div>
            
            {/* Fecha de creación */}
            {idea.created_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(idea.created_at.toString())}</span>
              </div>
            )}
          </div>

          {/* Indicador de actividad reciente */}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600">Active</span>
          </div>
        </div>

        {/* Efecto de hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    </div>
  );
}