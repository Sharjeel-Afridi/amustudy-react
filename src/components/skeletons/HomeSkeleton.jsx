import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const HomeSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 w-full text-sm font-bold">
      {[...Array(5)].map((_, index) => (
        <div 
          key={index}
          className="md:w-[100%] flex items-center sm:px-5 my-2 sm:bg-background"
        >
          <div className="w-full flex flex-col justify-between gap-0 cursor-pointer pb-2 border-b-[1px]">
            {/* User info and date row */}
            <div className="flex flex-col gap-5 sm:gap-0 md:inline">
              <div className="flex flex-row sm:items-center items-start justify-between gap-3 pb-5 px-2">
                <div className="flex items-center gap-3">
                  {/* User avatar skeleton */}
                  <div className="flex items-center sm:h-[20px] sm:w-[20px] h-[40px] w-[40px] border-[1px] border-gray-500 rounded-full overflow-hidden">
                    <Skeleton className="h-[50vh] w-[35vw]" />
                  </div>
                  {/* Username skeleton */}
                  <Skeleton className="h-4 w-24" />
                </div>
                <div>
                  {/* Date skeleton */}
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>

            {/* Post content */}
            <div className="flex flex-col justify-between">
              <div className="w-full sm:w-7/12">
                {/* Title skeleton */}
                <div className="px-2">
                  <Skeleton className="h-7 w-5/6 mb-3" />
                </div>
                {/* Text content skeleton with multiple lines */}
                <div className="px-2 space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-9/12" />
                </div>
              </div>
              
              {/* Desktop image skeleton - hidden on mobile, shown on sm and up */}
              <div className="h-32 w-[40vw] hidden sm:block sm:px-0 pr-2 rounded-lg">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            </div>
            
            {/* Mobile image skeleton - shown on mobile, hidden on sm and up */}
            <div className="h-32 w-[70%] sm:hidden mt-4 sm:px-0 pr-2 rounded-lg">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeSkeleton;