import React from "react";
import { Loader2, Calendar, MapPin, Users } from "lucide-react";
import useFetchEventDetails from "@/utils/useFetchEventDetails";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { POCKET_API_URL } from "../constants/urls.js";
import EventRegistration from "../components/EventRegistration";

const Event = () => {
  const { eventId } = useParams();
  const { event, loading, error } = useFetchEventDetails(eventId);

  if (loading) {
    return (
      <>
        <Navbar search={false} />
        <div className="flex bg-background min-h-screen min-w-[calc(100vw_-_6px)] justify-center text-primary-text pt-[15vh]">
          <div className="w-full flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
          </div>
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar search={false} />
        <div className="flex bg-background min-h-screen min-w-[calc(100vw_-_6px)] justify-center text-primary-text pt-[15vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Error loading event</h2>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar search={false} />
      <div className="flex bg-background min-h-screen min-w-[calc(100vw_-_6px)] justify-center sm:justify-around text-primary-text pt-[10vh] md:pt-[15vh] md:pb-[10vh]">
        <div className="w-[100%] md:w-[55vw] h-fit flex flex-col gap-5 border-[1px] border-white/20 p-5">
          {/* Event Title */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-bold">{event.name}</h1>
            <div className="text-sm text-muted-foreground">
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          
          {/* Event Image */}
          {event.image && (
            <div>
              <img 
                src={`${POCKET_API_URL}${event?.collectionId}/${eventId}/${event.image}`}
                alt={event.name} 
                className="w-full max-h-[60vh] object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Event Details */}
          <div className="flex flex-col gap-3 text-[16px] border-b border-white/20 py-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-12 w-12 text-primary bg-secondary p-3 rounded-md" />
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Date</span>
                <span>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-12 w-12 text-primary bg-secondary p-3 rounded-md" />
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Venue</span>
                <span>{event.location || "Online"}</span>
              </div>
            </div>
            
            {event.max_team_members && (
              <div className="flex items-center space-x-3">
                <Users className="h-12 w-12 text-primary bg-secondary p-3 rounded-md" />
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Team Size</span>
                  <span>{event.max_team_members}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Event Description */}
          <div className="py-5 text-[18px] sm:text-[20px] text-primary-post -tracking-[0.009em] leading-[32px]">
            {event.description}
          </div>
          
        </div>
          {/* Registration Component */}
          {event.registration && eventId && (
            <EventRegistration 
              eventId={eventId} 
              eventName={event.name} 
              maxTeamMembers={event.max_team_members || 1} 
            />
          )}
      </div>
    </>
  );
};

export default Event;