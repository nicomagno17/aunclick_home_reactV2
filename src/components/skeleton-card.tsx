'use client'

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden animate-pulse ${className}`}>
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        
        {/* Source skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
          <div className="h-3 bg-gray-200 rounded w-8 ml-1"></div>
        </div>
        
        {/* Price skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  )
}