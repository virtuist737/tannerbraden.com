import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { insertProjectSchema, type InsertProject, type Venture } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash2 } from "lucide-react";

export default function NewProject() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Fetch ventures for dropdown
  const { data: ventures } = useQuery<Venture[]>({
    queryKey: ["/api/ventures"],
  });

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      technologies: [],
      buttons: [],
      sortOrder: 0,
      featured: false,
      ventureId: null,
    },
  });

  const { fields: buttonFields, append: appendButton, remove: removeButton } = useFieldArray({
    control: form.control,
    name: "buttons",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const formattedData = {
        ...data,
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        sortOrder: Number(data.sortOrder) || 0,
        featured: Boolean(data.featured)
      };
      console.log("Submitting data:", JSON.stringify(formattedData, null, 2));
      try {
        const response = await apiRequest("/api/projects", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData),
        });
        const responseData = await response.json();

        if (!response.ok) {
          console.error("Server response:", {
            status: response.status,
            statusText: response.statusText,
            data: responseData
          });
          throw new Error(responseData.error || "Failed to create project");
        }
        return responseData;
      } catch (error) {
        console.error("Project creation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setLocation("/admin/projects");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    const formattedData = {
      ...data,
      technologies: typeof data.technologies === 'string'
        ? data.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
        : data.technologies || [],
      sortOrder: Number(data.sortOrder) || 0,
      featured: Boolean(data.featured),
    };
    console.log("Formatted data:", JSON.stringify(formattedData, null, 2));
    createMutation.mutate(formattedData);
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the URL of the project image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                          onChange={(e) =>
                            field.onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter technologies separated by commas (e.g., React, Node.js, PostgreSQL)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ventureId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venture</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
                        value={field.value?.toString() || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select venture (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {ventures?.map((venture) => (
                            <SelectItem key={venture.id} value={venture.id.toString()}>
                              {venture.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Associate this project with a venture
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="liveUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers will appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Project</FormLabel>
                        <FormDescription>
                          Featured projects will be highlighted on the homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Add Custom Buttons Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Custom Buttons</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendButton({ title: "", url: "", icon: "", variant: "default" })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Button
                    </Button>
                  </div>

                  {buttonFields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="pt-6">
                        <div className="grid gap-6">
                          <div className="flex items-center justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeButton(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <FormField
                            control={form.control}
                            name={`buttons.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Button Title</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`buttons.${index}.url`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Button URL</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`buttons.${index}.icon`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Icon (optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., Github, ExternalLink" />
                                </FormControl>
                                <FormDescription>
                                  Enter a Lucide icon name
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`buttons.${index}.variant`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Button Style</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select button style" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="destructive">Destructive</SelectItem>
                                    <SelectItem value="outline">Outline</SelectItem>
                                    <SelectItem value="secondary">Secondary</SelectItem>
                                    <SelectItem value="ghost">Ghost</SelectItem>
                                    <SelectItem value="link">Link</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/admin/projects")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    Create Project
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}