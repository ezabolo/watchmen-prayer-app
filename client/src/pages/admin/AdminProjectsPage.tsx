import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, MapPin, Clock, FolderPlus, Eye, Edit, Trash2 } from "lucide-react";
import ProjectFormDialog from "@/components/admin/ProjectFormDialog";
import { formatSafeDate } from "@/lib/utils";

interface Project {
  id: number;
  title: string;
  type: string;
  summary: string;
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
  participants?: Array<{
    id: number;
    user_id: number;
    role: string;
    status: string;
    user: {
      name: string;
      email: string;
    };
  }>;
}

export default function AdminProjectsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingParticipants, setViewingParticipants] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800 border-green-200';
      case 'Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
          <p className="text-gray-600 mt-2">
            Coordinate prayer watches, trainings, outreaches, and conferences
          </p>
        </div>
        
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FolderPlus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first project to coordinate prayer activities, training, or outreach efforts.
            </p>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Create First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge 
                    variant="outline" 
                    className={getTypeColor(project.type)}
                  >
                    {project.type}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={getStatusColor(project.status)}
                  >
                    {project.status}
                  </Badge>
                </div>
                
                <div>
                  <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {project.summary}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {formatSafeDate(project.start_date, "MMM d, yyyy")}
                      {project.ongoing ? " (Ongoing)" : project.end_date ? ` - ${formatSafeDate(project.end_date, "MMM d, yyyy")}` : ""}
                    </span>
                  </div>
                  
                  {project.rhythm && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{project.rhythm}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>
                      {project.participants?.length || 0} participants
                      {project.capacity_total > 0 && ` / ${project.capacity_total} max`}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-4 h-4 mr-2" />
                    <span>{project.visibility}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewingParticipants(project)}
                    className="flex-1"
                  >
                    <Users className="w-4 h-4 mr-1" />
                    Participants
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingProject(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Project Dialog */}
      <ProjectFormDialog
        open={createDialogOpen || !!editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditingProject(null);
          }
        }}
        editingProject={editingProject}
      />

      {/* View Participants Dialog */}
      <Dialog open={!!viewingParticipants} onOpenChange={(open) => {
        if (!open) setViewingParticipants(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Participants</DialogTitle>
            <DialogDescription>
              {viewingParticipants?.title} - {viewingParticipants?.participants?.length || 0} participants
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {!viewingParticipants?.participants?.length ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No participants have joined this project yet.</p>
              </div>
            ) : (
              viewingParticipants.participants.map((participant) => (
                <div 
                  key={participant.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{participant.user.name}</div>
                    <div className="text-sm text-gray-600">{participant.user.email}</div>
                    {participant.role && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {participant.role}
                      </Badge>
                    )}
                  </div>
                  
                  <Badge 
                    variant="outline"
                    className={participant.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              participant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}
                  >
                    {participant.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}