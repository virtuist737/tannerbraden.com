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
  const { data: preset, isLoading, error } = useQuery({
    queryKey: ["/api/loop-machine-presets", presetId],
    queryFn: async () => {
      const data = await apiRequest<LoopMachinePreset>(`/api/loop-machine-presets/${presetId}`);
      return data;
    },
    enabled: !!presetId && !isNaN(presetId)
  });

  // Update preset mutation
  const updatePresetMutation = useMutation({
    mutationFn: async (data: Partial<InsertLoopMachinePreset>) => {
      return await apiRequest<LoopMachinePreset>(`/api/loop-presets/${presetId}`, {
        method: 'PATCH',
        body: JSON.stringify({ data }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/loop-machine-presets'] });
      toast({
        title: "Success",
        description: "Loop machine preset updated successfully",
      });
      navigate("/admin/loop-machine");
    },
    onError: () => {
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

        {/* Kept the original error/loading handling for completeness */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse space-y-4 w-full max-w-4xl">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded w-1/4 ml-auto"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <p>Error loading preset: {(error as Error).message}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => navigate("/admin/loop-machine")}
            >
              Return to Presets
            </Button>
          </div>
        ) : preset ? (
          <div className="max-w-4xl mx-auto">
            <LoopMachinePresetForm
              initialData={preset}
              onSubmit={handleSubmit}
              isSubmitting={updatePresetMutation.isPending}
            />
          </div>
        ) : (
          <div className="text-center p-12 border rounded-md">
            <h3 className="mt-4 text-lg font-medium">Preset not found</h3>
            <p className="mt-2 text-muted-foreground">
              The preset you're looking for doesn't exist or has been deleted.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate("/admin/loop-machine")}
            >
              Return to Presets
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}