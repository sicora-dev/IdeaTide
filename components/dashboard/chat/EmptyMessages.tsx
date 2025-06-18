import { MessageCircleMore } from "lucide-react";

export default function EmptyMessages() {

  return (
    <>
      {/* ChatView equivalent */}
      <div className="overflow-y-auto grow-1 flex-1 max-md:hidden">
        <div className="flex flex-col overflow-y-auto h-full rounded-xl bg-base-100 fixed md:relative top-0 z-10 transition-transform duration-300 translate-x-0">
          {/* Central content with Lucide icon */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="bg-base-200/50 w-32 h-32 rounded-full flex items-center justify-center mb-4">
              <MessageCircleMore size={64} className="text-base-content/30" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-base-content/70 mb-2">No messages available</h3>
            <p className="text-sm text-base-content/50 text-center max-w-xs">
              Please select an idea from the list to view the messages.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}