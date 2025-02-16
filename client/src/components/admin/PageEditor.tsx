import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPageSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import slugify from "slugify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Page, InsertPage } from "@shared/schema";

interface PageEditorProps {
  page?: Page;
  onClose: () => void;
}

export default function PageEditor({ page, onClose }: PageEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<InsertPage>({
    resolver: zodResolver(insertPageSchema),
    defaultValues: page ?? {
      title: "",
      slug: "",
      content: {},
      isPublished: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertPage) => {
      if (page) {
        return apiRequest(`/api/pages/${page.id}`, "PATCH", data);
      }
      return apiRequest("/api/pages", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({
        title: `Page ${page ? "updated" : "created"} successfully`,
        description: "The page has been saved to the database.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error saving page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertPage) => {
    setIsSaving(true);
    try {
      if (!data.slug) {
        data.slug = slugify(data.title, { lower: true });
      }
      await mutation.mutateAsync(data);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="generated-from-title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 space-x-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : page ? "Update Page" : "Create Page"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
