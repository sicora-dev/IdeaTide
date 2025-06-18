import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChatViewSkeleton() {
  return (
    <div className="overflow-y-auto grow-1 flex-1">
      <div className="flex flex-col overflow-y-auto h-full border-2 rounded-md bg-popover md:relative top-0 left-0 transition-transform duration-300">
        {/* Header del Chat - Skeleton */}
        <div className="m-4 p-4 flex items-center justify-between rounded-xl bg-secondary">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/chat">
              <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="h-7 w-48 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>

        {/* Contenido del chat - Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages-container">
          {/* Mensajes skeleton */}
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-4">
              {/* Mensaje del usuario */}
              <div className="flex justify-end">
                <div className="max-w-xs lg:max-w-md">
                  <div className="h-4 w-16 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="flex flex-col bg-primary items-end rounded-lg p-3 space-y-2">
                    <div className="h-4 w-full bg-primary-foreground rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-primary-foreground rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Mensaje de la IA */}
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="h-4 w-8 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="bg-muted rounded-lg p-3 space-y-2 w-52">
                    <div className="h-4 w-full bg-muted-foreground/20 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-muted-foreground/20 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-muted-foreground/20 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input de Mensajes - Skeleton */}
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-10 bg-muted rounded-md animate-pulse"></div>
            <div className="h-10 w-10 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}