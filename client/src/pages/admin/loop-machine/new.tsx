import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { InsertLoopMachinePreset, LoopMachinePreset } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ProtectedRoute } from "@/lib/protected-route";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoopMachinePresetForm from "@/components/loop-machine/LoopMachinePresetForm";

export default function NewLoopMachinePreset() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  // Create preset mutation
  const createPresetMutation = useMutation({
    mutationFn: async (data: InsertLoopMachinePreset) => {
      const response = await apiRequest<LoopMachinePreset>("/api/loop-machine-presets", {
        method: "POST",
        body: JSON.stringify(data)
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/loop-machine-presets"] });
      toast({
        title: "Preset created",
        description: "The preset has been successfully created."
      });
      navigate("/admin/loop-machine");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create preset: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (data: InsertLoopMachinePreset) => {
    createPresetMutation.mutate(data);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/admin/loop-machine")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Presets
          </Button>
          <h1 className="text-3xl font-bold">Create New Preset</h1>
          <p className="text-muted-foreground mt-1">
            Configure a new preset for the Loop Machine
          </p>
        </div>

        <Separator className="my-6" />

        <div className="max-w-4xl mx-auto">
          <LoopMachinePresetForm
            onSubmit={handleSubmit}
            isSubmitting={createPresetMutation.isPending}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}