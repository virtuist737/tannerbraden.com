import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { LoopMachinePreset } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ProtectedRoute } from "@/lib/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Edit, Plus, Music, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoopMachinePresets() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [presetToDelete, setPresetToDelete] = useState<number | null>(null);

  // Fetch all presets
  const { data: presets, isLoading, error } = useQuery({
    queryKey: ["/api/loop-machine-presets"],
    select: (data: LoopMachinePreset[]) => data
  });

  // Delete mutation
  const deletePresetMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/loop-machine-presets/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loop-machine-presets"] });
      toast({
        title: "Preset deleted",
        description: "The preset has been successfully deleted."
      });
      setPresetToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete preset: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Set default preset mutation
  const setDefaultPresetMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/loop-machine-presets/${id}/default`, {
        method: "POST"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loop-machine-presets"] });
      toast({
        title: "Default preset updated",
        description: "The default preset has been updated successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to set default preset: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Handler for deleting a preset
  const handleDelete = (id: number) => {
    setPresetToDelete(id);
  };

  // Handler for setting a preset as default
  const handleSetDefault = (id: number) => {
    setDefaultPresetMutation.mutate(id);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Loop Machine Presets</h1>
            <p className="text-muted-foreground mt-1">
              Manage presets for the Loop Machine
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/loop-machine/new">
              <Plus className="mr-2 h-4 w-4" /> New Preset
            </Link>
          </Button>
        </div>

        <Separator className="my-6" />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="opacity-70 animate-pulse">
                <CardHeader>
                  <CardTitle className="h-7 bg-muted rounded"></CardTitle>
                  <CardDescription className="h-5 bg-muted rounded mt-2 w-2/3"></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <p>Error loading presets: {(error as Error).message}</p>
          </div>
        ) : presets && presets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presets.map((preset) => (
              <Card key={preset.id} className={preset.isDefault ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Music className="h-5 w-5 mr-2" />
                      {preset.name}
                    </CardTitle>
                    {preset.isDefault && (
                      <span className="text-primary flex items-center text-sm font-medium">
                        <Star className="h-4 w-4 mr-1 fill-primary" /> Default
                      </span>
                    )}
                  </div>
                  <CardDescription>
                    BPM: {preset.bpm} • Bars: {preset.numBars}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {preset.description || "No description provided."}
                  </p>
                  <div className="mt-3 text-sm">
                    <div className="flex justify-between">
                      <span>Sound:</span>
                      <span className="font-medium">{preset.selectedSound}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scale:</span>
                      <span className="font-medium">{preset.selectedScale}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volume:</span>
                      <span className="font-medium">{preset.volume} dB</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/loop-machine/${preset.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <AlertDialog open={presetToDelete === preset.id} onOpenChange={(open) => !open && setPresetToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the "{preset.name}" preset. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground"
                            onClick={() => deletePresetMutation.mutate(preset.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  {!preset.isDefault && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSetDefault(preset.id)}
                      disabled={setDefaultPresetMutation.isPending}
                    >
                      <Star className="h-4 w-4 mr-1" /> Set as Default
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border rounded-md">
            <Music className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No presets found</h3>
            <p className="mt-2 text-muted-foreground">
              Create your first Loop Machine preset to get started.
            </p>
            <Button asChild className="mt-4">
              <Link href="/admin/loop-machine/new">
                <Plus className="mr-2 h-4 w-4" /> Create New Preset
              </Link>
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}