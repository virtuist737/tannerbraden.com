import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { ProjectCard } from "@/components/project/ProjectCard";
import SEO from "@/components/shared/SEO";
import { generateSEOMetadata } from "@/lib/seo";
import { Loader2 } from "lucide-react";

const Projects = () => {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <>
      <SEO data={generateSEOMetadata({
        title: "Projects",
        description: "Discover Tanner Braden's innovative digital creations, audio design projects, and interactive web applications focused on enhancing human consciousness and fostering mindfulness in the digital age.",
        keywords: "digital creator portfolio, audio design projects, web applications, interactive experiences, consciousness technology, creative development, music production tools, mindfulness innovations",
        image: "https://res.cloudinary.com/dvk20sglr/image/upload/v1739851169/tanner2.0_dark-500x500_f0dznv.png",
      })} />
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter">Projects</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore my digital creations designed to enhance consciousness and well-being.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects?.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          )}

          {projects?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found.</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Projects;