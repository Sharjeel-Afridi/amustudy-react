import { useState, useEffect } from "react";

type EventDetail = {
  id: string;
  name: string;
  description: string;
  date: Date;
  time: string;
  image: string;
  teamSize: number;
  location: string;
  eventCategory: string;
  singleGamePrice: number;
  bundlePrice: number;
  gameName: string;
};

export default function useFetchEventDetails(eventId: string | undefined) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://amuroboclub.pockethost.io/api/collections/events/records/b4nqab2d376f7kg`
        //   `https://amuroboclub.pockethost.io/api/collections/events/records/${eventId}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch event: ${res.statusText}`);
        }
        const data = await res.json();
        setEvent({
          id: data.id,
          name: data.name,
          description: data.description,
          date: data.date,
          time: data.date,
          image: data.image,
          teamSize: data.max_team_members,
          location: data.location,
          eventCategory: data.eventCategory,
          singleGamePrice: data.singleGamePrice,
          bundlePrice: data.bundlePrice,
          gameName: data.gameName,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  return { event, loading, error };
}
