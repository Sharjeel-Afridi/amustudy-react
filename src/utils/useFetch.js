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

      setPosts(postList);
       // Cache the posts in localStorage
       localStorage.setItem("cachedPosts", JSON.stringify(postList));

      // Fetch events
      const eventList = await pb.collection("posts").getList(1, 10, {
        filter: 'date != ""',
        sort: "-created",
      });

      setEvents(eventList.items);
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
