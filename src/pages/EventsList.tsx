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

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const records = await pb.collection("events").getList(1, 50, {
          sort: "-created",
          filter: "date != null", // Only get posts with dates (events)
          expand: "user",
        });
        setEvents(records.items as Event[]);
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
        <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>

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
        ) : events.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-lg">No upcoming events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                to={`/event/${event.id}`}
                key={event.id}
                className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border flex flex-col"
              >
                <div className="h-48 w-[18rem] overflow-hidden">
                  <img
                    src={getImageUrl(event)}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-event.jpg";
                    }}
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-xl text-black font-semibold mb-2 line-clamp-2">
                    {event?.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event?.description}
                  </p>
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {formatEventDate(event?.date)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {event?.location || "Online"}
                    </div>
                  </div>
                </div>
                {event.location === "Online" && (
                  <Badge className="absolute top-2 right-2 bg-blue-500">
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