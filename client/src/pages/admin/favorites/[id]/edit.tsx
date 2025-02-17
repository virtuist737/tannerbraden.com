import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { FavoriteForm } from "@/components/favorites/FavoriteForm";
import { type Favorite, type InsertFavorite } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function EditFavorite() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: favorite } = useQuery<Favorite>({
    queryKey: ["/api/about/favorites", parseInt(id)],
  });

  const mutation = useMutation({
    mutationFn: (data: InsertFavorite) =>
      apiRequest(`/api/about/favorites/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about/favorites"] });
      toast({
        title: "Success",
        description: "Favorite updated successfully.",
      });
      setLocation("/admin/favorites");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorite. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!favorite) return null;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Favorite</h1>
      <div className="max-w-2xl">
        <FavoriteForm
          defaultValues={favorite}
          onSubmit={(data) => mutation.mutate(data)}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
