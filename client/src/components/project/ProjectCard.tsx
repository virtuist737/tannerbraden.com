
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";
import type { Project } from "@shared/schema";
import "../../styles/project-cards.css";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="project-card">
      {project.imageUrl && (
        <div className="project-image-container">
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="project-image rounded-t-lg"
          />
        </div>
      )}
      <CardContent className="pt-6">
        <h2 className="text-3xl font-semibold">{project.title}</h2>
        <p className="text-muted-foreground text-lg">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.technologies?.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
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
  );
}

export default ProjectCard;
