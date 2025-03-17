import { useState, useEffect } from "react";
import pb from "../../lib/pocketbase";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Navbar from "../components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, ExternalLinkIcon } from "lucide-react";
import React from "react";

// Define TypeScript interfaces
interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  Department: string;
  image?: string;
  created: string;
  expand?: {
    user: User;
  };
}

interface User {
  id: string;
  username: string;
  avatar?: string;
}

const EventsList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('ZHCET');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const records = await pb.collection("events").getList(1, 50, {
          sort: "-created",
          filter: "date != null", // Only get posts with dates (events)
          expand: "user",
        });
        const fetchedEvents = records.items as Event[];
        setEvents(fetchedEvents);
        const filtered = fetchedEvents.filter(event => event.Department === 'ZHCET');
        setFilteredEvents(filtered);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  
  useEffect(() => {
    const filtered = events.filter(event => event.Department === selectedCategory);
    setFilteredEvents(filtered);

  }, [selectedCategory]);

  const getImageUrl = (event: Event) => {
    if (!event.image) return "/placeholder-event.jpg";
    return pb.files.getUrl(event, event.image);
  };

  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "No date specified";
    try {
      const date = new Date(dateStr);
      return format(date, "MMMM dd, yyyy 'at' h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <>
      <Navbar search={true} />
      <div className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="flex flex-col items-center mb-8 text-center w-[calc(100vw-6px-2rem)]">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Explore Events</h1>
          <p className="text-gray-600 dark:text-gray-300">Opportunities that are creating a buzz among your peers!</p>
        </div>
        
        <div className="max-w-[90vw] w-fit mx-auto overflow-hidden pb-2 mb-6 px-0 sm:px-10 relative">
          <div className="flex justify-start sm:justify-center gap-1 bg-gray-50 py-1 px-10 sm:px-3 text-xs sm:text-sm text-black/80 rounded-full overflow-x-auto scrollbar-hide">
            {["ZHCET", "Computer Science", "CEC", "MBA", "Commerce", "Arts", "Miscellaneous", "Engineering", "Law", "Medical"].map((category) => (
              <span
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`py-1 sm:py-2 px-3 sm:px-5 rounded-full cursor-pointer whitespace-nowrap ${
            selectedCategory === category ? "bg-white shadow-sm border-[1px]" : "border-transparent border-[1px]"
          }`}
              >
          {category}
              </span>
            ))}
          </div>
          <button
            className="h-8 w-8 absolute sm:hidden right-0 top-[40%] transform -translate-y-1/2 bg-gray-200 text-gray-600 rounded-full  shadow-md hover:bg-gray-300"
            onClick={() => {
              const container = document.querySelector(".overflow-x-auto");
              if (container) {
          container.scrollBy({ left: 200, behavior: "smooth" });
              }
            }}
          >
            &gt;
          </button>
          <button
            className="h-8 w-8 absolute sm:hidden left-0 top-[40%] transform -translate-y-1/2 bg-gray-200 text-gray-600 rounded-full  shadow-md hover:bg-gray-300"
            onClick={() => {
              const container = document.querySelector(".overflow-x-auto");
              if (container) {
          container.scrollBy({ left: -200, behavior: "smooth" });
              }
            }}
          >
            &lt;
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="bg-background-light rounded-lg overflow-hidden shadow-md border border-border flex flex-col"
              >
                <Skeleton className="h-48 w-[18rem]" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-secondary text-primary rounded hover:bg-secondary/80"
            >
              Try Again
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-lg">No upcoming events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mx-auto">
            {filteredEvents.map((event) => (
              <Link
                to={`/event/${event.id}`}
                key={event.id}
                className="w-full font-normal text-xs bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border flex flex-col"
              >
                <div className="h-32 sm:h-48 w-full overflow-hidden">
                  <img
                    src={getImageUrl(event)}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-event.jpg";
                    }}
                  />
                </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <h2 className="text-base sm:text-xl text-black font-semibold mb-1 sm:mb-2 line-clamp-2">
                    {event?.name}
                  </h2>
                  <p className="text-muted-foreground mb-2 sm:mb-4 line-clamp-2">
                    {event?.description}
                  </p>
                  <div className="mt-auto space-y-1 sm:space-y-2">
                    <div className="flex items-center  text-muted-foreground">
                      <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-black" />
                        <span className="truncate">{format(new Date(event?.date), "MMMM dd, yyyy")}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-black" />
                      <span className="truncate">{event?.location || "Online"}</span>
                    </div>
                  </div>
                </div>
                {event.location === "Online" && (
                  <Badge className="absolute top-2 right-2 bg-blue-500 text-[10px] sm:text-xs">
                    Online
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EventsList;