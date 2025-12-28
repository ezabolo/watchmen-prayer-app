import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export default function WatchmanTraining() {
  const { user } = useAuth();
  const { data: trainings, isLoading } = useQuery({
    queryKey: ['/api/trainings'],
  });
  
  const { data: userProgress } = useQuery({
    queryKey: ['/api/me/progress'],
    enabled: !!user,
  });
  
  // Helper function to determine progress for a training
  const getProgressForTraining = (trainingId: number) => {
    if (!userProgress) return 0;
    const progressEntry = userProgress.find((p: any) => p.training_id === trainingId);
    return progressEntry?.completed ? 100 : (progressEntry?.score || 0);
  };
  
  // Training module data for initial rendering
  const trainingModules = [
    {
      id: 1,
      title: "Foundations of Biblical Prayer",
      description: "Learn prayer models from Scripture and discover how to pray effectively based on biblical principles.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&h=384",
      level: "Foundational",
      modules: 4,
      progress: 75,
      enrolledCount: 4829,
      duration: "6 hours"
    },
    {
      id: 2,
      title: "Spiritual Warfare & Intercession",
      description: "Discover strategies for effective spiritual warfare and learn to stand in the gap through targeted intercession.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&h=384",
      level: "Intermediate",
      modules: 5,
      progress: 40,
      enrolledCount: 3512,
      duration: "8 hours"
    },
    {
      id: 3,
      title: "Global Prayer Strategy",
      description: "Learn to develop and implement strategic prayer initiatives focused on world issues and unreached regions.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&h=384",
      level: "Advanced",
      modules: 6,
      progress: 20,
      enrolledCount: 1894,
      duration: "10 hours"
    }
  ];
  
  // Use fetched data if available, otherwise fall back to sample data
  const displayTrainings = trainings || trainingModules;
  
  // Helper to determine badge color based on level
  const getLevelBadgeColor = (level: string) => {
    switch(level) {
      case "Foundational":
        return "bg-accent-500 text-white";
      case "Intermediate":
        return "bg-secondary-500 text-white";
      case "Advanced":
        return "bg-primary-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  return (
    <section className="py-16 bg-gradient-to-r from-secondary-500 to-secondary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-secondary-100 tracking-wide uppercase">Equipped for Impact</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Become a Prayer Watchman
          </p>
          <p className="max-w-2xl mt-5 mx-auto text-xl text-secondary-100">
            Complete our comprehensive training program and join a global network of intercessors making a difference.
          </p>
        </div>

        {/* Training modules preview */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayTrainings.map((training) => (
            <Card key={training.id} className="bg-white rounded-lg shadow-xl overflow-hidden text-gray-900">
              <div className="relative h-48 bg-secondary-900">
                <img 
                  className="h-full w-full object-cover" 
                  src={training.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&h=384"} 
                  alt={`${training.title} training module`} 
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-full px-4 py-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <Badge className={getLevelBadgeColor(training.level || "Foundational")}>
                        {training.level || "Foundational"}
                      </Badge>
                    </div>
                    <span className="text-gray-100 text-sm">{training.modules || 4} modules</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">{training.title}</h3>
                <p className="mt-2 text-gray-600">{training.description}</p>
                
                <div className="mt-4">
                  <Progress 
                    value={user ? getProgressForTraining(training.id) : training.progress} 
                    className="h-2 bg-gray-100" 
                  />
                </div>
                
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>{training.enrolledCount || 1000}+ enrolled</span>
                  <span>{training.duration || "6 hours"} to complete</span>
                </div>
                
                <Button asChild className="mt-4 w-full">
                  <Link to={user ? `/training` : `/login`}>
                    {user ? (getProgressForTraining(training.id) > 0 ? 'Continue Training' : 'Begin Training') : 'Sign in to Begin'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild className="bg-secondary-700 hover:bg-secondary-800 text-white">
            <Link to="/training">
              View All Training Modules
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
