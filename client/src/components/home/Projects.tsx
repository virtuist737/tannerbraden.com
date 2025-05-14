import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Project, Venture } from "@shared/schema";

// Custom styles are now in project-cards.css
import "../../styles/project-cards.css";


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
            Here are some of my recent projects within either Solaris Labs or Lunaris Labs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projects?.map((project, index) => {
            // We don't need to get venture name for now
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-6 flex flex-col items-center text-center">
                    <div className="w-32 h-32 mb-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="max-w-full max-h-full"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-6 space-y-4">
                    <p className="text-muted-foreground mb-6">{project.description}</p>
                    
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {project.buttons && project.buttons.length > 0 && (
                      <div className="flex flex-wrap gap-3 pt-4 justify-center">
                        {project.buttons.map((button, idx) => {
                          const Icon = button.icon ? (Icons as any)[button.icon] : null;
                          return (
                            <a
                              key={idx}
                              href={button.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                variant={button.variant as any}
                                size="sm"
                                className="gap-2"
                              >
                                {Icon && <Icon className="h-4 w-4" />}
                                {button.title}
                              </Button>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;