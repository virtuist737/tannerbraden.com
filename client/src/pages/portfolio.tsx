import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import type { Project, Button as ProjectButton } from "@shared/schema";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center w-full py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const DynamicIcon = ({ name }: { name: string }) => {
  const Icon = (Icons as any)[name];
  return Icon ? <Icon className="h-4 w-4" /> : null;
};

const ProjectButton = ({ button }: { button: ProjectButton }) => {
  return (
    <Button variant={button.variant} size="sm" asChild className="gap-2">
      <a href={button.url} target="_blank" rel="noopener noreferrer">
        {button.icon && <DynamicIcon name={button.icon} />}
        {button.title}
      </a>
    </Button>
  );
};

const Portfolio = () => {
  const { data: projects, isLoading } = useQuery<Project[]>({
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
          <h1 className="text-4xl font-bold tracking-tighter">Featured Work</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my projects and initiatives in partnership development, growth marketing, and technology for human flourishing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            projects?.map((project, index) => {
              const { ref, inView } = useInView({
                triggerOnce: true,
                threshold: 0.1,
              });

              return (
                <motion.div
                  ref={ref}
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="p-0">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.png';
                          }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
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
                        {project.buttons?.map((button, buttonIndex) => (
                          <ProjectButton key={buttonIndex} button={button} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Portfolio;