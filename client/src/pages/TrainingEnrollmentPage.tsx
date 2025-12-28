import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BookOpen, Clock, Play, CheckCircle } from "lucide-react";
import { Link } from "wouter";

interface Training {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: number;
  created_at: string;
}

interface Enrollment {
  training_id: number;
  enrolled_at: string;
}

export default function TrainingEnrollmentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: trainings = [] } = useQuery({
    queryKey: ['/api/trainings'],
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['/api/me/enrollments'],
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async (trainingId: number) => {
      return apiRequest("POST", "/api/trainings/enroll", { training_id: trainingId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/enrolled-trainings"] });
      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in the training. You can now access the content.",
      });
    },
    onError: (error) => {
      toast({
        title: "Enrollment Failed",
        description: "Failed to enroll in training. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isEnrolled = (trainingId: number) => {
    return enrollments.some((enrollment: Enrollment) => enrollment.training_id === trainingId);
  };

  const handleEnroll = (trainingId: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to enroll in training courses.",
        variant: "destructive",
      });
      return;
    }
    enrollMutation.mutate(trainingId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Training Courses</h1>
        <p className="text-gray-600">
          Discover and enroll in prayer training courses to deepen your spiritual journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training: Training) => {
          const enrolled = isEnrolled(training.id);
          
          return (
            <Card key={training.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{training.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {training.description}
                    </CardDescription>
                  </div>
                  {enrolled && (
                    <Badge variant="secondary" className="ml-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enrolled
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span className="capitalize">{training.type}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{training.duration} min</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    {enrolled ? (
                      <Button asChild className="w-full">
                        <Link to={`/training/${training.id}`}>
                          <Play className="w-4 h-4 mr-2" />
                          Start Training
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleEnroll(training.id)}
                        disabled={enrollMutation.isPending}
                        className="w-full"
                      >
                        {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {trainings.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Training Courses Available</h3>
          <p className="text-gray-600">
            Training courses will appear here once they are created by administrators.
          </p>
        </div>
      )}
    </div>
  );
}