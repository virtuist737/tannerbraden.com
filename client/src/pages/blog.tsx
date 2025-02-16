import { motion } from "framer-motion";
import BlogCard, { type BlogPost } from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    excerpt: "Learn how to set up a new React project with TypeScript and best practices for type safety.",
    date: "March 15, 2024",
    readingTime: "5 min read",
    category: "React",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    slug: "getting-started-react-typescript"
  },
  {
    id: "2",
    title: "Building Responsive Layouts with Tailwind CSS",
    excerpt: "Explore the power of Tailwind CSS for creating beautiful, responsive web designs.",
    date: "March 10, 2024",
    readingTime: "7 min read",
    category: "CSS",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60",
    slug: "responsive-layouts-tailwind"
  },
  {
    id: "3",
    title: "Modern State Management in React Applications",
    excerpt: "Compare different state management solutions and learn when to use each one.",
    date: "March 5, 2024",
    readingTime: "8 min read",
    category: "React",
    image: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&auto=format&fit=crop&q=60",
    slug: "modern-state-management"
  }
];

const categories = ["All", "React", "TypeScript", "CSS", "JavaScript", "Web Development"];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials and insights about web development and design.
          </p>
        </div>

        <div className="space-y-6">
          <Input
            type="search"
            placeholder="Search articles..."
            className="max-w-md mx-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found matching your criteria.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Blog;
