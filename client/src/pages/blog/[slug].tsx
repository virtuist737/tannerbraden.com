import { useParams } from "wouter";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/components/blog/BlogCard";

// This would typically come from an API or CMS
const getBlogPost = (slug: string): BlogPost | undefined => {
  const posts = [
    {
      id: "1",
      title: "Getting Started with React and TypeScript",
      excerpt: "Learn how to set up a new React project with TypeScript and best practices for type safety.",
      content: `
        # Getting Started with React and TypeScript

        TypeScript has become an essential tool in modern web development, especially when working with React. 
        In this guide, we'll explore how to set up a new React project with TypeScript and learn some best practices 
        for maintaining type safety throughout your application.

        ## Why TypeScript?

        TypeScript adds static typing to JavaScript, which helps catch errors early in development and improves 
        the development experience with better tooling and autocompletion.

        ## Setting Up Your Project

        First, let's create a new React project with TypeScript using Vite...
      `,
      date: "March 15, 2024",
      readingTime: "5 min read",
      category: "React",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
      slug: "getting-started-react-typescript",
    },
  ];

  return posts.find((post) => post.slug === slug);
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = getBlogPost(slug || "");

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

  return (
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
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}</span>
            </div>
          </div>
        </div>

        <div className="aspect-video relative mt-8 overflow-hidden rounded-lg">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="mt-8 prose prose-gray dark:prose-invert max-w-none">
          {post.content}
        </div>

        {/* Social Share */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex items-center gap-4">
            <span className="font-medium flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Share this article:
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareUrl
                    )}&text=${encodeURIComponent(post.title)}`,
                    "_blank"
                  )
                }
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}`,
                    "_blank"
                  )
                }
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                      shareUrl
                    )}&title=${encodeURIComponent(post.title)}`,
                    "_blank"
                  )
                }
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default BlogPost;
