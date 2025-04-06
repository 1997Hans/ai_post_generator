import { Skeleton } from '@/ui/skeleton'

export function PostSkeleton() {
  return (
    <div className="space-y-4 my-6 w-full">
      {/* Image skeleton */}
      <Skeleton className="w-full h-64 rounded-lg" />
      
      {/* Content skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
      </div>
      
      {/* Hashtags skeleton */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
    </div>
  )
} 