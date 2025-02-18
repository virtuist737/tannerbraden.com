
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BlogPost, InsertBlogPost } from "@shared/schema";
import BlogForm from "@/components/blog/BlogForm";

export default function EditBlogPost() {
  const { id } = useParams();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${id}`],
    enabled: !!id,
  });

  const updatePostMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const res = await apiRequest(`/api/blog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: [`/api/blog/${id}`] });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      navigate("/admin/blog");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertBlogPost) => {
    await updatePostMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <BlogForm 
          initialData={post}
          onSubmit={onSubmit}
          isSubmitting={updatePostMutation.isPending}
        />
      </div>
    </div>
  );
}
