import { PostItemSkeleton } from "@/components/post-item";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <Skeleton className="h-8 w-48 rounded-md mb-2" />
          <Skeleton className="h-5 w-64 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>
      
      <div className="w-full bg-background/30 backdrop-blur-sm border border-muted-foreground/20 rounded-lg p-4">
        <div className="relative max-w-full md:max-w-md">
          <div className="flex items-center w-full">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-20 ml-2 rounded-md" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <PostItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
} 