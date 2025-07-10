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
import type { Favorite } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { SortableItem } from "@/components/shared/SortableItem";

export default function AdminFavorites() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery<Favorite[]>({
    queryKey: ["/api/about/favorites"],
  });

  const reorderMutation = useMutation({
    mutationFn: async (updates: { id: number; sortOrder: number }[]) => {
      const response = await apiRequest(`/api/about/favorites/reorder`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update favorites order");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update sort order",
        variant: "destructive",
      });
      // Revert the optimistic update
      queryClient.invalidateQueries({ queryKey: ["/api/about/favorites"] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !favorites) return;

    const oldIndex = favorites.findIndex((item) => item.id === active.id);
    const newIndex = favorites.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(favorites, oldIndex, newIndex);

    // Update the cache immediately for a smoother experience
    queryClient.setQueryData(["/api/about/favorites"], newItems);

    // Prepare updates for all items with their new sort orders
    const updates = newItems.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));

    // Send batch update
    reorderMutation.mutate(updates);
  };

  const deleteMutation = useMutation({
    mutationFn: async (favoriteId: number) => {
      const response = await apiRequest(`/api/about/favorites/${favoriteId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete favorite");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about/favorites"] });
      toast({
        title: "Success",
        description: "Favorite deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete favorite",
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
          <h1 className="text-3xl font-bold tracking-tight">Favorites Management</h1>
          <Button asChild>
            <Link href="/admin/favorites/new">
              <Plus className="h-4 w-4 mr-2" />
              New Favorite
            </Link>
          </Button>
        </div>

        <DndContext 
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            <SortableContext 
              items={favorites?.map(f => f.id) ?? []}
              strategy={verticalListSortingStrategy}
            >
              {favorites?.map((favorite) => (
                <SortableItem key={favorite.id} id={favorite.id}>
                  <Card className="w-full transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span className="truncate">{favorite.title}</span>
                        <div className="flex gap-2 shrink-0">
                          {favorite.link && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={favorite.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/favorites/${favorite.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Favorite</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{favorite.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(favorite.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{favorite.category}</Badge>
                        {favorite.image && (
                          <Badge variant="outline">Has Image</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {favorite.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {favorite.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">Sort Order: {favorite.sortOrder}</p>
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
