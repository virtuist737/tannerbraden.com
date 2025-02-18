import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { insertFavoriteSchema, type InsertFavorite } from "@shared/schema";
import { ImageUpload } from "@/components/shared/ImageUpload";

interface Props {
  defaultValues?: Partial<InsertFavorite> & { id?: number };
  onSubmit: (data: InsertFavorite) => void;
  isSubmitting?: boolean;
}

const defaultFavorite: Partial<InsertFavorite> = {
  title: "",
  category: "",
  description: "",
  link: "",
  sortOrder: 0,
  image: "",
};

export function FavoriteForm({ defaultValues = defaultFavorite, onSubmit, isSubmitting }: Props) {
  const form = useForm<InsertFavorite>({
    resolver: zodResolver(insertFavoriteSchema),
    defaultValues: {
      ...defaultFavorite,
      ...defaultValues,
    },
  });

  const handleSubmit = (data: InsertFavorite) => {
    const formattedData = {
      ...data,
      sortOrder: Number(data.sortOrder),
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
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
                <Textarea {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input {...field} type="url" value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Sort Order</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val ? parseInt(val, 10) : 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload
                  imageUrl={field.value}
                  entityId={defaultValues?.id || 0}
                  entityType="favorite"
                  onSuccess={(url) => field.onChange(url)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : defaultValues?.id ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}