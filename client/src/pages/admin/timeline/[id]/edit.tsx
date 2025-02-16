import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Timeline } from "@shared/schema";
import TimelineForm from "@/components/timeline/TimelineForm";

export default function EditTimelineEntry() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();

  const { data: timeline, isLoading } = useQuery<Timeline>({
    queryKey: ["/api/timeline", id],
    queryFn: async () => {
      const res = await apiRequest(`/api/timeline/${id}`);
      if (!res.ok) throw new Error("Failed to fetch timeline entry");
      return res.json();
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async (data: Partial<Timeline>) => {
      const res = await apiRequest(`/api/timeline/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update timeline entry");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Timeline entry updated successfully",
      });
      navigate("/admin/timeline");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-destructive">Timeline entry not found</h1>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: Timeline) => {
    await updateEntryMutation.mutate(data);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Timeline Entry</h1>
        <TimelineForm
          initialData={timeline}
          onSubmit={onSubmit}
          isSubmitting={updateEntryMutation.isPending}
        />
      </div>
    </div>
  );
}
