import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: "page" | "card" | "table";
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({ type = "page", rows = 5, className }: LoadingSkeletonProps) {
  if (type === "page") {
    return (
      <div className={className}>
        {/* PageHeader skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        {/* Cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        {/* Table skeleton */}
        <Skeleton className={`h-96 rounded-lg ${className || ""}`} />
      </div>
    );
  }

  if (type === "card") {
    return (
      <Skeleton 
        className={`h-48 rounded-lg ${className || ""}`}
      />
    );
  }

  // Table rows
  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full mb-2" />
      ))}
    </div>
  );
}
