import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertTimeline } from "@shared/schema";
import TimelineForm from "@/components/timeline/TimelineForm";

export default function NewTimelineEntry() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const createEntryMutation = useMutation({
    mutationFn: async (data: InsertTimeline) => {
      const res = await apiRequest("/api/about/timeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Timeline entry created successfully",
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

  const onSubmit = async (data: InsertTimeline) => {
    await createEntryMutation.mutate(data);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Timeline Entry</h1>
        <TimelineForm onSubmit={onSubmit} isSubmitting={createEntryMutation.isPending} />
      </div>
    </div>
  );
}
