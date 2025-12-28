import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlayIcon, BookIcon, CheckSquareIcon, ClockIcon, UsersIcon, LockIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import trainingHeroImage from "@assets/BibleStudy_1750393864827.jpg";
import studyImage from "@assets/image_1750394363906.png";

export default function TrainingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: trainings, isLoading } = useQuery({
    queryKey: ['/api/trainings'],
  });
  
  const { data: userProgress } = useQuery({
    queryKey: ['/api/me/progress'],
    enabled: !!user,
  });

  const { data: enrolledTrainings } = useQuery({
    queryKey: ['/api/me/enrolled-trainings'],
    enabled: !!user,
  });
  
  // Helper function to determine progress percentage for a training
  const getProgressForTraining = (trainingId: number) => {
    if (!userProgress) return 0;
    const progressEntry = userProgress.find((p: any) => p.training_id === trainingId);
    return progressEntry?.completed ? 100 : (progressEntry?.score || 0);
  };

  // Helper function to check if user is enrolled in a training
  const isEnrolled = (trainingId: number) => {
    if (!enrolledTrainings) return false;
    return enrolledTrainings.some((enrollment: any) => enrollment.id === trainingId);
  };

  // Helper function to handle starting training - go directly to first section
  const handleStartTraining = async (trainingId: number) => {
    try {
      // Fetch training content to get first section
      const response = await fetch(`/api/trainings/${trainingId}/content`);
      const content = await response.json();
      
      if (content?.chapters?.length > 0 && content.chapters[0]?.sections?.length > 0) {
        const firstChapter = content.chapters[0];
        const firstSection = firstChapter.sections[0];
        setLocation(`/training/${trainingId}/chapter/${firstChapter.id}/section/${firstSection.id}`);
      } else {
        // Fallback to training detail page if no content
        setLocation(`/training/${trainingId}`);
      }
    } catch (error) {
      console.error('Error fetching training content:', error);
      // Fallback to training detail page
      setLocation(`/training/${trainingId}`);
    }
  };

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (trainingId: number) => {
      return await apiRequest('POST', `/api/trainings/${trainingId}/enroll`);
    },
    onSuccess: () => {
      toast({
        title: "Enrollment Successful",
        description: "You now have access to this training module!",
        variant: "default",
      });
      // Invalidate cache to refresh user progress and enrolled trainings
      queryClient.invalidateQueries({ queryKey: ['/api/me/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/me/enrolled-trainings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll in training. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEnroll = (moduleId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please register or login to access the training content.",
        variant: "default",
      });
      // Redirect to register page with return URL
      setLocation("/register?return=/training");
      return;
    }
    
    enrollMutation.mutate(moduleId);
  };
  
  return (
    <>
      <Helmet>
        <title>Training | Prayer Watchman</title>
        <meta name="description" content="Access prayer training modules and become equipped as an effective intercessor with our comprehensive watchman training program." />
      </Helmet>
      
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] min-h-[500px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${trainingHeroImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: 'white',
                lineHeight: '1.1',
                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                marginBottom: '3rem',
                animation: 'slow-blink 4s ease-in-out infinite'
              }}
            >
              WATCHMEN TRAINING ACCORDING TO THE FATHER'S HEART
            </h1>
            
            {!user && (
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 mt-8">
                <Link to="/register">Register to Access Training</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Training Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                Watchmen Training According to the Father's Heart
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                The watchmen's movement offers you a journey that will enable you to stand up and be effective as a watchman praying for souls according to the Father's Heart.
              </p>
            </div>
            
            {/* Image */}
            <div>
              <img 
                src={studyImage} 
                alt="Prayer study materials with journal and tea cup"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Training Modules Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Our Training Modules
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive training programs designed to equip watchmen for effective prayer ministry and global impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : trainings?.length > 0 ? (
              trainings.map((training: any) => {
                const progress = getProgressForTraining(training.id);
                const isCompleted = progress === 100;
                
                // Get training type color
                const getTypeColor = (type: string) => {
                  switch (type?.toLowerCase()) {
                    case 'foundation': return 'bg-blue-600';
                    case 'intermediate': return 'bg-green-600';
                    case 'advanced': return 'bg-red-600';
                    case 'prophetic': return 'bg-purple-600';
                    case 'leadership': return 'bg-orange-600';
                    default: return 'bg-gray-600';
                  }
                };
                
                return (
                  <div key={training.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        src={training.image_url || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
                        alt={training.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`${getTypeColor(training.type)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                          {training.type || 'Training'}
                        </span>
                      </div>
                      {isCompleted && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            ✓ Completed
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {training.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {training.description}
                      </p>
                      
                      {user && progress > 0 && progress < 100 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/training/${training.id}`}>Learn More</Link>
                        </Button>
                        {!user ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleEnroll(training.id)}
                          >
                            Enroll
                          </Button>
                        ) : isEnrolled(training.id) ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleStartTraining(training.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {progress > 0 ? 'Continue' : 'Start'}
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleEnroll(training.id)}
                            disabled={isCompleted}
                          >
                            {isCompleted ? 'Completed' : 'Enroll'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No training modules available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
