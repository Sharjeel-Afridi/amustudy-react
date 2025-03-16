import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Image as ImageIcon, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import pb from "../../lib/pocketbase.js";
import Navbar from "@/components/Navbar";
import { toast } from "@/Hooks/use-toast";
import React from "react";

// Modified form schema to include department
const formSchema = z.object({
  eventName: z.string().min(3, {
    message: "Event name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  maxTeamMembers: z.number().int().min(1, {
    message: "Team must have at least 1 member.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  department: z.string({
    required_error: "Please select a department.",
  }), 
  image: z.any().optional(),
  registration: z.boolean(),
});

// Department options
const departments = [
  "ZHCET",
  "Computer Science",
  "CEC",
  "MBA",
  "Commerce",
  "Arts",
  "Miscellaneous",
  "Engineering",
  "Law",
  "Medical"
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      description: "",
      maxTeamMembers: 1,
      location: "",
      department: "",
      registration: true,
    },
  });

  // Clean up the preview URL when component unmounts
  useEffect(() => {
    if (photo) {
      const objectURL = URL.createObjectURL(photo);
      setPhotoURL(objectURL);
      // Clean up the object URL to avoid memory leaks
      return () => URL.revokeObjectURL(objectURL);
    }
  }, [photo]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Validate image is selected
    if (!photo) {
      toast({
        title: "Image Required",
        description: "Please upload an event banner image",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', values.eventName);
      formData.append('description', values.description);
      formData.append('max_team_members', values.maxTeamMembers.toString());
      formData.append('date', values.date.toISOString());
      formData.append('location', values.location);
      formData.append('image', photo);
      formData.append('Department', values.department);
      formData.append('registration', values.registration.toString());
      
      // Create a record in the 'events' collection
      await pb.collection('events').create(formData);
      
      toast({
        title: "Event Created",
        description: "Your event has been created successfully!",
      });
      
      // Redirect to events page
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoto(e.target.files[0]);
  };

  return (
    <>
      <Navbar />
      <div className="w-screen min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="w-[80vw] mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Create Your Event</h1>
              <p className="text-gray-600 dark:text-gray-300">Share your amazing event with the community</p>
            </div>
            
            <Card className="shadow-none border-0 overflow-hidden">
              <CardHeader className="text-blue-800 py-6">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <CalendarIcon className="mr-2 h-6 w-6" />
                  Event Details
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 pt-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="eventName"
                      render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Event Name</FormLabel>
                        <FormControl>
                        <Input 
                          placeholder="Enter a catchy name for your event" 
                          className="h-12 text-base rounded-lg border-gray-300 focus:border-blue-500" 
                          {...field} 
                        />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel className="text-base font-medium">Event Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                            variant="outline"
                            className={cn(
                              "h-12 text-base w-full pl-3 text-left font-normal border-gray-300 shadow-none hover:border-blue-500",
                              !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-5 w-5 opacity-70" />
                            </Button>
                          </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                            className="rounded-md border-1"
                          />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                      />
                      
                      <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-base font-medium">Location</FormLabel>
                        <FormControl>
                          <Input 
                          placeholder="Where will this event take place?" 
                          className="h-12 text-base rounded-lg border-1 border-gray-300 focus:border-blue-500" 
                          {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-base font-medium">Department</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                          <SelectTrigger className="h-12 text-base rounded-lg border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>
                            {dept}
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                      />
                      
                      <FormField
                      control={form.control}
                      name="maxTeamMembers"
                      render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-base font-medium">Team Size</FormLabel>
                        <FormControl>
                          <Input
                          type="number"
                          min="1"
                          className="h-12 text-base rounded-lg border-1 border-gray-300 focus:border-blue-500"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Description</FormLabel>
                        <FormControl>
                        <Textarea
                          placeholder="Describe your event in detail"
                          className="min-h-32 text-base rounded-lg border-1 border-gray-300 focus:border-blue-500"
                          {...field}
                        />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                      )}
                    />
                    
                    <FormItem>
                      <FormLabel className="text-base font-medium">Event Banner</FormLabel>
                      <div className={`border-[1.5px] border-dashed rounded-lg ${photoURL ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'} p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors`}>
                      {photoURL ? (
                        <div className="w-fit space-y-4">
                        <div className="relative w-fit h-[40vh] rounded-lg overflow-hidden">
                          <img 
                          src={photoURL} 
                          alt="Event preview" 
                          className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-600 dark:text-green-400 font-medium">Image uploaded successfully</span>
                        </div>
                        <Button 
                          type="button" 
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                          setPhoto(null);
                          setPhotoURL(null);
                          }}
                        >
                          Replace Image
                        </Button>
                        </div>
                      ) : (
                        <label className="w-full cursor-pointer relative block">
                          <div className="flex flex-col items-center justify-center py-4">
                          <ImageIcon className="h-12 w-12 text-blue-500 mb-2" />
                          <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">Choose an event banner</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or drag and drop an image</p>
                          <Button type="button" variant="outline" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Select Image
                          </Button>
                          </div>
                          <Input
                          type="file"
                          id="event-image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </label>
                      )}
                      </div>
                      {!photo && form.formState.isSubmitted && (
                      <p className="text-sm font-medium text-red-500 mt-2">Please upload an event banner image</p>
                      )}
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="registration"
                      render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Do you want to accept registrations?</FormLabel>
                        <div className="flex items-center gap-5 space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Input
                          type="radio"
                          value="yes"
                          checked={field.value === true}
                          className="h-8 w-8"
                          onChange={() => field.onChange(true)}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Input
                          type="radio"
                          value="no"
                          checked={field.value === false}
                          className="h-8 w-8"
                          onChange={() => field.onChange(false)}
                          />
                          <span>No</span>
                        </label>
                        </div>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Event..." : "Launch Event"}
                    </Button>
                    </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}