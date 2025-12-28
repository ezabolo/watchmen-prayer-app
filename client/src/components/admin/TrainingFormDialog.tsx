import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Upload } from "lucide-react";
import { useState, useEffect } from "react";

const trainingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["video", "pdf", "qcm"]),
  description: z.string().min(1, "Description is required"),
  chapters: z.array(z.object({
    title: z.string().min(1, "Chapter title is required"),
    sections: z.array(z.object({
      title: z.string().min(1, "Section title is required"),
      content: z.string().min(1, "Section content is required"),
      video_url: z.string().optional(),
      document_url: z.string().optional(),
    })).min(1, "At least one section is required"),
  })).min(1, "At least one chapter is required"),
  file_url: z.string().optional(),
  created_by: z.number().optional(),
});

type TrainingFormData = z.infer<typeof trainingFormSchema>;

interface TrainingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTraining?: any;
}

export default function TrainingFormDialog({ open, onOpenChange, editingTraining }: TrainingFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null);
  const [videoInputType, setVideoInputType] = useState<'url' | 'file'>('url');

  const form = useForm<TrainingFormData>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      title: "",
      type: "video",
      description: "",
      chapters: [{
        title: "",
        sections: [{
          title: "",
          content: "",
          video_url: "",
          document_url: "",
        }]
      }],
      file_url: "",
      created_by: 1,
    },
  });

  const { fields: chapters, append: appendChapter, remove: removeChapter } = useFieldArray({
    control: form.control,
    name: "chapters",
  });

  const createTrainingMutation = useMutation({
    mutationFn: async (data: TrainingFormData) => {
      if (editingTraining) {
        return await apiRequest("PUT", `/api/trainings/${editingTraining.id}`, data);
      } else {
        return await apiRequest("POST", "/api/trainings", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainings"] });
      toast({
        title: "Success",
        description: editingTraining ? "Training updated successfully" : "Training structure created successfully",
      });
      form.reset();
      setUploadedVideoFile(null);
      setVideoInputType('url');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingTraining ? 'update' : 'create'} training`,
        variant: "destructive",
      });
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingTraining && open) {
      form.reset({
        title: editingTraining.title || "",
        type: editingTraining.type || "video",
        description: editingTraining.description || "",
        chapters: editingTraining.chapters || [{
          title: "",
          sections: [{
            title: "",
            content: "",
            video_url: "",
            document_url: "",
          }]
        }],
        file_url: editingTraining.file_url || "",
        created_by: editingTraining.created_by || 1,
      });
    } else if (!editingTraining && open) {
      form.reset({
        title: "",
        type: "video",
        description: "",
        chapters: [{
          title: "",
          sections: [{
            title: "",
            content: "",
            video_url: "",
            document_url: "",
          }]
        }],
        file_url: "",
        created_by: 1,
      });
    }
  }, [editingTraining, open, form]);

  const onSubmit = (data: TrainingFormData) => {
    createTrainingMutation.mutate(data);
  };

  const addChapter = () => {
    appendChapter({
      title: "",
      sections: [{
        title: "",
        content: "",
        video_url: "",
        document_url: "",
      }]
    });
  };

  const addSection = (chapterIndex: number) => {
    const currentChapters = form.getValues("chapters");
    currentChapters[chapterIndex].sections.push({
      title: "",
      content: "",
      video_url: "",
      document_url: "",
    });
    form.setValue("chapters", currentChapters);
  };

  const removeSection = (chapterIndex: number, sectionIndex: number) => {
    const currentChapters = form.getValues("chapters");
    currentChapters[chapterIndex].sections.splice(sectionIndex, 1);
    form.setValue("chapters", currentChapters);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideoFile(file);
      form.setValue("file_url", `uploaded-${file.name}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTraining ? 'Edit Training' : 'Create Training Structure'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter training title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="video">Video Training</SelectItem>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="qcm">QCM (Quiz)</SelectItem>
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
                    <Textarea {...field} placeholder="Describe this training" className="h-24" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Upload Section */}
            {form.watch("type") === "video" && (
              <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium">Video Content</h3>
                
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={videoInputType === 'url' ? 'default' : 'outline'}
                    onClick={() => setVideoInputType('url')}
                    size="sm"
                  >
                    URL
                  </Button>
                  <Button
                    type="button"
                    variant={videoInputType === 'file' ? 'default' : 'outline'}
                    onClick={() => setVideoInputType('file')}
                    size="sm"
                  >
                    Upload File
                  </Button>
                </div>

                {videoInputType === 'url' ? (
                  <FormField
                    control={form.control}
                    name="file_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/video.mp4" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-2">
                    <FormLabel>Upload Video File</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-gray-100"
                      />
                      <Upload className="h-4 w-4 text-gray-500" />
                    </div>
                    {uploadedVideoFile && (
                      <p className="text-sm text-green-600">
                        Selected: {uploadedVideoFile.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Chapters Structure */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Training Structure</h3>
                <Button type="button" onClick={addChapter} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chapter
                </Button>
              </div>

              {chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Chapter {chapterIndex + 1}</h4>
                    {chapters.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeChapter(chapterIndex)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`chapters.${chapterIndex}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chapter Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter chapter title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sections */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-sm">Sections</h5>
                      <Button
                        type="button"
                        onClick={() => addSection(chapterIndex)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                      </Button>
                    </div>

                    {form.watch(`chapters.${chapterIndex}.sections`)?.map((_, sectionIndex) => (
                      <div key={sectionIndex} className="bg-gray-50 p-3 rounded space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Section {sectionIndex + 1}</span>
                          {form.watch(`chapters.${chapterIndex}.sections`).length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeSection(chapterIndex, sectionIndex)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`chapters.${chapterIndex}.sections.${sectionIndex}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Section Title</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Section title" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`chapters.${chapterIndex}.sections.${sectionIndex}.content`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Section content" className="h-20" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => {
                form.reset();
                setUploadedVideoFile(null);
                setVideoInputType('url');
                onOpenChange(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTrainingMutation.isPending}>
                {createTrainingMutation.isPending 
                  ? (editingTraining ? "Updating..." : "Creating...") 
                  : (editingTraining ? "Update Training" : "Create Training Structure")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}