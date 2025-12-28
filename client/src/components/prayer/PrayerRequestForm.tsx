import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { insertPrayerRequestSchema } from "@shared/schema";
import { z } from "zod";

// Extend the schema for the form
const prayerRequestFormSchema = insertPrayerRequestSchema.extend({
  is_public: z.boolean().default(false),
}).omit({ submitted_at: true });

export default function PrayerRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form default values
  const defaultValues = {
    name: user?.name || "",
    message: "",
    category: "personal" as const,
    anonymous: false,
    is_public: false,
    submitted_by: user?.id
  };
  
  const form = useForm<z.infer<typeof prayerRequestFormSchema>>({
    resolver: zodResolver(prayerRequestFormSchema),
    defaultValues,
  });
  
  async function onSubmit(data: z.infer<typeof prayerRequestFormSchema>) {
    setIsSubmitting(true);
    try {
      // Add the user ID if available
      if (user) {
        data.submitted_by = user.id;
      }
      
      const response = await apiRequest("POST", "/api/prayer-requests", data);
      
      if (response.ok) {
        toast({
          title: "Prayer request submitted",
          description: "Thank you for sharing your request with our prayer community.",
        });
        form.reset(defaultValues);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit prayer request");
      }
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your prayer request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name (optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your name" />
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
              <FormLabel>Request Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="healing">Healing</SelectItem>
                  <SelectItem value="guidance">Guidance</SelectItem>
                  <SelectItem value="global_issues">Global Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Prayer Request</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Share your request here..." 
                  rows={4} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="anonymous"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Submit anonymously</FormLabel>
                <p className="text-sm text-gray-500">
                  Your name will not be displayed, even if provided.
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_public"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Make request public on prayer wall</FormLabel>
                <p className="text-sm text-gray-500">
                  If checked, your request will be visible to all users (name will be hidden if anonymous).
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
        </Button>
      </form>
    </Form>
  );
}
