import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, PlayCircle, CheckCircle2, Clock, Trophy } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function WatchmanDashboard() {
  const { user } = useAuth();
  
  const { data: enrolledTrainings = [] } = useQuery({
    queryKey: ['/api/me/enrolled-trainings'],
    enabled: !!user,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ['/api/me/progress'],
    enabled: !!user,
  });

  const getProgressForTraining = (trainingId: number) => {
    const progress = userProgress.find((p: any) => p.training_id === trainingId);
    return progress?.score || 0;
  };

  const getCompletedCount = () => {
    return userProgress.filter((p: any) => p.completed).length;
  };

  const getTotalStudyTime = () => {
    // Calculate based on enrolled trainings - mock for now
    return enrolledTrainings.length * 2.5; // hours
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">Continue your journey as a Prayer Watchman</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Trainings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledTrainings.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCompletedCount()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalStudyTime()}h</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getCompletedCount() >= 3 ? "Advanced" : getCompletedCount() >= 1 ? "Intermediate" : "Beginner"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="my-learning" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-learning">My Learning</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="my-learning" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Continue Learning</h2>
            <Button asChild variant="outline">
              <Link to="/training">Browse All Trainings</Link>
            </Button>
          </div>
          
          {enrolledTrainings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No enrolled trainings yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start your journey by enrolling in our comprehensive training modules
                </p>
                <Button asChild>
                  <Link to="/training">Explore Trainings</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledTrainings.map((training: any) => (
                <Card key={training.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary">
                        {training.type === 'video' ? 'Video' : training.type === 'pdf' ? 'Document' : 'Interactive'}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {getProgressForTraining(training.id)}% Complete
                      </div>
                    </div>
                    <CardTitle className="text-lg">{training.title}</CardTitle>
                    <CardDescription>{training.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={getProgressForTraining(training.id)} className="mb-4" />
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link to={`/training/${training.id}/player`}>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continue
                        </Link>
                      </Button>
                      {training.type === 'qcm' && (
                        <Button size="sm" variant="outline">
                          Take Quiz
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <h2 className="text-xl font-semibold">Learning Progress</h2>
          
          {userProgress.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No progress data yet</h3>
                <p className="text-muted-foreground text-center">
                  Start learning to track your progress
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userProgress.map((progress: any) => (
                <Card key={progress.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Training Progress</CardTitle>
                      <Badge variant={progress.completed ? "default" : "secondary"}>
                        {progress.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress.score}%</span>
                      </div>
                      <Progress value={progress.score} />
                      {progress.completed && (
                        <div className="flex items-center text-sm text-green-600 mt-2">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Completed on {new Date(progress.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <h2 className="text-xl font-semibold">Certificates & Achievements</h2>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Certificates Coming Soon</h3>
              <p className="text-muted-foreground text-center">
                Complete training modules to earn certificates of completion
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}