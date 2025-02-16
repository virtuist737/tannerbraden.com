import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container py-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Hi, I'm <span className="text-primary">Your Name</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            A passionate developer building beautiful and functional web
            experiences. I specialize in modern web technologies and creative
            solutions.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/portfolio">
              <Button className="gap-2">
                View My Work
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Get in Touch</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section className="container py-24 space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter text-center">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project cards would go here */}
        </div>
      </section>

      {/* Skills Section */}
      <section className="container py-24 space-y-8 bg-muted/50">
        <h2 className="text-3xl font-bold tracking-tighter text-center">
          Skills & Expertise
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Skill cards would go here */}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="container py-24 space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter text-center">
          Latest Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blog post cards would go here */}
        </div>
      </section>
    </div>
  );
};

export default Home;
