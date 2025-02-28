import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { InsertLoopMachinePreset, LoopMachinePreset } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ProtectedRoute } from "@/lib/protected-route";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LoopMachinePresetForm from "@/components/loop-machine/LoopMachinePresetForm";
import { Star } from "lucide-react";

export default function EditLoopMachinePreset() {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const presetId = parseInt(id);

  // Fetch preset data
  const { data: preset, isLoading, error } = useQuery<LoopMachinePreset>({
    queryKey: ["/api/loop-presets", presetId],
    enabled: !!presetId && !isNaN(presetId)
  });

  // Update preset mutation
  const updatePresetMutation = useMutation({
    mutationFn: async (data: Partial<InsertLoopMachinePreset>) => {
      return await apiRequest<LoopMachinePreset>(`/api/loop-presets/${presetId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/loop-presets'] });
      toast({
        title: "Success",
        description: "Loop machine preset updated successfully",
      });
      navigate("/admin/loop-machine");
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update loop machine preset",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertLoopMachinePreset) => {
    updatePresetMutation.mutate(data);
  };

  // Set default preset mutation
  const setDefaultMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest<LoopMachinePreset>(`/api/loop-presets/${presetId}/set-default`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: "Default preset set",
        description: "This preset is now the default.",
      });
      queryClient.invalidateQueries(["/api/loop-presets"]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to set default preset. Please try again.",
        variant: "destructive",
      });
      console.error("Error setting default preset:", error);
    }
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading preset data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !preset) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-8">
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-red-500 mb-4">Error loading preset data</p>
            <Button onClick={() => navigate("/admin/loop-machine")}>
              Back to Presets
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
          <h1 className="text-3xl font-bold">Edit Preset</h1>
          <p className="text-muted-foreground mt-1">
            Update the configuration for this Loop Machine preset
          </p>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-between mb-6">
          <div></div>
          <div className="flex gap-2">
            <Button
              variant={preset.isDefault ? "secondary" : "outline"}
              onClick={() => setDefaultMutation.mutate()}
              disabled={preset.isDefault || setDefaultMutation.isPending}
            >
              <Star className="mr-2 h-4 w-4" />
              {preset.isDefault ? "Default Preset" : "Set as Default"}
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <LoopMachinePresetForm
            initialValues={preset}
            onSubmit={handleSubmit}
            isSubmitting={updatePresetMutation.isPending}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}