import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Video, FileText } from "lucide-react";
import { insertEventSchema } from "@shared/schema";
import { z } from "zod";

const eventFormSchema = insertEventSchema.extend({
  photos: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  poc_name: z.string().min(1, "Organizer name is required"),
  poc_phone: z.string().min(1, "Organizer phone is required"),
  poc_email: z.string().email("Valid email is required"),
}).omit({ date: true }).extend({
  start_date: z.string(),
  end_date: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent?: any;
}

export default function EventFormDialog({ open, onOpenChange, editingEvent }: EventFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedMedia, setUploadedMedia] = useState<{
    photos: string[];
    videos: string[];
    documents: string[];
  }>({
    photos: [],
    videos: [],
    documents: [],
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      start_date: "",
      end_date: "",
      category: "intercessory" as const,
      content: "",
      poc_name: "",
      poc_phone: "",
      poc_email: "",
      photos: [],
      videos: [],
      documents: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingEvent && open) {
      form.reset({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        location: editingEvent.location || "",
        start_date: editingEvent.start_date ? new Date(editingEvent.start_date).toISOString().slice(0, 16) : "",
        end_date: editingEvent.end_date ? new Date(editingEvent.end_date).toISOString().slice(0, 16) : "",
        category: editingEvent.category || "intercessory",
        content: editingEvent.content || "",
        poc_name: editingEvent.poc_name || "",
        poc_phone: editingEvent.poc_phone || "",
        poc_email: editingEvent.poc_email || "",
      });

      // Set uploaded media if exists
      if (editingEvent.media_urls && Array.isArray(editingEvent.media_urls)) {
        const photos = editingEvent.media_urls.filter((url: string) => 
          url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );
        const videos = editingEvent.media_urls.filter((url: string) => 
          url.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i)
        );
        const documents = editingEvent.media_urls.filter((url: string) => 
          url.match(/\.(pdf|doc|docx|ppt|pptx|txt)$/i)
        );

        setUploadedMedia({ photos, videos, documents });
      }
    } else if (!editingEvent && open) {
      // Reset form for new event
      form.reset({
        title: "",
        description: "",
        location: "",
        start_date: "",
        end_date: "",
        category: "intercessory" as const,
        content: "",
        poc_name: "",
        poc_phone: "",
        poc_email: "",
        photos: [],
        videos: [],
        documents: [],
      });
      setUploadedMedia({ photos: [], videos: [], documents: [] });
    }
  }, [editingEvent, open, form]);

  const eventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const allMediaUrls = [
        ...uploadedMedia.photos,
        ...uploadedMedia.videos,
        ...uploadedMedia.documents,
      ];
      
      const eventData = {
        ...data,
        image_url: uploadedMedia.photos[0] || null, // Use first photo as main image
        media_urls: allMediaUrls.length > 0 ? allMediaUrls : null,
        content: data.description, // Use description as content for now
        poc_name: data.poc_name,
        poc_phone: data.poc_phone,
        poc_email: data.poc_email,
      };

      if (editingEvent) {
        // Update existing event
        return apiRequest("PUT", `/api/events/${editingEvent.id}`, eventData);
      } else {
        // Create new event
        return apiRequest("POST", "/api/events", eventData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: editingEvent ? "Event Updated" : "Event Created",
        description: `Prayer event has been ${editingEvent ? 'updated' : 'created'} successfully.`,
      });
      form.reset();
      setUploadedMedia({ photos: [], videos: [], documents: [] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Event mutation error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingEvent ? 'update' : 'create'} event. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (type: 'photos' | 'videos' | 'documents', files: FileList) => {
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Upload failed: ${text}`);
        }
        
        const result = await response.json();
        return result.url; // Returns the file URL
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setUploadedMedia(prev => ({
        ...prev,
        [type]: [...prev[type], ...uploadedUrls]
      }));
      
      toast({
        title: "Files Uploaded",
        description: `${uploadedUrls.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeMedia = (type: 'photos' | 'videos' | 'documents', index: number) => {
    setUploadedMedia(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const onSubmit = (data: EventFormData) => {
    eventMutation.mutate({
      ...data,
      photos: uploadedMedia.photos,
      videos: uploadedMedia.videos,
      documents: uploadedMedia.documents,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingEvent ? 'Edit Prayer Event' : 'Create Prayer Event'}</DialogTitle>
          <DialogDescription>
            {editingEvent ? 'Update this prayer event with new content and media.' : 'Create a new prayer event with photos, videos, and documents to inspire the community.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Prayer for Nations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="intercessory">Intercessory Prayer</SelectItem>
                        <SelectItem value="childbirth">Childbirth Prayer</SelectItem>
                        <SelectItem value="24h_prayer">24 Hour Prayer</SelectItem>
                        <SelectItem value="worship">Worship</SelectItem>
                        <SelectItem value="fasting">Fasting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the prayer event, its purpose, and what participants can expect..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Kenya, Nairobi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Organizer/POC Information */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium">Organizer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="poc_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poc_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="poc_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="organizer@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Media Upload Sections */}
            <div className="space-y-6">
              {/* Photos */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  Event Photos
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload('photos', e.target.files)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload photos</p>
                    </div>
                  </label>
                  
                  {uploadedMedia.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {uploadedMedia.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <div className="bg-gray-100 rounded p-2 text-xs truncate">
                            Photo {index + 1}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeMedia('photos', index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Videos */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Event Videos
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => e.target.files && handleFileUpload('videos', e.target.files)}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload videos</p>
                    </div>
                  </label>
                  
                  {uploadedMedia.videos.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {uploadedMedia.videos.map((video, index) => (
                        <div key={index} className="relative">
                          <div className="bg-gray-100 rounded p-2 text-xs truncate">
                            Video {index + 1}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeMedia('videos', index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Event Documents
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files && handleFileUpload('documents', e.target.files)}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload documents</p>
                    </div>
                  </label>
                  
                  {uploadedMedia.documents.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {uploadedMedia.documents.map((doc, index) => (
                        <div key={index} className="relative">
                          <div className="bg-gray-100 rounded p-2 text-xs truncate">
                            Document {index + 1}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeMedia('documents', index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={eventMutation.isPending}>
                {eventMutation.isPending 
                  ? (editingEvent ? "Updating..." : "Creating...") 
                  : (editingEvent ? "Update Event" : "Create Event")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}