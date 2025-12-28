import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const projectFormSchema = insertProjectSchema.extend({
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProject?: any;
}

const projectTypes = [
  "Prayer Watch",
  "Training", 
  "Outreach",
  "Media",
  "Conference", 
  "Network/Partnership",
  "Other"
];

const visibilityOptions = [
  { value: "Public", label: "Public" },
  { value: "Members", label: "Members Only" },
  { value: "Private", label: "Private" }
];

const rhythmOptions = [
  "One-time",
  "Weekly", 
  "Monthly",
  "24/7 Watch",
  "Custom"
];

export default function ProjectFormDialog({ open, onOpenChange, editingProject }: ProjectFormDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      type: "Prayer Watch",
      summary: "",
      description: "",
      primary_scripture: "",
      visibility: "Public",
      start_date: "",
      ongoing: false,
      timezone: "UTC",
      rhythm: "One-time",
      max_team_size: 0,
      allow_public_signup: true,
      approval_mode: "Auto",
      capacity_total: 0,
      capacity_per_slot: 5,
      status: "Draft",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingProject && open) {
      form.reset({
        title: editingProject.title || "",
        type: editingProject.type || "Prayer Watch",
        summary: editingProject.summary || "",
        description: editingProject.description || "",
        primary_scripture: editingProject.primary_scripture || "",
        visibility: editingProject.visibility || "Public",
        start_date: editingProject.start_date ? new Date(editingProject.start_date).toISOString().slice(0, 16) : "",
        end_date: editingProject.end_date ? new Date(editingProject.end_date).toISOString().slice(0, 16) : undefined,
        ongoing: editingProject.ongoing || false,
        timezone: editingProject.timezone || "UTC",
        rhythm: editingProject.rhythm || "One-time",
        max_team_size: editingProject.max_team_size || 0,
        allow_public_signup: editingProject.allow_public_signup !== false,
        approval_mode: editingProject.approval_mode || "Auto",
        capacity_total: editingProject.capacity_total || 0,
        capacity_per_slot: editingProject.capacity_per_slot || 5,
        status: editingProject.status || "Draft",
      });
    }
  }, [editingProject, open, form]);

  const projectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const projectData = {
        ...data,
        start_date: new Date(data.start_date),
        end_date: data.end_date ? new Date(data.end_date) : undefined,
      };

      if (editingProject) {
        return apiRequest("PUT", `/api/projects/${editingProject.id}`, projectData);
      } else {
        return apiRequest("POST", "/api/projects", projectData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: editingProject ? "Project Updated" : "Project Created",
        description: `Project has been ${editingProject ? 'updated' : 'created'} successfully.`,
      });
      form.reset();
      setCurrentStep(1);
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Project operation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: ProjectFormData) => {
    projectMutation.mutate(data);
  };

  const renderBasicsStep = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Title *</FormLabel>
            <FormControl>
              <Input placeholder="City Gate 24/7 Watch" maxLength={120} {...field} />
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
            <FormLabel>Project Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short Summary *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Round-the-clock intercession for our city..."
                maxLength={240}
                className="min-h-[80px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Standing on Isaiah 62:6, we are establishing a 24/7 prayer watch..."
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="primary_scripture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Scripture</FormLabel>
            <FormControl>
              <Input placeholder="Isaiah 62:6" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="visibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibility *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {visibilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderScheduleStep = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date & Time *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP 'at' p")
                    ) : (
                      <span>Pick a date and time</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // Set time to 9:00 AM by default
                      const newDate = new Date(date);
                      newDate.setHours(9, 0, 0, 0);
                      field.onChange(newDate.toISOString());
                    }
                  }}
                  disabled={(date) => {
                    // Allow selecting today and future dates
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <Input
                    type="time"
                    value={field.value ? format(new Date(field.value), "HH:mm") : "09:00"}
                    onChange={(e) => {
                      const timeValue = e.target.value;
                      if (!timeValue || !field.value) return;
                      
                      const existingDate = new Date(field.value);
                      const [hours, minutes] = timeValue.split(':');
                      existingDate.setHours(parseInt(hours), parseInt(minutes));
                      field.onChange(existingDate.toISOString());
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ongoing"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Ongoing Project</FormLabel>
              <div className="text-sm text-muted-foreground">
                This project has no specific end date
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {!form.watch("ongoing") && (
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP 'at' p")
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        // Set time to 11:59 PM by default
                        const newDate = new Date(date);
                        newDate.setHours(23, 59, 0, 0);
                        field.onChange(newDate.toISOString());
                      }
                    }}
                    disabled={(date) => {
                      const startDate = form.watch("start_date");
                      if (startDate) {
                        const startDateObj = new Date(startDate);
                        startDateObj.setHours(0, 0, 0, 0);
                        return date < startDateObj;
                      }
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      value={field.value ? format(new Date(field.value), "HH:mm") : "23:59"}
                      onChange={(e) => {
                        const timeValue = e.target.value;
                        if (!timeValue || !field.value) return;
                        
                        const existingDate = new Date(field.value);
                        const [hours, minutes] = timeValue.split(':');
                        existingDate.setHours(parseInt(hours), parseInt(minutes));
                        field.onChange(existingDate.toISOString());
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="timezone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timezone</FormLabel>
            <FormControl>
              <Input placeholder="UTC" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rhythm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rhythm</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || "One-time"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select rhythm" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {rhythmOptions.map((rhythm) => (
                  <SelectItem key={rhythm} value={rhythm}>{rhythm}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("rhythm") === "24/7 Watch" && (
        <FormField
          control={form.control}
          name="slot_length_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slot Length (minutes)</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select slot length" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );

  const renderTeamStep = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="max_team_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Team Size (0 = unlimited)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                placeholder="0"
                {...field}
                value={field.value || 0}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allow_public_signup"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Allow Public Signup</FormLabel>
              <div className="text-sm text-muted-foreground">
                Anyone can join this project
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="approval_mode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Approval Mode</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || "Auto"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select approval mode" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Auto">Auto-approve</SelectItem>
                <SelectItem value="Manual">Manual review</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="capacity_total"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Capacity (0 = unlimited)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                placeholder="0"
                {...field}
                value={field.value || 0}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="capacity_per_slot"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacity Per Slot</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1"
                placeholder="5"
                {...field}
                value={field.value || 5}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Project Summary</h3>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-medium">Title:</dt>
            <dd>{form.watch("title")}</dd>
          </div>
          <div>
            <dt className="font-medium">Type:</dt>
            <dd>{form.watch("type")}</dd>
          </div>
          <div>
            <dt className="font-medium">Summary:</dt>
            <dd className="text-gray-600">{form.watch("summary")}</dd>
          </div>
          <div>
            <dt className="font-medium">Visibility:</dt>
            <dd>{form.watch("visibility")}</dd>
          </div>
          <div>
            <dt className="font-medium">Schedule:</dt>
            <dd>
              {(() => {
                const startDate = form.watch("start_date");
                const endDate = form.watch("end_date");
                const ongoing = form.watch("ongoing");
                
                let display = "";
                if (startDate && !isNaN(new Date(startDate).getTime())) {
                  display += new Date(startDate).toLocaleString();
                }
                if (ongoing) {
                  display += " (Ongoing)";
                } else if (endDate && !isNaN(new Date(endDate).getTime())) {
                  display += ` - ${new Date(endDate).toLocaleString()}`;
                }
                return display;
              })()}
            </dd>
          </div>
        </dl>
      </div>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Draft">Save as Draft</SelectItem>
                <SelectItem value="Review">Submit for Review</SelectItem>
                <SelectItem value="Published">Publish Now</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 1: return renderBasicsStep();
      case 2: return renderScheduleStep();
      case 3: return renderTeamStep();
      case 4: return renderReviewStep();
      default: return renderBasicsStep();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Project Basics";
      case 2: return "Schedule & Timing";
      case 3: return "Team & Capacity";
      case 4: return "Review & Publish";
      default: return "Project Basics";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            Step {currentStep} of {totalSteps}: {getStepTitle()}
          </DialogDescription>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="min-h-[400px]">
              {getStepContent()}
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrev}>
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  form.setValue("status", "Draft");
                  form.handleSubmit(onSubmit)();
                }}>
                  Save Draft
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={projectMutation.isPending}>
                    {projectMutation.isPending ? "Saving..." : editingProject ? 'Update Project' : 'Create Project'}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}