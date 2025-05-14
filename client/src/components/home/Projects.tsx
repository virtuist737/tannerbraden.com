import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 3,
  1536: 3, // 2xl
  1280: 3, // xl
  768: 2,  // md
  640: 1,  // sm
};

// Custom styles are now in project-cards.css
import "../../styles/project-cards.css";

// Define temporary mapping for company names until we have the proper DB relation
const companyNameById: Record<number, { name: string, color: string }> = {
  1: { name: "Solaris Labs", color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" },
  2: { name: "Lunaris Labs", color: "bg-purple-500/20 text-purple-700 dark:text-purple-400" }
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
          {projects?.map((project, index) => {
            // Get company info if available (temporary mock)
            // In reality, this would come from project.companyId in the database
            const mockCompanyId = index % 3 === 0 ? 1 : (index % 3 === 1 ? 2 : undefined);
            const companyInfo = mockCompanyId ? companyNameById[mockCompanyId] : undefined;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-4"
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <div className="w-full project-image-container">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="project-image"
                        loading="lazy"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-4 md:p-6 space-y-4">
                    {companyInfo && (
                      <Badge variant="outline" className={`${companyInfo.color} mb-2`}>
                        {companyInfo.name}
                      </Badge>
                    )}
                    <CardTitle className="text-xl md:text-2xl">{project.title}</CardTitle>
                    <p className="text-sm md:text-base text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs md:text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4">
                      {project.buttons?.map((button, index) => {
                        const Icon = button.icon ? (Icons as any)[button.icon] : null;
                        return (
                          <a
                            key={index}
                            href={button.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none"
                          >
                            <Button
                              variant={button.variant as any}
                              size="sm"
                              className="w-full sm:w-auto gap-2"
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                              {button.title}
                            </Button>
                          </a>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Masonry>
      </motion.div>
    </section>
  );
};

export default Projects;