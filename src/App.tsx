import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Navbar from "./components/Navbar";
import LazyImage from "./components/LazyImage";
import UserContext from "./utils/UserContext";
import useFetchData from "./utils/useFetch";
import Plus from "/plus-black.png";
import HomeIcon from "/homeBlack.png";
import CalendarIconImg from "/calendarBlack.png";
import MemoizedEvents from "./components/Events";
import userBlack from "/userBlack.png";
import HomeSkeleton from "./components/skeletons/HomeSkeleton";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import pb from "../lib/pocketbase";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, ExternalLinkIcon } from "lucide-react";
import React from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [home, setHome] = useState(true);
  const [fetchEvents, setFetchEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  
  const timerRef = useRef(null);
  const isPausedRef = useRef(false);

  const { posts, events, showError, isLoading } = useFetchData();
  const navigate = useNavigate();
  const { loggedinUser } = useContext(UserContext);
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });

  // Use effect for tracking current slide and setting up auto-scroll
  useEffect(() => {
    if (!api) {
      return;
    }
    
    // Update slide count and current position
    const updateState = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() || 0);
    };
    
    updateState();

    // Set up event listener for slide changes
    api.on("select", updateState);

    // Start the auto-scroll timer if we have slides and not already running
    const startAutoScroll = () => {
      // Clear any existing timer first
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Only start if we have slides and auto-scroll isn't paused
      const totalSlides = api.scrollSnapList().length;
      
      if (totalSlides > 0 && !isPausedRef.current) {
        timerRef.current = setInterval(() => {
          const current = api.selectedScrollSnap() || 0;
          
          if (current >= totalSlides - 1) {
            // If at the last slide, go back to first
            api.scrollTo(0);
          } else {
            // Use scrollNext instead of next
            api.scrollNext();
          }
        }, 3000); // Increased interval to 3 seconds for better user experience
      }
    };

    // Initial timer start
    startAutoScroll();
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Remove the event listener
      api.off("select", updateState);
    };
  }, [api]); // Only depend on api changes

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isLargeScreen) {
      setHome(true);
    }
  }, [isLargeScreen]);

  useEffect(() => {
    const fetchEventsData = async () => {
      setLoading(true);
      try {
        const records = await pb.collection("events").getList(1, 50, {
          sort: "-created",
          filter: "date != null", // Only get posts with dates (events)
          expand: "user",
        });
        const fetchedEvents = records.items;
        setFetchEvents(fetchedEvents);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventsData();
  }, []);

  const getImageUrl = (event) => {
    if (!event.image) return "/placeholder-event.jpg";
    return pb.files.getUrl(event, event.image);
  };

  // Pause auto-scroll when hovering over carousel
  const handleMouseEnter = () => {
    isPausedRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Resume auto-scroll when mouse leaves
  const handleMouseLeave = () => {
    isPausedRef.current = false;
    
    if (!timerRef.current && api && count > 0) {
      timerRef.current = setInterval(() => {
        const total = api.scrollSnapList().length;
        const current = api.selectedScrollSnap() || 0;
        
        if (current >= total - 1) {
          api.scrollTo(0);
        } else {
          api.scrollNext();
        }
      }, 3000);
    }
  };

  return (
    <>
      <Navbar search={true} onSearch={handleSearch} post={true} />

      {fetchEvents.length !== 0 && (
        <div className="flex flex-col items-center">
          <div className="mt-[15vh] w-[80%] mx-auto">
            <div className="flex flex-row justify-between items-center mb-4">
              {/* <h2 className="font-bold text-xl">
                Featured Events
              </h2> */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex space-x-1">
                  {Array.from({ length: count }).map((_, index) => (
                    <span
                      key={index}
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        current === index ? "w-4 bg-blue-600" : "w-1.5 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <Carousel 
              setApi={setApi}
              className="w-full" 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              opts={{
                loop: true,
                align: "start",
              }}
            >
              <CarouselContent>
                {fetchEvents.map((event) => (
                  <CarouselItem className="sm:basis-1/3" key={event.id}>
                    <Link
                      to={`/event/${event.id}`}
                      className="w-full h-[100%] font-normal text-xs bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border flex flex-col relative"
                    >
                      <div className="h-[12rem] sm:h-[15rem] w-full overflow-hidden relative">
                        <img
                          src={getImageUrl(event)}
                          alt={event.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-event.jpg";
                          }}
                        />
                        {event?.location === "Online" && (
                          <Badge className="absolute top-2 right-2 bg-blue-500 text-[10px] sm:text-xs z-10">
                            Online
                          </Badge>
                        )}
                        <div className="absolute bottom-0 w-fit h-fit p-3 pt-1 rounded-tr-lg bg-white opacity-[0.98] z-10">
                          <h2 className="text-base sm:text-sm text-black font-semibold pt-2 mb-1 sm:mb-2 line-clamp-2">
                            {event?.name}
                          </h2>
                          <div className="mt-auto space-y-1 sm:space-y-2">
                            <div className="flex items-center text-muted-foreground">
                              <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-black" />
                              <span className="truncate">
                                {format(new Date(event?.date), "MMMM dd, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-black" />
                              <span className="truncate">
                                {event?.location || "Online"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          <div>
            <Link
              to="/events"
              className="w-fit inline-flex items-center mt-5 px-4 py-4 rounded-full bg-[#00376f] text-white shadow-md transition-all hover:shadow-lg hover:scale-105 group"
            >
              <span className="relative z-10 font-medium text-sm text-white whitespace-nowrap flex items-center">
                View All Events
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      )}
      {home ? (
        <main className="min-h-screen w-[100vw] flex flex-col sm:flex-row sm:items-start items-center bg-background text-primary-text font-lato overflow-hidden">
          <div className="flex flex-col gap-5 items-start pl-2 sm:px-10 w-[100%] sm:w-[72%] pt-[15vh] pb-[10vh] rounded-md ">
            <h1 className="text-[1.7rem] font-bold pl-2 sm:pl-7">
              Recent Posts
            </h1>
            {isLoading ? (
              <HomeSkeleton />
            ) : (
              <div className="flex flex-col gap-5 w-full text-sm font-bold">
                {showError && (
                  <h1>Soemthing&apos;s wrong please comeback later!</h1>
                )}
                {filteredPosts.map((post, index) => (
                  <div
                    key={index}
                    className="md:w-[100%] flex items-center sm:px-5 my-2 sm:bg-background "
                  >
                    <div
                      onClick={() => handlePostClick(post.id)}
                      className="w-full flex flex-col justify-between gap-0 cursor-pointer pb-2 border-b-[1px] "
                    >
                      <div className="flex flex-col gap-5 sm:gap-0 md:inline">
                        <div className="flex flex-row sm:items-center items-start justify-between gap-3 pb-5 px-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center sm:h-[20px] sm:w-[20px] h-[40px] w-[40px] border-[1px] border-gray-500 rounded-full overflow-hidden">
                              <img
                                className="h-fit w-full  rounded-full"
                                src={
                                  post?.expand?.user?.avatarUrl
                                    ? post.expand.user.avatarUrl
                                    : post?.expand?.user?.avatar
                                    ? `https://amustud.pockethost.io/api/files/${post.expand.user.collectionId}/${post.expand.user.id}/${post.expand.user.avatar}`
                                    : userBlack
                                }
                                alt="User Avatar"
                                loading="lazy"
                              />
                            </div>
                            <span className="font-medium text-[13px]">
                              {post?.expand?.user?.username}
                            </span>
                          </div>
                          <div>
                            <p className="text-[#6a7180] px-2 text-sm font-medium">
                              {new Date(post.created).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-full sm:w-3/4">
                          <h3 className="font-bold text-[20px] sm:text-2xl leading-[24px] text-left px-2 cursor-pointer">
                            {post.title}
                          </h3>
                          <p className="mb-4 text-left text-[16px] font-medium text-gray-600 px-2 pt-[8px]">
                            {post.text.slice(0, 200)}...
                          </p>
                        </div>
                        {post.image !== "" && (
                          <div className="sm:h-[25vh] h-fit w-full sm:w-1/4 hidden sm:flex items-center sm:px-0 pr-2 rounded-lg">
                            <img
                              src={`https://amustud.pockethost.io/api/files/${post.collectionId}/${post.id}/${post.image}`}
                              className="w-full h-full object-cover sm:rounded-xs rounded-lg"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                      {post.image !== "" && (
                        <div className="h-fit w-[70%] sm:hidden flex items-center sm:px-0 pr-2 rounded-lg">
                          <img
                            src={`https://amustud.pockethost.io/api/files/${post.collectionId}/${post.id}/${post.image}`}
                            className="w-full h-full object-cover sm:rounded-xs rounded-lg"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <MemoizedEvents events={events} mobile={false} />
        </main>
      ) : (
        <MemoizedEvents events={events} mobile={true} />
      )}

      <div className="fixed bottom-0 sm:hidden flex items-center justify-around w-full h-[10vh] bg-background text-primary-text border-t-[1px] border-primary-dark">
        <button
          className={`flex flex-col items-center cursor-pointer border-b-[3px] ${
            home ? "border-primary-text" : "border-transparent"
          }`}
          onClick={() => setHome(true)}
        >
          <img src={HomeIcon} className="h-[30px] w-fit" />
          <span className="text-[12px] text-primary-text">Home</span>
        </button>
        <div>
          <button
            className="sm:hidden inline rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-white transition-colors duration-200  focus:outline focus:outline-[4px] focus:outline-auto focus:outline-webkit-focus-ring-color"
            onClick={() => {
              if (loggedinUser !== "") {
                navigate("/new");
              } else {
                navigate("/login");
              }
            }}
          >
            <img src={Plus} />
          </button>
        </div>
        <div
          className={`flex flex-col items-center cursor-pointer border-b-[3px] ${
            home ? "border-transparent" : "border-primary-text"
          }`}
          onClick={() => setHome(false)}
        >
          <img src={CalendarIconImg} className="h-[30px] w-fit" />
          <span className="text-[12px] text-primary-text">Calendar</span>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
