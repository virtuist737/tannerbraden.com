import { motion } from "framer-motion";
import BlogCard, { type BlogPost } from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/shared/SEO";
import { generateSEOMetadata } from "@/lib/seo";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  // Get unique categories from posts
  const getUniqueCategories = () => {
    if (!posts || posts.length === 0) return ["All"];
    const categorySet = new Set<string>();
    posts.forEach(post => {
      if (post.category) categorySet.add(post.category);
    });
    return ["All", ...Array.from(categorySet)];
  };
  
  const categories = getUniqueCategories();

  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-video bg-muted rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO data={generateSEOMetadata({
        title: "Blog",
        description: "Explore insights and perspectives from Tanner Braden, a digital creator focused on consciousness development, innovative technology for wellbeing, and transformative personal growth strategies.",
        keywords: "digital creator blog, consciousness exploration, mindfulness technology, creative innovation, personal transformation, audio production, web development, digital content creation",
        image: posts?.[0]?.coverImage,
      })} />
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
            Stream of consciousness.
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
    </>
  );
};

export default Blog;