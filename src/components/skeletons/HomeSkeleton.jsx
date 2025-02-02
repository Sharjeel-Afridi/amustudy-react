import { Skeleton } from "@/components/ui/skeleton";

const HomeSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 w-full text-sm font-bold">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="md:w-[100%] flex sm:flex-row flex-col items-center sm:px-5 my-2 sm:bg-background "
        >
          <div className="w-full flex justify-between gap-0 cursor-pointer pb-2 border-b-[1px] ">
            <div className="flex sm:flex-row flex-col gap-5 sm:gap-0 w-3/4 md:inline">
              <div>
                <div className="flex items-center gap-3 mb-[16px] pl-2">
                  <Skeleton className="h-[20px] w-[20px]"></Skeleton>
                  <Skeleton className="w-[100px] h-[15px]"></Skeleton>
                </div>
                <Skeleton className="px-2 w-[300px] h-[20px]"></Skeleton>
                <Skeleton className="px-2 mt-2 w-[200px] h-[20px] "></Skeleton>
                <Skeleton className="w-[250px] h-[15px]"></Skeleton>
              </div>
            </div>
            <div className="h-[25vh] w-1/4 hidden sm:flex items-center sm:px-0 pr-2 rounded-lg">
            <Skeleton className="w-full h-full object-cover sm:rounded-xs rounded-lg"></Skeleton>
            </div>
          </div>
          <div className="h-[35vh] w-full  sm:hidden flex items-center sm:px-0 pr-2 rounded-lg">
            <Skeleton className="w-full h-full object-cover sm:rounded-xs rounded-lg"></Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeSkeleton;