import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 2,
  1024: 2,
  768: 1,
};

const Projects = () => {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    select: (data) => data.filter((project) => project.featured)
  });

  if (isLoading) {
    return (
      <section className="container px-4 py-12 md:py-24">
        <div className="text-center">Loading projects...</div>
      </section>
    );
  }

  return (
    <section className="container px-4 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 md:space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter lg:text-4xl">
            Featured Projects
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Here are some of my recent projects that showcase my skills and expertise.
          </p>
        </div>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {projects?.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative w-full">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-4 md:p-6 space-y-4">
                  <CardTitle className="text-xl md:text-2xl">{project.title}</CardTitle>
                  <p className="text-sm md:text-base text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs md:text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none"
                      >
                        <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
                          <Github className="h-4 w-4" />
                          Code
                        </Button>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none"
                      >
                        <Button size="sm" className="w-full sm:w-auto gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Demo
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Masonry>
      </motion.div>
    </section>
  );
};

export default Projects;