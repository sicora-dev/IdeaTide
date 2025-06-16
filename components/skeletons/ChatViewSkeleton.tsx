export default function ChatViewSkeleton() {
  return (
    <div className="max-md:translate-x-[100dvw] overflow-y-auto grow-1 flex-1">
      <div className="flex flex-col overflow-y-auto h-full rounded-xl bg-white md:relative top-0 left-0 transition-transform duration-300 translate-x-full md:translate-x-0">
        {/* Header Skeleton */}
        <div className="m-4 p-4 bg-gray-100 flex items-center justify-between rounded-xl">
          <div className="flex items-center gap-3">
            <div className="h-7 w-32 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Messages Container Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Date Label Skeleton */}
          <div className="flex items-center justify-center mb-5">
            <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Message Bubbles Skeleton */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-4`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                index % 2 === 0 ? 'bg-gray-200' : 'bg-blue-500'
              }`}>
                <div className={`h-4 w-full ${
                  index % 2 === 0 ? 'bg-gray-400' : 'bg-blue-300'
                } rounded mb-2 animate-pulse`}></div>
                <div className={`h-4 w-3/4 ${
                  index % 2 === 0 ? 'bg-gray-400' : 'bg-blue-300'
                } rounded animate-pulse`}></div>
              </div>
            </div>
          ))}

          {/* Another Date Label */}
          <div className="flex items-center justify-center my-5">
            <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* More Message Bubbles */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index + 5} className={`flex ${(index + 5) % 2 === 0 ? 'justify-start' : 'justify-end'} mb-4`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                (index + 5) % 2 === 0 ? 'bg-gray-200' : 'bg-blue-500'
              }`}>
                <div className={`h-4 w-full ${
                  (index + 5) % 2 === 0 ? 'bg-gray-400' : 'bg-blue-300'
                } rounded mb-2 animate-pulse`}></div>
                <div className={`h-4 w-2/3 ${
                  (index + 5) % 2 === 0 ? 'bg-gray-400' : 'bg-blue-300'
                } rounded animate-pulse`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Skeleton */}
        <div className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}