import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, Heart, TrendingUp, MapPin, Calendar, Book } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function PartnerDashboard() {
  const { user } = useAuth();
  
  const { data: partnerData } = useQuery({
    queryKey: ['/api/partner/profile'],
    enabled: !!user,
  });

  const { data: donations = [] } = useQuery({
    queryKey: ['/api/partner/donations'],
    enabled: !!user,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/partner/projects'],
    enabled: !!user,
  });

  const { data: enrolledTrainings = [] } = useQuery({
    queryKey: ['/api/me/enrolled-trainings'],
    enabled: !!user,
  });

  const { data: trainingProgress = [] } = useQuery({
    queryKey: ['/api/me/progress'],
    enabled: !!user,
  });

  const getTotalDonations = () => {
    return donations.reduce((sum: number, donation: any) => sum + donation.amount, 0);
  };

  const getActiveProjects = () => {
    return projects.filter((project: any) => project.status === 'active').length;
  };

  const getImpactMetrics = () => {
    // Calculate impact based on donations and projects
    const totalAmount = getTotalDonations();
    const watchmenSupported = Math.floor(totalAmount / 50); // Estimate
    const regionsImpacted = new Set(projects.map((p: any) => p.region)).size;
    
    return {
      watchmenSupported,
      regionsImpacted,
      prayerHours: watchmenSupported * 10, // Estimate
    };
  };

  const impact = getImpactMetrics();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white p-6 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-green-100">Thank you for partnering with the global prayer movement</p>
        </div>
        <Link href="/donate">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-lg">
            <Heart className="w-4 h-4 mr-2" />
            Make a Donation
          </Button>
        </Link>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalDonations().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime giving</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watchmen Supported</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impact.watchmenSupported}</div>
            <p className="text-xs text-muted-foreground">Prayer warriors equipped</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions Impacted</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impact.regionsImpacted}</div>
            <p className="text-xs text-muted-foreground">Global reach</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prayer Hours</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{impact.prayerHours}</div>
            <p className="text-xs text-muted-foreground">Estimated prayer impact</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="impact">Impact Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest contributions and impact</CardDescription>
              </CardHeader>
              <CardContent>
                {donations.slice(0, 5).map((donation: any) => (
                  <div key={donation.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">${donation.amount}</p>
                      <p className="text-sm text-muted-foreground">
                        {donation.project_title || 'General Fund'}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(donation.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {donations.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No donations yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Projects you're currently supporting</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.filter((p: any) => p.status === 'active').slice(0, 3).map((project: any) => (
                  <div key={project.id} className="py-3 border-b last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{project.title}</h4>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {project.region}
                    </div>
                  </div>
                ))}
                {getActiveProjects() === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No active projects
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-auto p-4">
                  <Link to="/donate">
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">Make Donation</div>
                      <div className="text-sm opacity-80">Support prayer warriors</div>
                    </div>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-auto p-4">
                  <Link to="/projects">
                    <div className="text-center">
                      <MapPin className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">Browse Projects</div>
                      <div className="text-sm opacity-80">Find initiatives to support</div>
                    </div>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-auto p-4">
                  <Link to="/reports">
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">View Reports</div>
                      <div className="text-sm opacity-80">See your impact</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <h2 className="text-xl font-semibold">My Training Progress</h2>
          
          {enrolledTrainings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Book className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No training enrolled yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start your spiritual growth journey with our training programs
                </p>
                <Button asChild>
                  <Link to="/training">Browse Training</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledTrainings.map((training: any) => {
                const progress = trainingProgress.find((p: any) => p.training_id === training.id);
                const progressPercent = progress ? (progress.completed ? 100 : 50) : 0;
                
                return (
                  <Card key={training.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{training.title}</CardTitle>
                        <Badge variant={progress?.completed ? 'default' : 'secondary'}>
                          {progress?.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      <CardDescription>{training.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-muted-foreground">
                            Level: {training.level || 'Beginner'}
                          </span>
                          <Button asChild size="sm">
                            <Link to={`/training/${training.id}`}>
                              {progress?.completed ? 'Review' : 'Continue'}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Donation History</h2>
            <Button asChild>
              <Link to="/donate">Make New Donation</Link>
            </Button>
          </div>
          
          {donations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No donations yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start supporting the global prayer movement today
                </p>
                <Button asChild>
                  <Link to="/donate">Make Your First Donation</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {donations.map((donation: any) => (
                <Card key={donation.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">${donation.amount}</h3>
                        <p className="text-muted-foreground">
                          {donation.project_title || 'General Prayer Fund'}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(donation.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                        {donation.status || 'Completed'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <h2 className="text-xl font-semibold">Supported Projects</h2>
          
          {projects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects supported yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Discover projects making a global impact through prayer
                </p>
                <Button asChild>
                  <Link to="/projects">Browse Projects</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project: any) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {project.region}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Goal: ${project.goal?.toLocaleString()}</span>
                        <span>Raised: ${project.raised?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <h2 className="text-xl font-semibold">Impact Reports</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Impact Summary</CardTitle>
                <CardDescription>Your contribution to the worldwide prayer movement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Prayer Warriors Equipped</span>
                    <span className="font-bold">{impact.watchmenSupported}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Regions Reached</span>
                    <span className="font-bold">{impact.regionsImpacted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Prayer Hours</span>
                    <span className="font-bold">{impact.prayerHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Investment</span>
                    <span className="font-bold">${getTotalDonations().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Giving</CardTitle>
                <CardDescription>Your giving pattern over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Detailed analytics coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}