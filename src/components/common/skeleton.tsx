import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="p-4 w-full border rounded-xl shadow-sm space-y-3 animate-pulse">
      <div className="flex items-center justify-between space-x-2">
        <Skeleton className="h-5 w-32 rounded-md" /> 
        <Skeleton className="h-5 w-16 rounded-md" /> 
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-4 w-48 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" /> 
      </div>
      <div className="space-y-1">
        <Skeleton className="h-4 w-48 rounded-md" /> 
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>
    </div>
  );
};

export default SkeletonCard;
