import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Masonry from 'react-masonry-css';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@shared/schema";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center w-full py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

// Import CSS for consistent project card styling
import "../styles/project-cards.css";

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
            Innovating at the intersection of technology and human flourishing.

  {/* Assuming this goes where the project cards are rendered */}
  {projects && (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-background"
    >
      {projects.map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <Card style={styles.projectCard}>
            {project.imageUrl && (
              <div className="w-full">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  style={styles.projectImage}
                  className="rounded-t-lg"
                />
              </div>
            )}
            <CardContent className="pt-6">
              {/* Rest of the card content */}

          </p>
        </div>

        <Masonry
          breakpointCols={{
            default: 3,
            1536: 2,
            1280: 2,
            768: 1,
            640: 1,
          }}
          className="flex -ml-6 w-auto"
          columnClassName="pl-6 bg-clip-padding"
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
                className="mb-6"
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="w-full project-image-container">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="project-image"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-6 md:p-8 space-y-6">
                    <h2 className="text-3xl font-semibold">{project.title}</h2>
                    <p className="text-muted-foreground text-lg">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {project.buttons?.map((button, index) => {
                        const Icon = button.icon ? (Icons as any)[button.icon] : null;
                        return (
                          <Button
                            key={index}
                            variant={button.variant as any}
                            size="sm"
                            asChild
                            className="gap-2"
                          >
                            <a
                              href={button.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                              {button.title}
                            </a>
                          </Button>
                        );
                      })}
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