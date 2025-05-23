import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertBlogPost } from "@shared/schema";
import BlogForm from "@/components/blog/BlogForm";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function NewBlogPost() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const createPostMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      try {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include" // Important for sending cookies with the request
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to create blog post");
        }
        
        return await res.json();
      } catch (error) {
        console.error("Blog post creation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      navigate("/admin/blog");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertBlogPost) => {
    await createPostMutation.mutate(data);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button variant="ghost" asChild>
          <Link href="/admin/blog" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Blog Posts
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <BlogForm onSubmit={onSubmit} isSubmitting={createPostMutation.isPending} />
      </div>
    </div>
  );
}