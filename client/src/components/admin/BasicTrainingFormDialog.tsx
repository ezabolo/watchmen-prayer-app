import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const basicTrainingFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["video", "pdf", "qcm"]),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  file_url: z.string().optional(),
});

type BasicTrainingFormData = z.infer<typeof basicTrainingFormSchema>;

interface BasicTrainingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTraining?: any;
}

export default function BasicTrainingFormDialog({ 
  open, 
  onOpenChange, 
  editingTraining 
}: BasicTrainingFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BasicTrainingFormData>({
    resolver: zodResolver(basicTrainingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "video",
      duration: 30,
      file_url: "",
    },
  });

  const createTrainingMutation = useMutation({
    mutationFn: async (data: BasicTrainingFormData) => {
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
        description: editingTraining ? "Training updated successfully" : "Training created successfully",
      });
      form.reset();
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

  useEffect(() => {
    if (editingTraining && open) {
      form.reset({
        title: editingTraining.title || "",
        description: editingTraining.description || "",
        type: editingTraining.type || "video",
        duration: editingTraining.duration || 30,
        file_url: editingTraining.file_url || "",
      });
    } else if (!editingTraining && open) {
      form.reset({
        title: "",
        description: "",
        type: "video",
        duration: 30,
        file_url: "",
      });
    }
  }, [editingTraining, open, form]);

  const onSubmit = (data: BasicTrainingFormData) => {
    createTrainingMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingTraining ? "Edit Training" : "Create New Training"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Textarea 
                      {...field} 
                      placeholder="Enter training description" 
                      className="h-24"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="30"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File URL (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://example.com/resource"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => {
                form.reset();
                onOpenChange(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTrainingMutation.isPending}>
                {createTrainingMutation.isPending 
                  ? (editingTraining ? "Updating..." : "Creating...") 
                  : (editingTraining ? "Update Training" : "Create Training")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}