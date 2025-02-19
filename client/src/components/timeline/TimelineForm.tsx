import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { insertTimelineSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Timeline } from "@shared/schema";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { ImagePlus, Link2, Bold, Italic, Heading2, List, ListOrdered, Quote } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const timelineFormSchema = insertTimelineSchema.extend({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  date: z.string().min(1, "Date is required"),
  icon: z.string().min(1, "Icon is required"),
  category: z.string().min(1, "Category is required"),
});

interface TimelineFormProps {
  initialData?: Timeline;
  onSubmit: (data: z.infer<typeof timelineFormSchema>) => Promise<void>;
  isSubmitting?: boolean;
}

const CATEGORIES = ["Education", "Work", "Achievement", "Project", "Life"];
const ICONS = [
  { value: "👶", label: "Baby" },
  { value: "🎵", label: "Music" },
  { value: "✈️", label: "Travel" },
  { value: "🎓", label: "Education" },
  { value: "💼", label: "Work" },
  { value: "🏆", label: "Achievement" },
  { value: "💻", label: "Code" },
  { value: "🧠", label: "Learning" },
];

const TimelineForm = ({ initialData, onSubmit, isSubmitting }: TimelineFormProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof timelineFormSchema>>({
    resolver: zodResolver(timelineFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      date: initialData?.date ?? "",
      icon: initialData?.icon ?? "👶",
      category: initialData?.category ?? "",
      imageUrl: initialData?.imageUrl ?? undefined,
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
    ],
    content: initialData?.content || "",
    onUpdate: ({ editor }) => {
      form.setValue("content", editor.getHTML(), {
        shouldValidate: true,
      });
    },
  });

  const addImage = async (url: string) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt: "Timeline content image",
        })
        .insertContent("<p></p>")
        .run();
    }
  };

  const addLink = () => {
    if (editor) {
      const url = window.prompt("URL");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please drop an image file",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `/api/upload/timeline-content/${initialData?.id || "temp"}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error("No image URL returned from server");
      }

      if (editor) {
        editor
          .chain()
          .focus()
          .setImage({
            src: data.imageUrl,
            alt: "Timeline content image",
          })
          .insertContent("<p></p>")
          .run();
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    }
  }, [editor, initialData?.id, toast]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ICONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label} {icon.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Tabs defaultValue="write">
                  <TabsList className="mb-4">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="write" className="space-y-4">
                    {editor && (
                      <>
                        <div className="border rounded-md p-2 flex gap-2 mb-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    editor.chain().focus().toggleBold().run()
                                  }
                                  className={editor.isActive("bold") ? "bg-accent" : ""}
                                >
                                  <Bold className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Bold</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    editor.chain().focus().toggleItalic().run()
                                  }
                                  className={editor.isActive("italic") ? "bg-accent" : ""}
                                >
                                  <Italic className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Italic</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    editor
                                      .chain()
                                      .focus()
                                      .toggleHeading({ level: 2 })
                                      .run()
                                  }
                                  className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
                                >
                                  <Heading2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Heading</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    editor.chain().focus().toggleBulletList().run()
                                  }
                                  className={editor.isActive("bulletList") ? "bg-accent" : ""}
                                >
                                  <List className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Bullet List</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    editor.chain().focus().toggleOrderedList().run()
                                  }
                                  className={editor.isActive("orderedList") ? "bg-accent" : ""}
                                >
                                  <ListOrdered className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Numbered List</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    editor.chain().focus().toggleBlockquote().run()
                                  }
                                  className={editor.isActive("blockquote") ? "bg-accent" : ""}
                                >
                                  <Quote className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Quote</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={addLink}
                                  className={editor.isActive("link") ? "bg-accent" : ""}
                                >
                                  <Link2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Add Link</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-block">
                                  <ImageUpload
                                    imageUrl={null}
                                    entityId={initialData?.id || "temp"}
                                    entityType="timeline-content"
                                    onSuccess={addImage}
                                    trigger={
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                      >
                                        <ImagePlus className="h-4 w-4" />
                                      </Button>
                                    }
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>Add Image</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div
                          className="prose prose-stone dark:prose-invert max-w-none min-h-[400px] border rounded-md p-4"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                        >
                          <EditorContent editor={editor} />
                        </div>
                      </>
                    )}
                    {form.formState.errors.content && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.content.message}
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="preview" className="space-y-4">
                    <div
                      className="prose prose-stone dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: form.getValues("content") }}
                    />
                  </TabsContent>
                </Tabs>
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
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <ImageUpload
                  imageUrl={field.value}
                  entityId={initialData?.id || "temp"}
                  entityType="timeline"
                  onSuccess={(url) => field.onChange(url)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Entry" : "Create Entry"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TimelineForm;