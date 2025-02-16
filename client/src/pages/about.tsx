import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Brain,
  Briefcase,
  Coffee,
  Heart,
  LibraryBig,
  Shapes,
  Trophy,
} from "lucide-react";
import { Helmet } from 'react-helmet-async';
import Timeline from "@/components/about/Timeline";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type {
  LifeStory,
  Philosophy,
  Experience,
  Hobby,
} from "@shared/schema";

const About = () => {
  const { data: lifeStory } = useQuery<LifeStory[]>({
    queryKey: ["/api/content/life-story"],
  });

  const { data: philosophy } = useQuery<Philosophy[]>({
    queryKey: ["/api/content/philosophy"],
  });

  const { data: experience } = useQuery<Experience[]>({
    queryKey: ["/api/content/experience"],
  });

  const { data: hobbies } = useQuery<Hobby[]>({
    queryKey: ["/api/content/hobbies"],
  });

  return (
    <div className="container py-12 space-y-16">
      <Helmet>
        <title>About Me - My Journey and Philosophy</title>
        <meta name="description" content="Learn about my journey, philosophy, and what drives me in my professional and personal life." />
      </Helmet>

      {/* Bio Section */}
      <section className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tighter mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground">
            {lifeStory?.[0]?.content || "Loading my story..."}
          </p>
        </motion.div>
      </section>

      {/* Journey Section with Timeline */}
      <section id="journey" className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">My Journey</h2>
        <div className="grid gap-6">
          {lifeStory?.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{story.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">My Philosophy</h2>
        <Accordion type="single" collapsible className="w-full">
          {philosophy?.map((item) => (
            <AccordionItem key={item.id} value={item.category}>
              <AccordionTrigger className="text-xl font-semibold">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose dark:prose-invert max-w-none">
                  {item.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="text-muted-foreground">{paragraph}</p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Professional Experience */}
      <section id="experience" className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">Professional Experience</h2>
        <div className="grid gap-6">
          {experience?.map((role, index) => (
            <motion.div
              key={`${role.company}-${role.role}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{role.company}</CardTitle>
                  <CardDescription>
                    {role.role} • {role.period}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {role.responsibilities && role.responsibilities.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {role.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-muted-foreground">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {role.achievements && role.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {role.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-muted-foreground">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interests Section */}
      <section id="interests" className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">
          Interests & Hobbies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hobbies?.map((hobby, index) => (
            <motion.div
              key={hobby.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{hobby.name}</CardTitle>
                  <CardDescription>{hobby.category}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;