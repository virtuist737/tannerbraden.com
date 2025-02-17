import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import Projects from "@/components/home/Projects";
import Skills from "@/components/home/Skills";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Tanner Braden</title>
        <meta 
          name="description" 
          content="Partnerships and growth specialist focused on improving human consciousness through scalable solutions. Experienced in partner marketing, program development, and driving meaningful impact." 
        />
        <meta 
          name="keywords" 
          content="partner marketing, growth specialist, partnerships lead, human consciousness, digital marketing, program development, partner programs" 
        />
        <meta property="og:title" content="Tanner Braden" />
        <meta 
          property="og:description" 
          content="Partnerships and growth specialist focused on improving human consciousness through scalable solutions. Experienced in partner marketing, program development, and driving meaningful impact." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content="Tanner Braden" />
        <meta 
          name="twitter:description" 
          content="Partnerships and growth specialist focused on improving human consciousness through scalable solutions. Experienced in partner marketing, program development, and driving meaningful impact." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="container py-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Hi, I'm <span className="text-primary">Tanner</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            I help companies grow through partnerships while working to increase empathy, kindness, and human flourishing at scale.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/portfolio">
              <Button className="gap-2">
                My Mission
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Let's Connect</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <Projects />

      {/* Skills Section */}
      <Skills />

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