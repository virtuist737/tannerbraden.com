import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/AdminLayout";
import { insertVentureSchema, type InsertVenture } from "@shared/schema";

export default function NewVenture() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InsertVenture>({
    resolver: zodResolver(insertVentureSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      websiteUrl: "",
      color: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
      sortOrder: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertVenture) => {
      const formattedData = {
        ...data,
        sortOrder: Number(data.sortOrder),
      };
      
      const venture = await apiRequest("/api/ventures", {
        method: "POST",
        body: JSON.stringify(formattedData),
      });
      
      return venture;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Venture created successfully",
      });
      setLocation("/admin/ventures");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create venture",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertVenture) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>Add New Venture</PageTitle>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Venture Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venture Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Acme Ventures" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Brief description of the venture" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/logo.png" />
                    </FormControl>
                    <FormDescription>URL to the venture's logo image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Class</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="bg-gray-500/20 text-gray-700 dark:text-gray-400" />
                    </FormControl>
                    <FormDescription>Tailwind CSS classes for venture badge color</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>Lower numbers appear first</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/ventures")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Venture"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}