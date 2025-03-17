import { useState, useEffect, useContext, useRef } from "react";
import pb from "../../lib/pocketbase";
import UserContext from "../utils/UserContext";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, format } from "date-fns";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NewFormPage = () => {
  const [inputText, setInputText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [venue, setVenue] = useState("Online");
  const [venueDetails, setVenueDetails] = useState("");
  const [editorContent, setEditorContent] = useState(null);
  const editorRef = useRef(null);

  const saveEditorContent = async () => {
    if (editorRef.current) {
      try {
        const content = await editorRef.current.save();
        return content;
      } catch (error) {
        console.error("Failed to save editor data:", error);
        return null;
      }
    }
    return null;
  };
  const navigate = useNavigate();

  const { loggedinUser, userInfo } = useContext(UserContext);

  useEffect(() => {
    if (photo) {
      const objectURL = URL.createObjectURL(photo);
      setPhotoURL(objectURL);
      // Clean up the object URL to avoid memory leaks
      return () => URL.revokeObjectURL(objectURL);
    }
  }, [photo]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleDelete = () => {
    setPhoto(null);
    setPhotoURL(null);
  };

  // Calendar date constraints
  const today = new Date();
  const maxDate = addMonths(today, 5);

  const handlePost = async () => {
    if (inputText !== "" && title !== "") {
      setLoading(true);
      try {
        const content = await saveEditorContent();

        await pb.collection("posts").create({
          user: userInfo.id,
          title: title,
          text: inputText,
          tags: null,
          date: startDate,
          image: photo,
          venue: venue === "physical" ? venueDetails : venue,
          content: content.blocks,
        });

        // Clear the form after successful post
        setTitle("");
        setInputText("");
        setTags([]);
        setPhoto(null);
        setPhotoURL(null);
        setEditorContent(null);
      } catch (error) {
        console.error("Error creating post:", error);
      } finally {
        setLoading(false);
        navigate("/");
      }
    } else {
      alert("Cannot post empty fields!!");
    }
  };

  return (
    <>
      <Navbar search={false} />
      <div className="flex flex-col justify-center items-center w-screen min-h-screen px-3 pt-20 pb-10 bg-secondary/90 text-primary-text font-medium">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Write Exciting Post</h1>
          <p className="text-gray-600 dark:text-gray-300">Share your amazing event with the community</p>
        </div>
        <div id="form" className="sm:p-3 sm:w-[60%] w-[90%] border-[1px] bg-background rounded-md shadow-md">
          <div className="flex flex-col items-center justify-start gap-4 mb-4">
            <Input
              type="text"
              className="sm:text-[42px]"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
            />
            <Textarea
              placeholder="Short Description"
              value={inputText}
              onChange={handleTextChange}
              rows={1}
              className="resize-y"
            />

            {photoURL ? (
              <div className="mb-4">
                <img
                  src={photoURL}
                  alt="Selected"
                  className="w-full max-h-[60vh] rounded-lg"
                />
                <span
                  className="text-red-600 text-md hover:text-red-700 cursor-pointer"
                  onClick={handleDelete}
                >
                  Delete
                </span>
              </div>
            ) : (
              <label className="w-full flex justify-center items-center">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                <div className="cdx-button w-full flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      width="14"
                      height="14"
                      x="5"
                      y="5"
                      stroke="currentColor"
                      strokeWidth="2"
                      rx="4"
                    ></rect>
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"
                    ></path>
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.7778 9.33331H13.7867"
                    ></path>
                  </svg>{" "}
                  Select an Image
                </div>
              </label>
            )}

            <Editor editorRef={editorRef} />

            <div className="flex justify-between items-center w-full px-2">
              <span>Add To Calendar</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select Event Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < today || date > maxDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col w-full px-2">
              <label className="mb-2">Venue</label>
              <select
                className="w-full border-[1px] border-white/10 rounded-md p-2 bg-background-light focus:border-transparent focus:ring-transparent"
                onChange={(e) => setVenue(e.target.value)}
              >
                <option value="Online">Online</option>
                <option value="physical">Physical</option>
              </select>
              {venue === "physical" && (
                <Input
                  type="text"
                  className="mt-2"
                  placeholder="Enter Venue"
                  value={venueDetails}
                  onChange={(e) => setVenueDetails(e.target.value)}
                />
              )}
            </div>

            <button
              onClick={handlePost}
              className="w-[40%] px-4 py-2 text-primary bg-[#00376f] text-white hover:bg-[#00376f]/95 transition-all rounded-lg mt-20"
            >
              {loading ? "Uploading.." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewFormPage;