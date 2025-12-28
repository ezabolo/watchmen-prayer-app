import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Upload, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Training } from "@shared/schema";

interface Chapter {
  id?: number;
  title: string;
  order_index: number;
  sections: Section[];
}

interface Section {
  id?: number;
  title: string;
  content: string;
  video_url?: string;
  file_url?: string;
  order_index: number;
}

interface TrainingData {
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'qcm';
  chapters: Chapter[];
}

interface StructuredTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training?: Training;
}

export default function StructuredTrainingDialog({ 
  open, 
  onOpenChange, 
  training 
}: StructuredTrainingDialogProps) {
  const [trainingData, setTrainingData] = useState<TrainingData>({
    title: training?.title || "",
    description: training?.description || "",
    type: training?.type || 'video',
    chapters: []
  });

  // Fetch existing training content when editing
  const { data: existingContent, isLoading: isLoadingContent } = useQuery({
    queryKey: [`/api/trainings/${training?.id}/content`],
    enabled: !!training?.id && open,
    staleTime: 0, // Always refetch when dialog opens
  });

  // Update training data when existing content is loaded or training prop changes
  useEffect(() => {
    if (training && open && !isLoadingContent) {
      console.log('Loading training:', training);
      console.log('Existing content:', existingContent);
      
      const chapters = (existingContent as any)?.chapters || [];
      console.log('Chapters to load:', chapters);
      
      setTrainingData({
        title: training.title,
        description: training.description,
        type: training.type,
        chapters: chapters
      });
    } else if (!training) {
      // Reset for new training
      setTrainingData({
        title: "",
        description: "",
        type: 'video',
        chapters: []
      });
    }
  }, [training, existingContent, open, isLoadingContent]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: TrainingData) => {
      // First create/update the basic training info
      const basicTrainingData = {
        title: data.title,
        description: data.description,
        type: data.type
      };
      
      let trainingResult;
      if (training) {
        trainingResult = await apiRequest("PUT", `/api/trainings/${training.id}`, basicTrainingData);
        // Update structured content for existing training
        await apiRequest("PUT", `/api/trainings/${training.id}/structure`, { chapters: data.chapters });
      } else {
        trainingResult = await apiRequest("POST", "/api/trainings", basicTrainingData);
        // Save structured content for new training
        if (data.chapters.length > 0) {
          await apiRequest("PUT", `/api/trainings/${trainingResult.id}/structure`, { chapters: data.chapters });
        }
      }
      
      return trainingResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainings"] });
      toast({
        title: "Success",
        description: `Training ${training ? 'updated' : 'created'} successfully`,
      });
      onOpenChange(false);
      setTrainingData({
        title: "",
        description: "",
        type: 'video',
        chapters: []
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${training ? 'update' : 'create'} training`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingData.title.trim() || !trainingData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(trainingData);
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      title: `Chapter ${trainingData.chapters.length + 1}`,
      order_index: trainingData.chapters.length + 1,
      sections: []
    };
    setTrainingData(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  };

  const updateChapter = (index: number, updates: Partial<Chapter>) => {
    setTrainingData(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, i) => 
        i === index ? { ...chapter, ...updates } : chapter
      )
    }));
  };

  const removeChapter = (index: number) => {
    setTrainingData(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index)
    }));
  };

  const addSection = (chapterIndex: number) => {
    const chapter = trainingData.chapters[chapterIndex];
    const newSection: Section = {
      title: `Section ${chapter.sections.length + 1}`,
      content: "",
      order_index: chapter.sections.length + 1
    };
    
    updateChapter(chapterIndex, {
      sections: [...chapter.sections, newSection]
    });
  };

  const updateSection = (chapterIndex: number, sectionIndex: number, updates: Partial<Section>) => {
    const updatedSections = trainingData.chapters[chapterIndex].sections.map((section, i) =>
      i === sectionIndex ? { ...section, ...updates } : section
    );
    updateChapter(chapterIndex, { sections: updatedSections });
  };

  const removeSection = (chapterIndex: number, sectionIndex: number) => {
    const updatedSections = trainingData.chapters[chapterIndex].sections.filter((_, i) => i !== sectionIndex);
    updateChapter(chapterIndex, { sections: updatedSections });
  };

  const handleFileUpload = async (chapterIndex: number, sectionIndex: number, file: File) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type.startsWith('video/') ? 'video' : 'document');

      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      
      if (file.type.startsWith('video/')) {
        updateSection(chapterIndex, sectionIndex, { video_url: url });
      } else {
        updateSection(chapterIndex, sectionIndex, { file_url: url });
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {training ? 'Edit Training' : 'Create New Training'}
          </DialogTitle>
        </DialogHeader>

        {isLoadingContent ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading training content...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Training Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Training Title</Label>
              <Input
                id="title"
                value={trainingData.title}
                onChange={(e) => setTrainingData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter training title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Training Type</Label>
              <Select
                value={trainingData.type}
                onValueChange={(value: 'video' | 'pdf' | 'qcm') => 
                  setTrainingData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Training</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="qcm">QCM (Quiz)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={trainingData.description}
              onChange={(e) => setTrainingData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter training description"
              rows={3}
              required
            />
          </div>

          {/* Training Structure */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Training Structure</h3>
              <Button type="button" onClick={addChapter} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Chapter
              </Button>
            </div>

            {trainingData.chapters.map((chapter, chapterIndex) => (
              <Card key={chapterIndex} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Chapter {chapterIndex + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChapter(chapterIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Chapter Title</Label>
                    <Input
                      value={chapter.title}
                      onChange={(e) => updateChapter(chapterIndex, { title: e.target.value })}
                      placeholder="Enter chapter title"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Sections</h4>
                      <Button
                        type="button"
                        onClick={() => addSection(chapterIndex)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Section
                      </Button>
                    </div>

                    {chapter.sections.map((section, sectionIndex) => (
                      <Card key={sectionIndex} className="bg-gray-50">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-sm">Section {sectionIndex + 1}</h5>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSection(chapterIndex, sectionIndex)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Section Title</Label>
                                <Input
                                  value={section.title}
                                  onChange={(e) => updateSection(chapterIndex, sectionIndex, { title: e.target.value })}
                                  placeholder="Section title"
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Content</Label>
                                <Textarea
                                  value={section.content}
                                  onChange={(e) => updateSection(chapterIndex, sectionIndex, { content: e.target.value })}
                                  placeholder="Section content"
                                  rows={2}
                                  className="text-sm"
                                />
                              </div>
                            </div>

                            {/* Video/File Upload for Section */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Video URL</Label>
                                <div className="flex gap-2">
                                  <Input
                                    value={section.video_url || ""}
                                    onChange={(e) => updateSection(chapterIndex, sectionIndex, { video_url: e.target.value })}
                                    placeholder="Enter video URL"
                                    className="text-sm"
                                  />
                                  <Button type="button" size="sm" variant="outline">
                                    <Link className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs">Upload File</Label>
                                <div className="relative">
                                  <input
                                    type="file"
                                    id={`file-${chapterIndex}-${sectionIndex}`}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleFileUpload(chapterIndex, sectionIndex, file);
                                      }
                                    }}
                                  />
                                  <Button type="button" size="sm" variant="outline" className="w-full">
                                    <Upload className="w-3 h-3 mr-2" />
                                    Choose File
                                  </Button>
                                </div>
                                {section.file_url && (
                                  <p className="text-xs text-green-600 mt-1">
                                    File: {section.file_url.split('/').pop()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : training ? "Update Training" : "Create Training"}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}