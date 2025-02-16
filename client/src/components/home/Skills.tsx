import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Layout, Database, Terminal, Palette, Globe } from "lucide-react";

const skills = [
  {
    title: "Frontend Development",
    description: "Creating responsive and interactive user interfaces",
    icon: Layout,
    techs: "React, Vue, TypeScript, Tailwind CSS"
  },
  {
    title: "Backend Development",
    description: "Building scalable server-side applications",
    icon: Database,
    techs: "Node.js, Express, PostgreSQL, MongoDB"
  },
  {
    title: "UI/UX Design",
    description: "Designing intuitive and beautiful interfaces",
    icon: Palette,
    techs: "Figma, Adobe XD, Responsive Design"
  },
  {
    title: "Web Performance",
    description: "Optimizing for speed and efficiency",
    icon: Globe,
    techs: "Webpack, Performance Metrics, SEO"
  }
];

const Skills = () => {
  return (
    <section className="container py-24 bg-muted/50">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are the technologies and tools I work with to bring ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 space-y-4">
                    <Icon className="h-10 w-10 text-primary" />
                    <h3 className="font-semibold text-xl">{skill.title}</h3>
                    <p className="text-muted-foreground">{skill.description}</p>
                    <p className="text-sm font-medium">{skill.techs}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
