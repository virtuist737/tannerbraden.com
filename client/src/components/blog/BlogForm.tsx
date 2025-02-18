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
import { ImagePlus, Link2, Bold, Italic, Heading2, List, ListOrdered, Quote } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      coverImage: initialData?.coverImage || "",
      category: initialData?.category || "",
      slug: initialData?.slug || "",
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

  const onTitleChange = (title: string) => {
    form.setValue("title", title);
    if (!initialData) {
      const slug = slugify(title, { lower: true, strict: true });
      form.setValue("slug", slug);
    }
  };

  const addImage = async (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
      editor.chain().focus().insertContent('<p></p>').run();
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
                <div>
                  <ImageUpload
                    imageUrl={field.value || null}
                    entityId={initialData?.id || "temp"}
                    entityType="blog"
                    onSuccess={(url) => field.onChange(url)}
                  />
                </div>
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
              <>
                <div className="border rounded-md p-2 flex gap-2 mb-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => editor.chain().focus().toggleBold().run()}
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
                          onClick={() => editor.chain().focus().toggleItalic().run()}
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
                          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
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
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
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
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
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
                          onClick={() => editor.chain().focus().toggleBlockquote().run()}
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
                            entityType="blog-content"
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
                <div className="prose prose-stone dark:prose-invert max-w-none min-h-[400px] border rounded-md p-4">
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;