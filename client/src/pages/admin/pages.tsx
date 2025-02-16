import { useState } from "react";
import { motion } from "framer-motion";
import { Layout, ChevronRight, Plus, PencilIcon, TrashIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Page } from "@shared/schema";
import PageEditor from "@/components/admin/PageEditor";

export default function AdminPages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);

  const { data: pages, isLoading } = useQuery<Page[]>({
    queryKey: ["/api/pages"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/pages/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({
        title: "Page deleted",
        description: "The page has been successfully deleted.",
      });
      setPageToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error deleting page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (page: Page) => {
    await deleteMutation.mutateAsync(page.id);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
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
          <h1 className="text-3xl font-bold tracking-tight">Page Builder</h1>
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
        </div>

        <div className="grid gap-4">
          {pages?.map((page) => (
            <Card
              key={page.id}
              className="hover:bg-accent/50 transition-colors"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    {page.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPage(page);
                        setIsEditing(true);
                      }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPageToDelete(page)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Path: /{page.slug}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {isEditing && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="container flex items-center justify-center min-h-screen">
              <div className="w-full max-w-2xl">
                <PageEditor
                  page={selectedPage ?? undefined}
                  onClose={() => {
                    setIsEditing(false);
                    setSelectedPage(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <AlertDialog open={!!pageToDelete} onOpenChange={() => setPageToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the page
                and its content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => pageToDelete && handleDelete(pageToDelete)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}