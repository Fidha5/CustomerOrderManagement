interface LoadingSkeletonProps {
  count?: number
}

function LoadingSkeleton({ count = 5 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3" aria-live="polite" aria-busy="true">
      <div className="text-sm text-gray-600" role="status">
        Loading orders...
      </div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4 p-4">
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton