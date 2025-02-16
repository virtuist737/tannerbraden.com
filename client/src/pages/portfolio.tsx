import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

        const projects = [
          {
            title: "Virtuist",
            description:
              "A web application designed to inspire, motivate and enable people to practice virtues. Built to help increase empathy, kindness, humility, rationality, and other virtues at scale.",
            image: "/api/placeholder/600/400",
            technologies: ["React", "Next.js", "TailwindCSS"],
            live: "https://virtuist.app",
          },
          {
            title: "PartnerStack Partner Program",
            description:
              "Built and grew PartnerStack's own partner-led GTM channel, including affiliate, referral, advocates, and influencer programs. Supported initiatives in product development, customer success and network growth.",
            image: "/api/placeholder/600/400",
            technologies: ["PartnerStack", "Marketing Automation", "Analytics"],
          },
          {
            title: "Lucid Partner Marketing Program",
            description:
              "Led partner marketing initiatives resulting in 398% increase in partner-referred traffic and 378% increase in partner-referred new users. Managed $250K of digital marketing spend while maintaining high efficiency metrics.",
            image: "/api/placeholder/600/400",
            technologies: ["Partner Marketing", "Digital Marketing", "Analytics"],
          },
          {
            title: "Yoyo Chinese Growth Initiative",
            description:
              "Managed comprehensive growth strategy including partnerships, SEO, CRO, product management, and content marketing. Launched and improved affiliate partner program while executing paid media campaigns.",
            image: "/api/placeholder/600/400",
            technologies: ["Growth Marketing", "SEO", "Content Marketing", "Partnerships"],
          }
        ];

        const Portfolio = () => {
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
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover"
                  />
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
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" />
                        Code
                      </a>
                    </Button>
                    <Button size="sm" asChild className="gap-2">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Portfolio;
