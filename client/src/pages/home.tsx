import { motion } from "framer-motion";
import { Info, ArrowRight, AtSign, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Ventures from "@/components/home/Ventures";
import Projects from "@/components/home/Projects";
import BlogCard from "@/components/blog/BlogCard";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@shared/schema";
import { EmbeddedIframeCard } from "@/components/ui/EmbeddedIframeCard";
import SEO from "@/components/shared/SEO";
import { generateSEOMetadata } from "@/lib/seo";


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
      <SEO data={generateSEOMetadata({
        title: "Tanner Braden - Innovative Digital Creator & Audio Designer",
        description: "Tanner Braden is a forward-thinking digital creator specializing in audio design, web development, and interactive experiences that elevate human consciousness and foster mindfulness in the digital age.",
        keywords: "digital creator, audio designer, web developer, consciousness technology, mindfulness innovation, interactive experiences, digital wellbeing, creative technology, music production",
        isHomepage: true,
      })} />

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
            
            <Link href="/about">
              <Button>
                About Me
                <Info className="h-4 w-4" />
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

      {/* Ventures Section */}
      <Ventures />

      {/* Featured Projects Section */}
      <Projects />

      {/* GRRIIDD Section */}
      <section className="container py-12">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold tracking-tighter">Just for fun</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Play around with this music looper I made.
          </p>
        </div>
        <div className="flex justify-center mb-8">
          <Link href="https://grriidd.replit.app">
            <Button variant="outline">
              Visit Web App
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <EmbeddedIframeCard embedUrl="https://grriidd.replit.app/embed.html" />
      </section>

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
              Explore my stream of consciousness.
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