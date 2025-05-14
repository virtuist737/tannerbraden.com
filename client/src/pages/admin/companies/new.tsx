import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { PageTitle } from "@/components/ui/page-title";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { insertCompanySchema } from "@shared/schema";
import AdminLayout from "@/components/layout/AdminLayout";
import { useCallback } from "react";

// Extend the insert schema to add validation rules
const formSchema = insertCompanySchema.extend({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  logoUrl: z.string().url("Must be a valid URL").min(1, "Logo URL is required"),
  websiteUrl: z.string().url("Must be a valid URL").optional(),
  color: z.string().default("bg-gray-500/20 text-gray-700 dark:text-gray-400"),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewCompany() {
  const [location, navigate] = useLocation();

  // Create the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      websiteUrl: "",
      color: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
      sortOrder: 0,
    },
  });

  // Create mutation
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Company added",
        description: "The company has been successfully added",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      navigate("/admin/companies");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit handler
  const onSubmit = useCallback((data: FormValues) => {
    mutation.mutate(data);
  }, [mutation]);

  return (
    <AdminLayout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="p-0 h-8 w-8"
              onClick={() => navigate("/admin/companies")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <PageTitle>Add New Company</PageTitle>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 max-w-2xl"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
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
                      <Input placeholder="Company Description" {...field} />
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
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
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
                      <Input placeholder="https://example.com" {...field} />
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
                    <FormLabel>Badge Color Class</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="bg-gray-500/20 text-gray-700 dark:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tailwind CSS classes for the badge background and text color
                    </FormDescription>
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
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers will appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="mr-2"
              >
                {mutation.isPending ? "Creating..." : "Create Company"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/companies")}
              >
                Cancel
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </AdminLayout>
  );
}