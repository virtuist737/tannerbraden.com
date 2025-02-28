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
    mutationFn: async (data: InsertLoopMachinePreset) => {
      const response = await apiRequest<LoopMachinePreset>(`/api/loop-machine-presets/${presetId}`, {
        method: "PATCH",
        body: JSON.stringify(data)
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/loop-machine-presets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/loop-machine-presets", presetId] });
      toast({
        title: "Preset updated",
        description: "The preset has been successfully updated."
      });
      navigate("/admin/loop-machine");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update preset: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (data: InsertLoopMachinePreset) => {
    updatePresetMutation.mutate(data);
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
          <h1 className="text-3xl font-bold">Edit Preset</h1>
          <p className="text-muted-foreground mt-1">
            Update the configuration for this Loop Machine preset
          </p>
        </div>

        <Separator className="my-6" />

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