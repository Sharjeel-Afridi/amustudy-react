import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, PlusCircle, Loader2 } from "lucide-react";
import useFetchEventDetails  from "@/utils/useFetchEventDetails";
import pb from "../../lib/pocketbase.js";

const generateTeamCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const Event = () => {
  const { event, loading, error } = useFetchEventDetails('1');
  // const { event, loading, error } = useFetchEventDetails(params.id);

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    // setIsRegistering(true);

    // try {
    //   const generatedTeamCode = generateTeamCode();
    //   await pb.collection("eventRegistrations").create({
    //     event: event?.id,
    //     teamName: teamName,
    //     teamMembers: team.map((member) => member.verceraId),
    //     teamCode: generatedTeamCode,
    //     leader: userInfo?.name,
    //   });

    //   // setTeamCode(generatedTeamCode);
    //   alert(`Your team "${teamName}" has been registered for ${event?.name}`);
    //   // setShowRegistration(false);
    //   // setRegistrationKey((prev) => prev + 1); // Force re-fetch after new registration
    // } catch {
    //   alert("Error registering your team.");
    // } finally {
    //   // setIsRegistering(false);
    // }
  };
  return (
    <div className="">
      <CardHeader>
          <CardTitle className="text-3xl mt-4">{event?.name}</CardTitle>
          <CardDescription>
            <pre className="whitespace-pre-wrap font-sans">
              {event?.description}
            </pre>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Event details */}
          <div className="flex items-center space-x-2 text-sm">
            {/* <CalendarIcon className="h-4 w-4" /> */}
            <span>
              {new Date(event?.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            {/* <ClockIcon className="h-4 w-4" /> */}
            <span>
              {new Date(event?.time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "UTC",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            {/* <UsersIcon className="h-4 w-4" /> */}
            <span>Team Size: {event?.teamSize} members</span>
          </div>
          <div className="text-sm">
            <strong>Location:</strong> {event?.location}
          </div>
        </CardContent>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Event Registration</CardTitle>
          <CardDescription>
            {event?.teamSize === 1
              ? "Register for this solo event."
              : "Form your team and register."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            {event?.teamSize !== 1 && (
              <div className="space-y-2">
                <Label>Team Name</Label>
                <Input
                  // value={teamName}
                  // onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>
                {event?.teamSize === 1 ? "Participant" : "Team Members"}
              </Label>
              <ul className="space-y-2">
                {/* {team.map((member) => (
                  <li
                    key={member.verceraId}
                    className="flex items-center justify-between bg-secondary p-2 rounded"
                  >
                    <span>
                      {member.name} ({member.verceraId})
                      {member.verceraId === userInfo?.verceraId && (
                        <span className="ml-2 text-xs font-semibold text-primary">
                          {event?.teamSize === 1 ? "(Participant)" : "(Leader)"}
                        </span>
                      )}
                    </span>
                    {member.verceraId !== userInfo?.verceraId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => handleRemoveTeammate(member.verceraId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))} */}
              </ul>
            </div>
            {/* {team.length < (event?.teamSize || 1) && (
              <div className="flex space-x-2">
                <Input
                  value={newTeammate}
                  onChange={(e) => setNewTeammate(e.target.value)}
                  placeholder="Enter teammate's Vercera ID"
                />
                <Button type="button" onClick={handleAddTeammate}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            )} */}
            {/* <Button
              type="submit"
              className="w-full"
              disabled={
                isRegistering ||
                (event?.teamSize !== 1 && (!teamName || team.length < 2)) || // Team name and size check only for team events
                team.length > (event?.teamSize || 1) // Max team size check
              }
            >
              {isRegistering && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isRegistering ? "Registering..." : "Register"}
            </Button> */}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Event;
