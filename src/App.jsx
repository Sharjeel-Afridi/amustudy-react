import Form from "./components/Form";
import { useState, useEffect, useContext } from "react";
import pb from "../lib/pocketbase";
import Navbar from "./components/Navbar";
import { formatDistanceToNow } from "date-fns";
import Chevron from "../public/chevron.png";
import { useNavigate } from 'react-router-dom';
import UserContext from "./utils/UserContext";

export default function Home() {
  const [posts, setPosts] = useState([]); 

  const navigate = useNavigate();

  const { loggedinUser, userId} = useContext(UserContext);


  const fetchLikes = async (postId) => {
      try{
          const records = await pb.collection('likes').getFullList({
              filter: `postId = "${postId}"`,
          });
          console.log(records);
          let totalLikes = 0;
          let totalDislikes = 0;

          records.forEach(record => {
            if (record.like) {  
              totalLikes += record.like;
            }
            if (record.dislike) {
              totalDislikes += record.dislike;
            }
          });

          const netLikes = totalLikes - totalDislikes;
          return netLikes;
      }catch(error){
          console.log(error);
      }
  }

  const handleReaction = async (postId,likeValue) => {
    console.log(postId);
    if(loggedinUser.username !== ''){

        try {
            // Check if the user has already reacted with the same type
            const existingRecords = await pb.collection('likes').getFullList({
                filter: `postId = "${postId}" && userId = "${userId}"`, // never forget: "${variableName}"
            });
        
            if (existingRecords.length > 0) {
                // User has already reacted with the same type, delete the reaction
                const recordId = existingRecords[0].id;
                await pb.collection('likes').delete(recordId);
                
            } else {
                // Create a new reaction
                await pb.collection('likes').create({
                    "like": likeValue,
                    "userId": userId,
                    "postId": postId,
                });
                
            }
            // Refresh the likes count for the post; this will only update the likes of that specific post
            const netLikes = await fetchLikes(postId);
            const updatedPosts = posts.map(post =>
              post.id === postId ? { ...post, netLikes } : post
            );
            setPosts(updatedPosts);
        } catch (error) {
            console.log(error);
        }
    }else{
        alert('You need to login to vote on the post.')
    }
  };

  const postsList = async () => {

    try {
      const resultList = await pb.collection('posts').getList(1, 10, {
        filter: 'created >= "2022-01-01 00:00:00"',
        sort: '-created',
        expand: "user",
      }, { requestKey: null });

      // Update posts state with fetched data
      setPosts(resultList.items);

      // Initialize an array to store updated posts
      const updatedPosts = [];

      // Loop through each post and fetch likes sequentially
      for (let post of resultList.items) {
        try {
          const netLikes = await fetchLikes(post.id);
          post = { ...post, netLikes }; // Create a new object with updated netLikes
        } catch (error) {
          console.error(`Error fetching likes for post ${post.id}:`, error);
          post = { ...post, netLikes: 0 }; // Default to 0 netLikes on error
        }
        updatedPosts.push(post); // Push updated post to the array
      }
      console.log(updatedPosts);
      // Update state with the array of updated posts
      setPosts(updatedPosts);

    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  

 
  useEffect(()=>{
    postsList();
  },[])
  
  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-[calc(100vw_-_6px)] flex flex-col sm:flex-row bg-[#fafbfb] text-black pb-[10vh]">
        {/* <h1 className="font-bold text-3xl pt-10">AMUStudy</h1> */}

        {/* <Form refresh={postsList}/> */}
        <div className="flex flex-col items-start mx-10 w-[90%] sm:w-[60%] mt-[15vh] rounded-md shadow ">
          <h1 className="text-[1.7rem] font-bold px-5 pt-[5vh]">Recent Posts</h1>
          {posts.map((post, index) => (
            <div
              key={index}
              className="w-[100%] flex items-center py-5 pl-2 my-2 hover:rounded-lg hover:bg-gray-100"
            >   
              <div className="flex flex-col items-center gap-2 px-5">
                <img 
                  src={Chevron} 
                  className="w-[40px] rotate-[90deg] p-2 rounded-md hover:bg-[#e2e2e6] cursor-pointer"
                  onClick={() => handleReaction(post.id,1)}
                />

                <span>{post.netLikes}</span>
                <img 
                  src={Chevron} 
                  className="w-[40px] rotate-[-90deg] p-2 rounded-md hover:bg-[#e2e2e6] cursor-pointer"
                  onClick={() => handleReaction(post.id,-1)} 
                />
              </div>
              <div 
                onClick={() => handlePostClick(post.id)}
                className="w-[100%] cursor-pointer"
              >
                <p className="font-medium text-xl text-left px-2 cursor-pointer">{post.title}</p>
                <p className="text-[#a4a5aa] mb-4 px-2 text-sm">Asked {formatDistanceToNow(new Date(post.created))} ago by <span className="font-medium">{post?.expand?.user?.username}</span></p>
                <span className="bg-[#e2e2e6] px-3 py-1 rounded-full text-sm font-medium"> javascript</span>
                {/* <p className="mb-4 text-left px-2">{post.text.slice(0, 300)}</p> */}
                {/* {post.image !== '' && <img src={`https://amustud.pockethost.io/api/files/${post.collectionId}/${post.id}/${post.image}`} alt="Post" className="w-[400px] h-auto rounded-lg" />} */}
              </div>
            </div>
            ))}
        </div>
        <div className="flex flex-col">
          
          <Form refresh={postsList}/>
          
          <div className="flex flex-col items-start  h-[30vh] mr-5 mt-[15vh] rounded-md shadow px-5">
              <h1 className="text-[1.7rem] font-bold pt-[5vh] mb-5">Top Tags</h1>
              <div className="flex justify-between flex-wrap gap-5">
                <div>
                  <span className="bg-[#e2e2e6] px-3 py-1 rounded-full text-sm font-medium"> javascript</span>
                  <span className="text-sm pl-2">999</span>
                </div>
                <div>
                  <span className="bg-[#e2e2e6] px-3 py-1 rounded-full text-sm font-medium"> python</span>
                  <span className="text-sm pl-2">999</span>
                </div>
                <div>
                  <span className="bg-[#e2e2e6] px-3 py-1 rounded-full text-sm font-medium"> typescript</span>
                  <span className="text-sm pl-2">999</span>
                </div>
              
              </div>
          </div>
        </div>
      </main>
    </>
  );
}