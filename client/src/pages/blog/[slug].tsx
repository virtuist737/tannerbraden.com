import { useParams } from "wouter";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import ShareButtons from "@/components/blog/ShareButtons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import SEO from "@/components/shared/SEO";
import { generateBlogSEOMetadata } from "@/lib/seo";
import { SongPlaybackCard } from "@/components/blog/SongPlaybackCard";

const BlogPostPage = () => {
  const { toast } = useToast();
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog/slug/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto animate-pulse space-y-8">
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="aspect-video bg-muted rounded-lg" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const readingTime = `${Math.ceil((post.content?.length || 0) / 1000)} min read`;

  return (
    <>
      <SEO data={generateBlogSEOMetadata(post)} />
    <div className="container py-12">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="space-y-4">
          <Badge>{post.category}</Badge>
          <h1 className="text-4xl font-bold tracking-tighter">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>
                {post.publishedAt
                  ? format(new Date(post.publishedAt), "MMMM d, yyyy")
                  : "Not published"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime}</span>
            </div>
          </div>
          
          <ShareButtons title={post.title} className="mt-6" />
        </div>

        {post.coverImage && (
          <div className="aspect-video relative mt-8 overflow-hidden rounded-lg">
            <img
              src={post.coverImageLarge || post.coverImage}
              srcSet={[
                post.coverImageThumbnail && `${post.coverImageThumbnail} 150w`,
                post.coverImageMedium && `${post.coverImageMedium} 600w`,
                post.coverImageLarge && `${post.coverImageLarge} 1200w`
              ].filter(Boolean).join(', ')}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              alt={post.title}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        )}

        {post.content && (
          <div 
            className="mt-8 prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}

        {/* Song Playback Card */}
        {post.songTitle && post.songAudioUrl && (
          <div className="mt-8">
            <SongPlaybackCard
              songTitle={post.songTitle}
              songAudioUrl={post.songAudioUrl}
              songCoverImage={post.songCoverImage}
              className="w-full"
            />
          </div>
        )}

        {/* Social Share */}
        <div className="mt-8 pt-8 border-t">
          <ShareButtons title={post.title} />
        </div>
      </motion.article>
    </div>
    </>
  );
};

export default BlogPostPage;