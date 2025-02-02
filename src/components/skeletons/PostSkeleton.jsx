import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="flex bg-background min-h-screen min-w-[calc(100vw_-_6px)] justify-center text-primary-text pt-[10vh] md:pt-[15vh] md:pb-[10vh]">
      <div className="w-[100%] md:w-[55vw] h-fit flex flex-col gap-5 border-[1px] border-white/20 p-5">
        {/* Post Header Skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Post Actions Skeleton */}
        <div className="flex gap-4">
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-10" />
        </div>

        {/* Image Skeleton */}
        <Skeleton className="h-60 w-full" />

        {/* Content Skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
