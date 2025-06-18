import { Button } from "@/components/ui/button";
import { createNewSession, fetchSessions } from "@/lib/actions/chat";
import { getAuthenticatedUser } from "@/libs/supabase/client/auth";
import { Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}


const fetcher = () => getAuthenticatedUser();

export function SessionsPanel({ isOpen, onClose }: FiltersPanelProps) {
  const params = useParams();
  const router = useRouter();
  const { data: user } = useSWR('user-session-panel', fetcher, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
      suspense: false,
    });
  const [ideaId, setIdeaId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  useEffect(() => {
    const ideaIdParam = params.ideaId as string | undefined;
    if (ideaIdParam) {
      const parsedId = parseInt(ideaIdParam, 10);
      if (!isNaN(parsedId)) {
        setIdeaId(parsedId);
      } else {
        setIdeaId(null);
      }
    }
  }, [params.ideaId]);

  const { data: sessions, error, isLoading, mutate } = useSWR(
    isOpen && ideaId && user?.user?.id ? [`sessions`, ideaId, user.user.id] : null,
    async ([, ideaId, userId]) => {
      const result = await fetchSessions(ideaId, userId);
      return result || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  const handleCreateNewSession = async () => {
    if (!ideaId || !user?.user?.id || isCreating) return;

    setIsCreating(true);
    try {
      const newSession = await createNewSession(ideaId, user.user.id);
      
      // Actualizar la lista de sesiones
      await mutate();
      
      // Navegar a la nueva sesión
      router.push(`/dashboard/chat/${ideaId}/sessions/${newSession.id}`);
      
      // Cerrar el panel en móvil
      onClose();
    } catch (error) {
      console.error('Error creating new session:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSessionClick = (sessionId: string) => {
    router.push(`/dashboard/chat/${ideaId}/sessions/${sessionId}`);
    onClose(); // Cerrar panel en móvil
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-secondary rounded-xl w-80 max-md:w-full">
      {/* Header Sticky */}
      <div className="sticky top-0 space-y-4 z-50 bg-secondary px-4 pt-4 pb-4 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Sesiones</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Button
          variant="default"
          onClick={handleCreateNewSession}
          disabled={isCreating || !ideaId || !user?.user?.id}
          className="btn btn-primary bg-rainbow text-primary btn-sm w-full gap-2"
        >
          {isCreating ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Creando...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Nueva Sesión
            </>
          )}
        </Button>
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 mb-2">
        {isLoading && (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error mb-4">
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {!isLoading && !error && sessions?.length === 0 && (
          <div className="text-center py-8 text-base-content/60">
            <p>No hay sesiones disponibles</p>
          </div>
        )}
        
        {!isLoading && Array.isArray(sessions) && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Button
                variant="ghost"
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className="flex flex-col items-start w-full gap-0 rounded-lg cursor-pointer transition-colors text-left py-7"
              >
                <div className="font-medium text-sm">
                  {session.title || `Sesión ${session.id.slice(0, 8)}`}
                </div>
                <div className="text-xs text-base-content/60 mt-1">
                  {new Date(session.created_at).toLocaleDateString()}
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}