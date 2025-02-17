import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertBlogPost } from "@shared/schema";
import BlogForm from "@/components/blog/BlogForm";
import { Link } from "wouter"; // Assuming wouter is used for Link
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react"; // Assuming ChevronLeft is from lucide-react


export default function NewBlogPost() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const createPostMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const res = await apiRequest("/api/blog", {
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
        description: "Blog post created successfully",
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
    await createPostMutation.mutate(data);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/admin/blog">
          <Button>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Blog Posts
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <BlogForm onSubmit={onSubmit} isSubmitting={createPostMutation.isPending} />
      </div>
    </div>
  );
}