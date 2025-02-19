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
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
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
                <Card className="mb-6 h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
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

        <style jsx global>{`
          .my-masonry-grid {
            display: flex;
            width: auto;
            margin-left: -24px; /* gutter size offset */
          }
          .my-masonry-grid_column {
            padding-left: 24px; /* gutter size */
            background-clip: padding-box;
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default SolarisLabs;