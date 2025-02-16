import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertInterest } from "@shared/schema";
import InterestForm from "@/components/interests/InterestForm";

export default function NewInterest() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const createInterestMutation = useMutation({
    mutationFn: async (data: InsertInterest) => {
      const res = await apiRequest("/api/about/interests", {
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
        description: "Interest created successfully",
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
    await createInterestMutation.mutate(data);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Interest</h1>
        <InterestForm onSubmit={onSubmit} isSubmitting={createInterestMutation.isPending} />
      </div>
    </div>
  );
}
