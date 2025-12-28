import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, PlayCircle, FileText, CheckCircle2, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Helmet } from "react-helmet";

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [openChapters, setOpenChapters] = useState<number[]>([]);

  const { data: training, isLoading } = useQuery({
    queryKey: [`/api/trainings/${id}`],
    enabled: !!id,
  });

  const { data: content } = useQuery({
    queryKey: [`/api/trainings/${id}/content`],
    enabled: !!id,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/me/progress'],
    enabled: !!user,
  });

  const { data: enrolledTrainings = [] } = useQuery({
    queryKey: ['/api/me/enrolled-trainings'],
    enabled: !!user,
  });

  const isEnrolled = enrolledTrainings.some((t: any) => t.id === parseInt(id || '0'));

  const enrollMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', `/api/trainings/${id}/enroll`);
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Successful",
        description: "You now have access to this training!",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/me/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/me/enrolled-trainings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in training.",
        variant: "destructive",
      });
    },
  });

  const toggleChapter = (chapterId: number) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const getProgressForTraining = () => {
    if (!userProgress) return 0;
    const progressEntry = userProgress.find((p: any) => p.training_id === parseInt(id || '0'));
    return progressEntry?.score || 0;
  };

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to enroll in this training.",
        variant: "default",
      });
      setLocation("/login");
      return;
    }
    enrollMutation.mutate();
  };

  const handleStartSection = (chapterId: number, sectionId: number) => {
    if (!isEnrolled) {
      toast({
        title: "Enrollment Required",
        description: "Please enroll in this training to access content.",
        variant: "default",
      });
      return;
    }
    setLocation(`/training/${id}/chapter/${chapterId}/section/${sectionId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Training Not Found</h1>
        <p className="text-gray-600">The training you're looking for doesn't exist.</p>
      </div>
    );
  }

  const progress = getProgressForTraining();

  return (
    <>
      <Helmet>
        <title>{`${training.title} | Prayer Watchman Training`}</title>
        <meta name="description" content={training.description || ''} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Training Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700">
            {training.image_url && (
              <img 
                src={training.image_url} 
                alt={training.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <Badge className="mb-2 bg-white/20 text-white border-white/30">
                {training.type || 'Training'}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{training.title}</h1>
              <p className="text-lg opacity-90">{training.description}</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {isEnrolled && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Progress:</span>
                    <Progress value={progress} className="w-32" />
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                {!isEnrolled ? (
                  <Button 
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                    size="lg"
                  >
                    {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                  </Button>
                ) : (
                  <Badge variant="secondary" className="px-4 py-2">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Enrolled
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Training Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {content?.chapters?.length || 0} chapters with sections and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!content?.chapters?.length ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No content available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {content.chapters.map((chapter: any, chapterIndex: number) => (
                      <Collapsible 
                        key={chapter.id}
                        open={openChapters.includes(chapter.id)}
                        onOpenChange={() => toggleChapter(chapter.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <div className="flex items-center space-x-3">
                              {openChapters.includes(chapter.id) ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                              <div>
                                <h3 className="font-medium">
                                  Chapter {chapterIndex + 1}: {chapter.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {chapter.sections?.length || 0} sections
                                </p>
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-2">
                          <div className="pl-8 space-y-2">
                            {chapter.sections?.map((section: any, sectionIndex: number) => (
                              <div 
                                key={section.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                              >
                                <div className="flex items-center space-x-3">
                                  {section.video_url ? (
                                    <PlayCircle className="w-5 h-5 text-blue-600" />
                                  ) : (
                                    <FileText className="w-5 h-5 text-gray-600" />
                                  )}
                                  <div>
                                    <h4 className="font-medium">
                                      {sectionIndex + 1}. {section.title}
                                    </h4>
                                    {section.content && (
                                      <p className="text-sm text-gray-600">
                                        {section.content.substring(0, 100)}...
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                <Button
                                  variant={isEnrolled ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleStartSection(chapter.id, section.id)}
                                  disabled={!isEnrolled}
                                >
                                  {!isEnrolled ? (
                                    <>
                                      <Lock className="w-4 h-4 mr-2" />
                                      Locked
                                    </>
                                  ) : (
                                    <>
                                      <PlayCircle className="w-4 h-4 mr-2" />
                                      Start
                                    </>
                                  )}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Training Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Training Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapters</span>
                  <span className="font-medium">{content?.chapters?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sections</span>
                  <span className="font-medium">
                    {content?.chapters?.reduce((total: number, chapter: any) => 
                      total + (chapter.sections?.length || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{training.type || 'All Levels'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {isEnrolled && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/dashboard">View Dashboard</a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/training">Browse More Trainings</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}