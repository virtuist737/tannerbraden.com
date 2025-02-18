import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import type { BlogPost as DBBlogPost } from "@shared/schema";

// Extended type to include UI-specific fields
export interface BlogPost extends DBBlogPost {
  readingTime?: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const readingTime = post.readingTime || `${Math.ceil(post.content.length / 1000)} min read`;

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="p-0">
          {post.coverImage && (
            <div className="aspect-video relative overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="object-cover w-full h-full transition-transform hover:scale-105"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Badge>{post.category}</Badge>
          <div className="space-y-2">
            <h3 className="font-semibold text-xl line-clamp-2">{post.title}</h3>
            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>{format(new Date(post.publishedAt), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;