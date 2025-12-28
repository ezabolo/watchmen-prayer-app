import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  PlayCircle, 
  CheckCircle2, 
  FileText, 
  Download,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Clock
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function VideoPlayerPage() {
  const { trainingId } = useParams();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch training data
  const { data: training, isLoading: trainingLoading } = useQuery({
    queryKey: [`/api/trainings/${trainingId}`],
  });

  // Fetch training content
  const { data: content } = useQuery({
    queryKey: [`/api/trainings/${trainingId}/content`],
  });

  // Fetch user progress
  const { data: userProgress } = useQuery({
    queryKey: ['/api/me/progress'],
  });

  // Progress mutation
  const progressMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', `/api/trainings/${trainingId}/progress`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me/progress'] });
      toast({
        title: "Progress Saved",
        description: "Your progress has been updated.",
      });
    },
  });

  if (trainingLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!training || !content?.chapters?.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Training Content Not Available</h2>
          <p className="text-gray-600 mb-4">This training doesn't have any content yet.</p>
          <Button onClick={() => setLocation('/dashboard')}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  // Get all sections in order
  const allSections = content.chapters.flatMap((chapter: any) => 
    chapter.sections?.map((section: any) => ({
      ...section,
      chapterTitle: chapter.title,
      chapterOrder: chapter.order_index
    })) || []
  ).sort((a: any, b: any) => {
    if (a.chapterOrder !== b.chapterOrder) {
      return a.chapterOrder - b.chapterOrder;
    }
    return a.order_index - b.order_index;
  });

  // Set current section to first section if none selected
  const currentSection = currentSectionId 
    ? allSections.find((s: any) => s.id === currentSectionId)
    : allSections[0];

  if (!currentSection && !currentSectionId) {
    setCurrentSectionId(allSections[0]?.id);
  }

  const currentSectionIndex = allSections.findIndex((s: any) => s.id === currentSection?.id);
  const nextSection = allSections[currentSectionIndex + 1];
  const prevSection = allSections[currentSectionIndex - 1];

  const getProgressForTraining = () => {
    const progress = userProgress?.find((p: any) => p.training_id === parseInt(trainingId || '0'));
    return progress?.score || 0;
  };

  const markSectionComplete = async () => {
    if (!currentSection) return;
    
    const completedSections = currentSectionIndex + 1;
    const totalSections = allSections.length;
    const newScore = Math.round((completedSections / totalSections) * 100);
    
    progressMutation.mutate({
      score: newScore,
      completed: newScore === 100,
      section_data: { completed_section_id: currentSection.id }
    });
  };

  const navigateToSection = (sectionId: number) => {
    setCurrentSectionId(sectionId);
  };

  return (
    <>
      <Helmet>
        <title>{`${currentSection?.title || 'Video Player'} | ${training.title} | Prayer Watchman`}</title>
        <meta name="description" content={currentSection?.content || training.description || ''} />
      </Helmet>

      <div className="h-screen flex bg-gray-900">
        {/* Main Video Area */}
        <div className={`flex-1 flex flex-col ${sidebarOpen ? 'mr-80' : ''}`}>
          {/* Top Bar */}
          <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/dashboard')}
              >
                ← Back to Dashboard
              </Button>
              <div>
                <h1 className="font-semibold text-lg">{training.title}</h1>
                <p className="text-sm text-gray-600">{currentSection?.chapterTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Your progress:</span>
                <Progress value={getProgressForTraining()} className="w-24" />
                <span className="text-sm font-medium">{getProgressForTraining()}%</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center">
            {currentSection?.video_url ? (
              <div className="w-full h-full">
                {currentSection.video_url.includes('youtube.com') || currentSection.video_url.includes('youtu.be') ? (
                  <iframe
                    src={currentSection.video_url}
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
            ) : (
              <div className="text-white text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">{currentSection?.title}</h3>
                <p className="text-gray-300">No video available for this section</p>
              </div>
            )}
          </div>

          {/* Bottom Control Bar */}
          <div className="bg-white border-t px-6 py-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => prevSection && navigateToSection(prevSection.id)}
                disabled={!prevSection}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-4">
                <Button onClick={markSectionComplete} disabled={progressMutation.isPending}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {progressMutation.isPending ? "Saving..." : "Mark Complete"}
                </Button>
                
                {currentSection?.file_url && (
                  <Button variant="outline" asChild>
                    <a href={currentSection.file_url} download target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Resources
                    </a>
                  </Button>
                )}
              </div>
              
              <Button
                onClick={() => nextSection && navigateToSection(nextSection.id)}
                disabled={!nextSection}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 bg-white border-l flex flex-col fixed right-0 top-0 h-full z-10">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-lg">Course Content</h2>
              <p className="text-sm text-gray-600">
                {allSections.length} sections • {content.chapters.length} chapters
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {content.chapters.map((chapter: any, chapterIndex: number) => (
                <div key={chapter.id} className="border-b">
                  <div className="p-4 bg-gray-50">
                    <h3 className="font-medium text-sm">
                      Section {chapterIndex + 1}: {chapter.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {chapter.sections?.length || 0} lessons
                    </p>
                  </div>
                  
                  {chapter.sections?.map((section: any, sectionIndex: number) => (
                    <button
                      key={section.id}
                      onClick={() => navigateToSection(section.id)}
                      className={`w-full text-left p-4 hover:bg-gray-50 border-b last:border-b-0 transition-colors ${
                        section.id === currentSection?.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {section.video_url ? (
                            <PlayCircle className={`w-4 h-4 ${section.id === currentSection?.id ? 'text-blue-600' : 'text-gray-400'}`} />
                          ) : (
                            <FileText className={`w-4 h-4 ${section.id === currentSection?.id ? 'text-blue-600' : 'text-gray-400'}`} />
                          )}
                          <div>
                            <p className={`text-sm font-medium ${section.id === currentSection?.id ? 'text-blue-900' : 'text-gray-900'}`}>
                              {sectionIndex + 1}. {section.title}
                            </p>
                            {section.content && (
                              <p className="text-xs text-gray-500 mt-1">
                                {section.content.substring(0, 60)}...
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {section.id === currentSection?.id && (
                          <Badge variant="secondary" className="text-xs">
                            Playing
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Sidebar Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
                <Progress value={getProgressForTraining()} className="mb-2" />
                <p className="text-xs text-gray-500">{getProgressForTraining()}% Complete</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}