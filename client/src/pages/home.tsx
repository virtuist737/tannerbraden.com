import { motion } from "framer-motion";
import { ArrowRight, AtSign } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Projects from "@/components/home/Projects";
import BlogCard from "@/components/blog/BlogCard";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { GrriiddCard } from "@/components/ui/GrriiddCard";


const Home = () => {
  // Blog posts query
  const { data: latestPosts, isLoading: isLoadingPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    select: (posts) => posts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3)
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Tanner Braden - Digital Creator</title>
        <meta
          name="description"
          content="Creating apps and content designed to elevate human consciousness. Dedicated to building scalable solutions for mindfulness, awareness, and personal growth."
        />
        <meta
          name="keywords"
          content="consciousness technology, digital wellbeing, mindfulness apps, human potential, personal growth"
        />
        <meta property="og:title" content="Tanner Braden - Digital Creator" />
        <meta
          property="og:description"
          content="Creating apps and content designed to elevate human consciousness. Dedicated to building scalable solutions for mindfulness, awareness, and personal growth."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://res.cloudinary.com/dvk20sglr/image/upload/v1739851169/tanner2.0_dark-500x500_f0dznv.png" />
        <meta name="twitter:title" content="Tanner Braden - Digital Creator" />
        <meta
          name="twitter:description"
          content="Creating apps and content designed to elevate human consciousness. Dedicated to building scalable solutions for mindfulness, awareness, and personal growth."
        />
        <meta name="twitter:image" content="https://res.cloudinary.com/dvk20sglr/image/upload/v1739851169/tanner2.0_dark-500x500_f0dznv.png" />
      </Helmet>

      {/* Hero Section */}
      <section className="container py-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-8"
          >
            <Avatar className="h-32 w-32 mx-auto ring-2 ring-primary/10 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <AvatarImage src="/images/tanner2.0_dark-500x500.png" alt="Tanner Braden" />
              <AvatarFallback>TB</AvatarFallback>
            </Avatar>
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Hi, I'm <span className="text-primary">Tanner</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            I create apps and content to reduce human suffering and increase the quality of human consciousness.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/solarislabs">
              <Button className="gap-2">
                Solaris Labs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                Let's Connect
                <AtSign className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="container py-12">
        <GrriiddCard embedUrl="https://grriidd.replit.app/embed.html" />
      </section>

      {/* Featured Projects Section */}
      <Projects />

      {/* Latest Blog Posts */}
      <section className="container py-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">Latest Articles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore my latest thoughts and insights on technology and consciousness.
            </p>
          </div>

{isLoadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts?.map((post, index) => (
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
          )}

          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                View All Articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;