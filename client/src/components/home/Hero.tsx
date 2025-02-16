import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8"
      >
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          Crafting Digital <span className="text-primary">Experiences</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Full-stack developer specializing in building exceptional digital experiences.
          Let's turn your vision into reality.
        </p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          <Link href="/portfolio">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              View My Work
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
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