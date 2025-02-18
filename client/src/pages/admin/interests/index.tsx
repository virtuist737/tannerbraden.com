import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import type { Interest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function AdminInterests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interests, isLoading } = useQuery<Interest[]>({
    queryKey: ["/api/about/interests"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (interestId: number) => {
      await apiRequest(`/api/about/interests/${interestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about/interests"] });
      toast({
        title: "Success",
        description: "Interest deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete interest",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/3 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Interests Management</h1>
          <Button asChild>
            <Link href="/admin/interests/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Interest
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {interests?.sort((a, b) => a.sortOrder - b.sortOrder).map((interest) => (
            <Card key={interest.id} className="overflow-hidden transition-shadow hover:shadow-md">
              {interest.imageUrl && (
                <div className="w-full">
                  <img
                    src={interest.imageUrl}
                    alt={interest.item}
                    className="w-full h-auto"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{interest.item}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/interests/${interest.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Interest</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{interest.item}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(interest.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="secondary">{interest.category}</Badge>
                  <Badge>{interest.type}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Sort Order: {interest.sortOrder}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}