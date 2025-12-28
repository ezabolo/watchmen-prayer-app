import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, FileText, Download, CheckCircle2, PlayCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Helmet } from "react-helmet";

// Helper function to convert YouTube URLs to embed format
const convertToEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('youtube.com/embed/')) {
    return url; // Already in embed format
  }
  return url;
};

export default function SectionContentPage() {
  const { id: trainingId, chapterId, sectionId } = useParams<{ 
    id: string; 
    chapterId: string; 
    sectionId: string; 
  }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [trainingId, chapterId, sectionId]);

  const { data: training } = useQuery({
    queryKey: ['/api/trainings', trainingId],
    enabled: !!trainingId,
  });

  const { data: content, isLoading } = useQuery({
    queryKey: [`/api/trainings/${trainingId}/content`],
    enabled: !!trainingId,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/me/progress'],
    enabled: !!user,
  });

  const { data: enrolledTrainings = [] } = useQuery({
    queryKey: ['/api/me/enrolled-trainings'],
    enabled: !!user,
  });

  const isEnrolled = (enrolledTrainings as any[]).some((t: any) => t.id === parseInt(trainingId || '0'));

  // Find current chapter and section
  const contentData = content as any;
  const currentChapter = contentData?.chapters?.find((c: any) => c.id === parseInt(chapterId || '0'));
  const currentSection = currentChapter?.sections?.find((s: any) => s.id === parseInt(sectionId || '0'));

  // Debug logging
  console.log('=== SectionContentPage Debug ===');
  console.log('URL Params:', { trainingId, chapterId, sectionId });
  console.log('Parsed IDs:', { 
    trainingId: parseInt(trainingId || '0'),
    chapterId: parseInt(chapterId || '0'), 
    sectionId: parseInt(sectionId || '0') 
  });
  console.log('Content loading state:', { isLoading, contentExists: !!content });
  console.log('Raw content:', content);
  console.log('Available chapters:', contentData?.chapters?.map((c: any) => ({
    id: c.id,
    title: c.title,
    sections: c.sections?.map((s: any) => ({ id: s.id, title: s.title }))
  })));
  console.log('Current chapter found:', currentChapter ? { id: currentChapter.id, title: currentChapter.title } : 'NOT FOUND');
  console.log('Current section found:', currentSection ? { id: currentSection.id, title: currentSection.title } : 'NOT FOUND');
  console.log('================================');

  // Find navigation
  const allSections = contentData?.chapters?.flatMap((chapter: any, chapterIndex: number) =>
    chapter.sections?.map((section: any, sectionIndex: number) => ({
      ...section,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      chapterIndex,
      sectionIndex,
      globalIndex: contentData.chapters.slice(0, chapterIndex).reduce((acc: number, ch: any) => acc + (ch.sections?.length || 0), 0) + sectionIndex
    })) || []
  ) || [];

  const currentSectionGlobalIndex = allSections.findIndex((s: any) => s.id === parseInt(sectionId || '0'));
  const prevSection = currentSectionGlobalIndex > 0 ? allSections[currentSectionGlobalIndex - 1] : null;
  const nextSection = currentSectionGlobalIndex < allSections.length - 1 ? allSections[currentSectionGlobalIndex + 1] : null;

  const progressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      return await apiRequest('POST', `/api/trainings/${trainingId}/progress`, progressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me/progress'] });
      toast({
        title: "Progress Updated",
        description: "Your progress has been saved.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update progress.",
        variant: "destructive",
      });
    },
  });

  const markAsCompleted = () => {
    progressMutation.mutate({
      completed: true,
      score: Math.min(100, Math.round((currentSectionGlobalIndex + 1) / allSections.length * 100))
    });
  };

  const handleNavigation = (section: any) => {
    setLocation(`/training/${trainingId}/chapter/${section.chapterId}/section/${section.id}`);
  };

  // Show loading state while data is being fetched
  if (!training || !content) {
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

  if (!isEnrolled) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You need to enroll in this training to access its content.</p>
        <Button onClick={() => setLocation(`/training/${trainingId}`)}>
          View Training Details
        </Button>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Section Not Found</h1>
        <p className="text-gray-600 mb-6">The section you're looking for doesn't exist.</p>
        <p className="text-sm text-gray-500 mb-4">
          Looking for Chapter ID: {chapterId}, Section ID: {sectionId}
        </p>
        <Button onClick={() => setLocation(`/training/${trainingId}`)}>
          Back to Training
        </Button>
      </div>
    );
  }

  const getProgressPercentage = () => {
    if (!userProgress) return 0;
    const progressEntry = (userProgress as any[]).find((p: any) => p.training_id === parseInt(trainingId || '0'));
    return progressEntry?.score || 0;
  };

  return (
    <>
      <Helmet>
        <title>{`${currentSection.title} | ${(training as any)?.title || ''} | Prayer Watchman`}</title>
        <meta name="description" content={currentSection.content || currentSection.title || ''} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setLocation(`/training/${trainingId}`)}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Training
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">{(training as any)?.title}</h1>
                  <p className="text-sm text-gray-600">
                    {currentChapter?.title} • {currentSection.title}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <Progress value={getProgressPercentage()} className="w-24" />
                  <span className="text-sm font-medium">{Math.round(getProgressPercentage())}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{currentSection.title}</CardTitle>
                      <p className="text-gray-600 mt-2">
                        Chapter {currentChapter?.order_index}: {currentChapter?.title}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      Section {currentSection.order_index}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Video Content */}
                  {currentSection.video_url && (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      {currentSection.video_url.includes('youtube.com') || currentSection.video_url.includes('youtu.be') ? (
                        <iframe
                          src={convertToEmbedUrl(currentSection.video_url)}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                          title={currentSection.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : currentSection.video_url.includes('vimeo.com') ? (
                        <iframe
                          src={currentSection.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                          className="w-full h-full"
                          frameBorder="0"
                          allowFullScreen
                          title={currentSection.title}
                        />
                      ) : (
                        <video
                          controls
                          className="w-full h-full"
                          src={currentSection.video_url}
                          title={currentSection.title}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  )}

                  {/* Text Content */}
                  {currentSection.content && (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {currentSection.content}
                      </div>
                    </div>
                  )}

                  {/* File Download */}
                  {currentSection.file_url && (
                    <Card className="border-dashed">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="font-medium">Additional Resource</p>
                            <p className="text-sm text-gray-600">Download supplementary material</p>
                          </div>
                        </div>
                        <Button asChild variant="outline">
                          <a href={currentSection.file_url} download target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => prevSection && handleNavigation(prevSection)}
                      disabled={!prevSection}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    
                    <Button onClick={markAsCompleted} disabled={progressMutation.isPending}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {progressMutation.isPending ? "Saving..." : "Mark as Complete"}
                    </Button>
                    
                    <Button
                      onClick={() => nextSection && handleNavigation(nextSection)}
                      disabled={!nextSection}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Section Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {contentData?.chapters?.map((chapter: any, chapterIndex: number) => (
                      <div key={chapter.id}>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </h4>
                        <div className="space-y-1 ml-4">
                          {chapter.sections?.map((section: any, sectionIndex: number) => (
                            <button
                              key={section.id}
                              onClick={() => setLocation(`/training/${trainingId}/chapter/${chapter.id}/section/${section.id}`)}
                              className={`w-full text-left text-sm p-2 rounded hover:bg-gray-50 transition-colors ${
                                section.id === parseInt(sectionId || '0') ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {section.video_url ? (
                                  <PlayCircle className="w-3 h-3" />
                                ) : (
                                  <FileText className="w-3 h-3" />
                                )}
                                <span>{sectionIndex + 1}. {section.title}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{Math.round(getProgressPercentage())}%</span>
                      </div>
                      <Progress value={getProgressPercentage()} />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Section {currentSectionGlobalIndex + 1} of {allSections.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}