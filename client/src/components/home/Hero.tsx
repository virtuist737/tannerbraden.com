import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="container py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center space-y-8"
      >
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Crafting Digital <span className="text-primary">Experiences</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Full-stack developer specializing in building exceptional digital experiences.
          Let's turn your vision into reality.
        </p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/portfolio">
            <Button size="lg" className="gap-2">
              View My Work
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Get in Touch
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-8"
        >
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
