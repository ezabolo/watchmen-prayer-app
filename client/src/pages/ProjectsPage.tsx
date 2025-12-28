import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin, Clock, Eye } from "lucide-react";
import { Link } from "wouter";
import { formatSafeDate } from "@/lib/utils";

interface Project {
  id: number;
  title: string;
  type: string;
  summary: string;
  description?: string;
  visibility: string;
  start_date: string;
  end_date?: string;
  ongoing: boolean;
  rhythm: string;
  status: string;
  owner_id: number;
  capacity_total: number;
  capacity_per_slot: number;
  allow_public_signup: boolean;
  region?: string;
  goal?: number;
  raised?: number;
}

export default function ProjectsPage() {
  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Filter only published projects that are publicly visible
  const publicProjects = projects.filter(
    (project) => project.status === 'Published' && 
    (project.visibility === 'Public' || project.allow_public_signup)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800 border-green-200';
      case 'Active': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Prayer Watch': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Training': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Outreach': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Conference': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Media': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Projects</h1>
          <p className="text-gray-600 mb-6">We're having trouble loading the projects. Please try again later.</p>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Prayer Movement Projects
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join global prayer initiatives that are making a difference in communities worldwide. 
            Support or participate in projects that align with your heart for prayer and outreach.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {publicProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Public Projects Yet</h3>
              <p className="text-gray-500 mb-6">Check back soon for exciting prayer movement projects you can support.</p>
              <Button asChild>
                <Link to="/partner">Learn About Partnership</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Available Projects
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Discover how you can partner with us in these active prayer initiatives
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getTypeColor(project.type)}>
                          {project.type}
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {project.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {formatSafeDate(project.start_date, 'MMM dd, yyyy')}
                            {!project.ongoing && project.end_date && 
                              ` - ${formatSafeDate(project.end_date, 'MMM dd, yyyy')}`
                            }
                            {project.ongoing && ' - Ongoing'}
                          </span>
                        </div>
                        
                        {project.region && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{project.region}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{project.rhythm}</span>
                        </div>
                        
                        {project.capacity_total > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-2" />
                            <span>Capacity: {project.capacity_total} participants</span>
                          </div>
                        )}
                      </div>

                      {/* Funding Progress (if applicable) */}
                      {project.goal && project.goal > 0 && (
                        <div className="mb-6">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Funding Progress</span>
                            <span>${(project.raised || 0).toLocaleString()} / ${project.goal.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(((project.raised || 0) / project.goal) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1">
                          Support Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Partner with us to support global prayer movements and make a lasting impact
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
              <Link to="/partner">Become a Partner</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-gray-900">
              <Link to="/donate">Make a Donation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}