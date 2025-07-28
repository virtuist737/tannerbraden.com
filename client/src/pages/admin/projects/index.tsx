import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableItem } from "@/components/shared/SortableItem";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function AdminProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const reorderMutation = useMutation({
    mutationFn: async (updates: { id: number; sortOrder: number }[]) => {
      const response = await apiRequest(`/api/projects/reorder`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update projects order");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update sort order",
        variant: "destructive",
      });
      // Revert the optimistic update
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !projects) return;

    const oldIndex = projects.findIndex((item) => item.id === active.id);
    const newIndex = projects.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(projects, oldIndex, newIndex);

    // Update the cache immediately for a smoother experience
    queryClient.setQueryData(["/api/projects"], newItems);

    // Prepare updates for all items with their new sort orders
    const updates = newItems.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));

    // Send batch update
    reorderMutation.mutate(updates);
  };

  const deleteMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await apiRequest(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/3 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Projects Management</h1>
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>

        <DndContext 
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            <SortableContext 
              items={projects?.map(p => p.id) ?? []}
              strategy={verticalListSortingStrategy}
            >
              {projects?.map((project) => (
                <SortableItem key={project.id} id={project.id}>
                  <Card className="w-full transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span className="truncate">{project.title}</span>
                        <div className="flex gap-2 shrink-0">
                          {project.liveUrl && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/projects/${project.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{project.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(project.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        {project.technologies.join(", ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <p className="text-sm text-muted-foreground">Sort Order: {project.sortOrder}</p>
                    </CardContent>
                  </Card>
                </SortableItem>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </motion.div>
    </div>
  );
}
