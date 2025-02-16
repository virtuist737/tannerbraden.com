import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Interest, InsertInterest } from "@shared/schema";
import InterestForm from "@/components/interests/InterestForm";

export default function EditInterest() {
  const { id } = useParams();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: interest, isLoading } = useQuery<Interest>({
    queryKey: [`/api/about/interests/${id}`],
    enabled: !!id,
  });

  const updateInterestMutation = useMutation({
    mutationFn: async (data: InsertInterest) => {
      const res = await apiRequest(`/api/about/interests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about/interests"] });
      queryClient.invalidateQueries({ queryKey: [`/api/about/interests/${id}`] });
      toast({
        title: "Success",
        description: "Interest updated successfully",
      });
      navigate("/admin/interests");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertInterest) => {
    await updateInterestMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interest) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Interest not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Interest</h1>
        <InterestForm
          initialData={interest}
          onSubmit={onSubmit}
          isSubmitting={updateInterestMutation.isPending}
        />
      </div>
    </div>
  );
}
