import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Eye, Trash2, Settings } from "lucide-react";
import StructuredTrainingDialog from "@/components/admin/StructuredTrainingDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Training } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminTrainingPage() {
  const [trainingFormOpen, setTrainingFormOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trainings = [] } = useQuery<Training[]>({
    queryKey: ['/api/trainings'],
  });

  const deleteTrainingMutation = useMutation({
    mutationFn: async (trainingId: number) => {
      return await apiRequest("DELETE", `/api/trainings/${trainingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trainings"] });
      toast({
        title: "Success",
        description: "Training deleted successfully",
      });
      setDeleteDialogOpen(false);
      setTrainingToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete training",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (training: any) => {
    setEditingTraining(training);
    setTrainingFormOpen(true);
  };

  const handleDelete = (training: any) => {
    setTrainingToDelete(training);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (trainingToDelete) {
      deleteTrainingMutation.mutate(trainingToDelete.id);
    }
  };

  const handleCreateNew = () => {
    setEditingTraining(null);
    setTrainingFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Content</h1>
          <p className="text-gray-600">Manage training materials and courses</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Training
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training: Training) => (
          <Card key={training.id} className="relative group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{training.title}</CardTitle>
                  <CardDescription>{training.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(training)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Training
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDelete(training)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Type:</strong> {training.type}</p>
                <p><strong>Created:</strong> {training.created_at ? new Date(training.created_at).toLocaleDateString() : 'Unknown'}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleEdit(training)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Training
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDelete(training)}
                  className="text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <StructuredTrainingDialog 
        open={trainingFormOpen} 
        onOpenChange={(open) => {
          setTrainingFormOpen(open);
          if (!open) {
            setEditingTraining(null);
          }
        }}
        training={editingTraining}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the training
              "{trainingToDelete?.title}" and all its associated content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Training
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}