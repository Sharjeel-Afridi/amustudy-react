
import React, { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, PlusCircle, Loader2, Calendar, Clock, Users, MapPin } from "lucide-react";
import useFetchEventDetails from "@/utils/useFetchEventDetails";
import pb from "../../lib/pocketbase.js";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { POCKET_API_URL } from "../constants/urls.js";
import UserContext  from "../utils/UserContext";

const generateTeamCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

type TeamMember = {
  id: string;
  name: string;
};


const Event = () => {
  const { eventId } = useParams();
  const { event, loading, error } = useFetchEventDetails(eventId);
  const [teamName, setTeamName] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamCode, setTeamCode] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [newTeammate, setNewTeammate] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  

  const {userInfo} = useContext(UserContext);

  const fetchRegistrationDetails = async () => {
    if (!userInfo || !event?.id) return;

    try {
      const registrations = await pb
        .collection("eventRegistrations")
        .getList(1, 1, {
          filter: `event="${event.id}" && teamMembers~"${userInfo.id}"`,
          sort: "-created",
        });

      if (registrations.items.length > 0) {
        const registration = registrations.items[0];
        setTeamName(registration.teamName);
        setTeamCode(registration.teamCode);

        const teammates = await Promise.all(
          registration.teamMembers.map(async (id: string) => {
            const user = await pb
              .collection("users")
              .getFirstListItem(`id="${id}"`);
            return { id: id, name: user.name };
          })
        );

        setTeam(teammates);
        setShowRegistration(true);
      } else {
        setTeamName("");
        setTeamCode("");
        setTeam([{ id: userInfo.id, name: userInfo.name }]);
      }
    } catch (error) {
      console.error("Error fetching registration:", error);
      setTeam([{ id: userInfo.id, name: userInfo.name }]);
    }
  };

  useEffect(() => {
    fetchRegistrationDetails();
  }, [event?.id, userInfo]);

  const handleAddTeammate = async () => {
    if (newTeammate && team.length < (event?.teamSize || 1)) {
      if (team.some((member) => member.id === newTeammate)) {
        alert("This teammate is already added.");
        return;
      }

      try {
        const userRecord = await pb
          .collection("users")
          .getFirstListItem(`id="${newTeammate}"`);

        setTeam([
          ...team,
          { id: userRecord.id, name: userRecord.username },
        ]);
        setNewTeammate("");
      } catch (error) {
        alert(error.status === 404 ? "User not found." : "An error occurred.");
      }
    }
  };

  const handleRemoveTeammate = (id: string) => {
    if (id === userInfo?.id) {
      alert("You cannot remove yourself as the leader.");
      return;
    }
    setTeam(team.filter((member) => member.id !== id));
  };
  
  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    try {
      const generatedTeamCode = generateTeamCode();
      // Registration logic
      alert(`Your team "${teamName}" has been registered for ${event?.name}`);
    } catch {
      alert("Error registering your team.");
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar search={false} />
        <div className="w-screen min-h-screen flex justify-center items-center pt-20">
          <Loader2 className="h-10 w-10 animate-spin text-secondary" />
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar search={false} />
        <div className="w-screen min-h-screen flex justify-center items-center pt-20">
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
      <div className="w-screen min-h-screen bg-background text-primary-text pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Hero Image */}
          {event.image && (
            <div className="mb-8">
              <img 
                src={`${POCKET_API_URL}${event?.collectionId}/${eventId}/${event.image}`}
                alt={event.name} 
                className="w-full h-[40vh] object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Event Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.name}</h1>
          
          {/* Event Description */}
          <div className="py-5 text-[18px] sm:text-[20px] text-primary-post -tracking-[0.009em] leading-[32px]">
            {event.description}
          </div>
          
          {/* Event Details */}
          <div className="my-8 space-y-4 text-[16px] border-t border-b border-border py-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-primary" />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{event.location || "Online"}</span>
            </div>
            
            {event.teamSize && (
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <span>Team Size: {event.teamSize} members</span>
              </div>
            )}
          </div>
          
          {/* Registration Form */}
          <div className="mt-10 bg-background-light p-6 rounded-lg border border-border">
            <h2 className="text-xl font-bold mb-4">Event Registration</h2>
            <p className="text-muted-foreground mb-6">
              {event.teamSize === 1
                ? "Register for this solo event."
                : "Form your team and register."}
            </p>
            
            <form onSubmit={handleSubmitRegistration} className="space-y-6">
              {event.teamSize !== 1 && (
                <div className="space-y-2">
                  <Label className="text-base">Team Name</Label>
                  <Input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                    className="bg-background"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="text-base">
                  {event.teamSize === 1 ? "Participant" : "Team Members"}
                </Label>
                <ul className="space-y-2">
                  {team.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center justify-between bg-secondary/10 p-3 rounded-md"
                    >
                      <span>
                        {member.name} ({member.id})
                        {member.isLeader && (
                          <span className="ml-2 text-xs font-semibold text-secondary">
                            {event.teamSize === 1 ? "(Participant)" : "(Leader)"}
                          </span>
                        )}
                      </span>
                      {!member.isLeader && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTeammate(member.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              {team.length < (event.teamSize || 1) && (
                <div className="flex space-x-2">
                  <Input
                    value={newTeammate}
                    onChange={(e) => setNewTeammate(e.target.value)}
                    placeholder="Enter teammate's ID"
                    className="bg-background"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTeammate}
                    variant="outline"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isRegistering}
              >
                {isRegistering && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isRegistering ? "Registering..." : "Register"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Event;