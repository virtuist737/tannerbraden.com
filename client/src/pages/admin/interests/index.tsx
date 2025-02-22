import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, ExternalLink } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import type { Interest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableItem } from "@/components/shared/SortableItem";

export default function AdminInterests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interests, isLoading } = useQuery<Interest[]>({
    queryKey: ["/api/about/interests"],
  });

  const reorderMutation = useMutation({
    mutationFn: async (updates: { id: number; sortOrder: number }[]) => {
      const response = await apiRequest(`/api/about/interests/reorder`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update interests order");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update sort order",
        variant: "destructive",
      });
      // Revert the optimistic update
      queryClient.invalidateQueries({ queryKey: ["/api/about/interests"] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !interests) return;

    const oldIndex = interests.findIndex((item) => item.id === active.id);
    const newIndex = interests.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(interests, oldIndex, newIndex);

    // Update the cache immediately for a smoother experience
    queryClient.setQueryData(["/api/about/interests"], newItems);

    // Prepare updates for all items with their new sort orders
    const updates = newItems.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));

    // Send batch update
    reorderMutation.mutate(updates);
  };

  const deleteMutation = useMutation({
    mutationFn: async (interestId: number) => {
      const response = await apiRequest(`/api/about/interests/${interestId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete interest");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about/interests"] });
      toast({
        title: "Success",
        description: "Interest deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete interest",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-8">
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
    <div className="container max-w-3xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Interests Management</h1>
          <Button asChild>
            <Link href="/admin/interests/new">
              <Plus className="h-4 w-4 mr-2" />
              New Interest
            </Link>
          </Button>
        </div>

        <DndContext 
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            <SortableContext 
              items={interests?.map(i => i.id) ?? []}
              strategy={verticalListSortingStrategy}
            >
              {interests?.map((interest) => (
                <SortableItem key={interest.id} id={interest.id}>
                  <Card className="w-full transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span className="truncate">{interest.title}</span>
                        <div className="flex gap-2 shrink-0">
                          {interest.link && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={interest.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/interests/${interest.id}/edit`}>
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
                                <AlertDialogTitle>Delete Interest</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{interest.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(interest.id)}
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
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{interest.category}</Badge>
                          {interest.image && (
                            <Badge variant="outline">Has Image</Badge>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {interest.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {interest.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">Sort Order: {interest.sortOrder}</p>
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