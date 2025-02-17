import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import slugify from "slugify";
import { insertBlogPostSchema } from "@shared/schema";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type BlogPost } from "@shared/schema";
import { ImageUpload } from "@/components/shared/ImageUpload";

const blogFormSchema = insertBlogPostSchema.extend({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  coverImage: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});

interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: z.infer<typeof blogFormSchema>) => Promise<void>;
  isSubmitting?: boolean;
}

const CATEGORIES = [
  "Web Development",
  "React",
  "TypeScript",
  "JavaScript",
  "CSS",
  "Programming",
  "Tech News",
];

const BlogForm = ({ initialData, onSubmit, isSubmitting }: BlogFormProps) => {
  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      excerpt: "",
      coverImage: "",
      category: "",
      slug: "",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: initialData?.content || "",
    onUpdate: ({ editor }) => {
      form.setValue("content", editor.getHTML(), {
        shouldValidate: true,
      });
    },
  });

  const onTitleChange = (title: string) => {
    form.setValue("title", title);
    if (!initialData) {
      const slug = slugify(title, { lower: true, strict: true });
      form.setValue("slug", slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => onTitleChange(e.target.value)}
                  />
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
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={!!initialData} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                {initialData?.id && (
                  <ImageUpload
                    imageUrl={field.value || null}
                    entityId={initialData.id}
                    entityType="blog"
                    onSuccess={(url) => field.onChange(url)}
                  />
                )}
                {!initialData?.id && (
                  <div className="text-sm text-muted-foreground">
                    Save the post first to enable image upload
                  </div>
                )}
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
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

        <Tabs defaultValue="write">
          <TabsList className="mb-4">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="space-y-4">
            {editor && (
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <EditorContent editor={editor} />
              </div>
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

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;