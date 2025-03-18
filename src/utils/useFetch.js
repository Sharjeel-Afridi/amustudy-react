import { useState, useEffect } from "react";
import pb from "../../lib/pocketbase";


const useFetchData = () => {
  const [posts, setPosts] = useState(() => {
    // Retrieve cached posts from localStorage if available
    const cachedPosts = localStorage.getItem("cachedPosts");
    return cachedPosts ? JSON.parse(cachedPosts) : [];
  });
  
  const [events, setEvents] = useState(() => {
    // Retrieve cached events from localStorage if available
    const cachedEvents = localStorage.getItem("cachedEvents");
    return cachedEvents ? JSON.parse(cachedEvents) : [];
  });
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch posts
      const postList = await pb.collection("posts").getFullList({
        // filter: 'created >= "2022-01-01 00:00:00"',
        sort: "-created",
        expand: "user, tags",
      });

      // Filter out posts where hide is true
      const visiblePosts = postList.filter(post => !post.hide);

      setPosts(visiblePosts);
       // Cache the posts in localStorage
       localStorage.setItem("cachedPosts", JSON.stringify(postList));

      // Fetch events
      const eventList = await pb.collection("events").getList(1, 10, {
        filter: 'date != ""',
        sort: "-created",
      });

      // Sort the events in ascending order of event date
      const sortedEvents = eventList.items.sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(sortedEvents);
       // Cache the events in localStorage
       localStorage.setItem("cachedEvents", JSON.stringify(eventList.items));

      
      setShowError(false);
    } catch (error) {
      setShowError(true);
      console.error("Error fetching data:", error);
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { posts, setPosts, events, showError, isLoading };
};

export default useFetchData;
