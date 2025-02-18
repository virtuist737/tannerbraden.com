
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Masonry from 'react-masonry-css';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center w-full py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const SolarisLabs = () => {
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <img 
            src="https://res.cloudinary.com/dvk20sglr/image/upload/v1739851958/solaris-labs-logo-500x500_nw8qfk.png" 
            alt="Solaris Labs Logo" 
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold tracking-tighter">Solaris Labs</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Innovating at the intersection of technology and human flourishing. Explore our projects and initiatives.
          </p>
        </div>

        <Masonry
          breakpointCols={{
            default: 5,
            1536: 4,
            1280: 3,
            768: 2,
            640: 2,
          }}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="relative w-full overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-4 md:p-6 space-y-4">
                    <h2 className="text-2xl font-semibold">{project.title}</h2>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.githubUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="gap-2"
                        >
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                            Code
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button size="sm" asChild className="gap-2">
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </Masonry>
      </motion.div>
    </div>
  );
};

export default SolarisLabs;
