import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Eye, CheckCircle, Gift } from "lucide-react";
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
  
  const getProgressForTraining = (trainingId: number) => {
    if (!userProgress) return 0;
    const progressEntry = userProgress.find((p: any) => p.training_id === trainingId);
    return progressEntry?.completed ? 100 : (progressEntry?.score || 0);
  };

  const isEnrolled = (trainingId: number) => {
    if (!enrolledTrainings) return false;
    return enrolledTrainings.some((enrollment: any) => enrollment.id === trainingId);
  };

  const handleStartTraining = async (trainingId: number) => {
    try {
      const response = await fetch(`/api/trainings/${trainingId}/content`);
      const content = await response.json();
      
      if (content?.chapters?.length > 0 && content.chapters[0]?.sections?.length > 0) {
        const firstChapter = content.chapters[0];
        const firstSection = firstChapter.sections[0];
        setLocation(`/training/${trainingId}/chapter/${firstChapter.id}/section/${firstSection.id}`);
      } else {
        setLocation(`/training/${trainingId}`);
      }
    } catch (error) {
      console.error('Error fetching training content:', error);
      setLocation(`/training/${trainingId}`);
    }
  };

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
      
      <section 
        className="relative min-h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${trainingHeroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
              fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: 'white',
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              marginBottom: '1.5rem',
              animation: 'slow-blink 4s ease-in-out infinite'
            }}
          >
            WATCHMEN TRAINING ACCORDING TO THE FATHER'S HEART
          </h1>
          
          {!user && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wide">
                <Link to="/register">Register to Access Training</Link>
              </Button>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold">
                <Link to="/login">Sign in to your account</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 sm:mb-6">
              OUR TRAINING APPROACH
            </h2>
            <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl text-blue-800 font-medium leading-relaxed">
                The watchmen's movement offers you a journey that will enable you to stand up and be effective as a watchman praying for souls according to the Father's Heart
              </p>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            <div className="space-y-8 mb-12 lg:mb-0">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    UNDERSTAND THE VISION
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "Where there is no vision, the people perish: but he that keepeth the law, happy is he"
                    <span className="font-medium"> Proverbs 29:18</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    EQUIP FOR INTERCESSION
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth"
                    <span className="font-medium"> 2 Timothy 2:15</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-blue-900" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    DEPLOY AS WATCHMEN
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    "I have set watchmen upon thy walls, O Jerusalem, which shall never hold their peace day nor night"
                    <span className="font-medium"> Isaiah 62:6</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-8">
              <div className="shadow-2xl">
                <img
                  src={studyImage}
                  alt="Prayer study materials with journal and tea cup"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              OUR TRAINING MODULES
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive training programs designed to equip watchmen for effective prayer ministry and global impact.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
              </div>
            ) : trainings?.length > 0 ? (
              trainings.map((training: any) => {
                const progress = getProgressForTraining(training.id);
                const isCompleted = progress === 100;
                
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
                  <div key={training.id} className="group">
                    <div className="bg-white overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={training.image_url || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                          alt={training.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`${getTypeColor(training.type)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                            {training.type || 'Training'}
                          </span>
                        </div>
                        {isCompleted && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Completed
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="w-7 h-7 text-blue-900" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">
                          {training.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-center text-sm">
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
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm" asChild className="border-blue-900 text-blue-900 hover:bg-blue-50">
                            <Link to={`/training/${training.id}`}>Learn More</Link>
                          </Button>
                          {!user ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleEnroll(training.id)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
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
                              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                            >
                              {isCompleted ? 'Completed' : 'Enroll'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-900" />
                </div>
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
