import { useState, useEffect } from "react";

type EventDetail = {
  id: string;
  name: string;
  description: string;
  date: Date;
  image: string;
  max_team_members: number;
  location: string;
  Department: string;
  registration: boolean;
  content: ArrayBuffer;
  collectionId: string;
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
          `https://amustud.pockethost.io/api/collections/events/records/${eventId}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch event: ${res.statusText}`);
        }
        const data = await res.json();
        setEvent({
          id: data.id,
          collectionId: data.collectionId,
          name: data.name,
          description: data.description,
          date: data.date,
          image: data.image,
          max_team_members: data.max_team_members,
          location: data.location,
          Department: data.Department,
          content: data.content,
          registration: data.registration,
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
