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
    mutationFn: async (data: InsertFavorite) => {
      const response = await apiRequest("/api/about/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create favorite");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about/favorites"] });
      toast({
        title: "Success",
        description: "New favorite created successfully.",
      });
      setLocation("/admin/favorites");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
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