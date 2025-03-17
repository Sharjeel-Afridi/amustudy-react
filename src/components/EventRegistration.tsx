import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, PlusCircle, Loader2 } from "lucide-react";
import pb from "../../lib/pocketbase.js";
import UserContext from "../utils/UserContext";

// Helper function to generate random team code
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
  isLeader?: boolean;
};

interface EventRegistrationProps {
  eventId: string;
  eventName: string;
  maxTeamMembers: number;
}

const EventRegistration = ({ eventId, eventName, maxTeamMembers }: EventRegistrationProps) => {
  const [teamName, setTeamName] = useState("");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamCode, setTeamCode] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [newTeammate, setNewTeammate] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationKey, setRegistrationKey] = useState(0);

  const { userInfo } = useContext(UserContext);

  const fetchRegistrationDetails = async () => {
    if (!userInfo || !eventId) return;

    try {
      const registrations = await pb
        .collection("eventRegistrations")
        .getList(1, 1, {
          filter: `event="${eventId}" && teamMembers~"${userInfo.id}"`,
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
            return { 
              id: id, 
              name: user.username,
              isLeader: id === registration.leader 
            };
          })
        );

        setTeam(teammates);
        setShowRegistration(true);
      } else {
        setTeamName("");
        setTeamCode("");
        setTeam([{ id: userInfo.id, name: userInfo.username, isLeader: true }]);
      }
    } catch (error) {
      console.error("Error fetching registration:", error);
      setTeam([{ id: userInfo.id, name: userInfo.username, isLeader: true }]);
    }
  };

  useEffect(() => {
    fetchRegistrationDetails();
  }, [eventId, userInfo]);

  const handleAddTeammate = async () => {
    if (newTeammate && team.length < (maxTeamMembers || 1)) {
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
        alert((error as any).status === 404 ? "User not found." : "An error occurred.");
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
      await pb.collection("eventRegistrations").create({
        event: eventId,
        teamName: teamName,
        teamMembers: team.map((member) => member.id),
        teamCode: generatedTeamCode,
        leader: userInfo?.id,
      });
      setTeamCode(generatedTeamCode);
      setShowRegistration(true);
      setRegistrationKey((prev) => prev + 1);
      alert(`Your team "${teamName}" has been registered for ${eventName}`);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error registering your team.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="sm:sticky sm:top-[18vh] h-fit sm:w-[32vw] mt-4 mx-2 mb-10 p-6 rounded-lg shadow-sm border-[1px] text-[#00376f]">
      <h2 className="text-xl font-bold mb-4 ">Event Registration</h2>
      <p className="text-muted-foreground mb-6">
        {maxTeamMembers === 1
          ? "Register for this solo event."
          : "Form your team and register."}
      </p>
      
      <form onSubmit={handleSubmitRegistration} className="space-y-6">
        {maxTeamMembers !== 1 && (
          <div className="space-y-2">
            <Label className="text-base">Team Name</Label>
            {showRegistration ? (
              <h3 className="font-bold text-xl">{teamName}</h3>
            ) : (
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className="bg-background text-black"
                required
              />
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Label className="text-base">
            {maxTeamMembers === 1 ? "Participant" : "Team Members"}
          </Label>
          <ul className="space-y-2">
            {team.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between bg-primary-light text-primary p-3 rounded-md"
              >
                <span>
                  {member.name} ({member.id})
                  {member.isLeader && (
                    <span className="ml-2 text-xs font-semibold">
                      {maxTeamMembers === 1 ? "(Participant)" : "(Leader)"}
                    </span>
                  )}
                </span>
                {!showRegistration && !member.isLeader && (
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
        
        {!showRegistration && team.length < (maxTeamMembers || 1) && (
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
        
        {showRegistration ? (
          <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-md">
            <p className="text-green-400 font-medium">
              Successfully registered! Your team code is: <span className="font-bold">{teamCode}</span>
            </p>
          </div>
        ) : (
          <Button
            type="submit"
            className="w-full mt-4 bg-[#00376f] hover:bg-[#00376f]/95"
            disabled={isRegistering}
          >
            {isRegistering && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isRegistering ? "Registering..." : "Register"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default EventRegistration;