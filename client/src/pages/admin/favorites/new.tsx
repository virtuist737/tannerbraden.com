import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { FavoriteForm } from "@/components/favorites/FavoriteForm";
import { type InsertFavorite } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function NewFavorite() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: InsertFavorite) =>
      apiRequest("/api/about/favorites", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about/favorites"] });
      toast({
        title: "Success",
        description: "New favorite created successfully.",
      });
      setLocation("/admin/favorites");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create favorite. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">New Favorite</h1>
      <div className="max-w-2xl">
        <FavoriteForm
          onSubmit={(data) => mutation.mutate(data)}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
