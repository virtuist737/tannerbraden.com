import { motion } from "framer-motion";
import { Helmet } from 'react-helmet-async';
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

const About = () => {
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
            I discovered that I am neurodivergent (Level 1 ASD to be specific). Realized that many of my greatest strengths, as well as weaknesses can be explained very well in the context of neurodivergence. Discovered many helpful strategies, like noise reduction and taking more time to be alone. Focusing on how to optimize my life according to my unique set of strengths and weaknesses.
          </p>
        </motion.div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">My Journey</h2>
        <div className="grid gap-6">
          {[
            {
              title: "Parenthood",
              content: `I slowly pieced myself back together into a new man. As I write this, Ryker is around 2.5 years old, and I can proudly say I'm in a much better place now.

              They say growth happens beyond your comfort zone, and let me tell you, parenthood has been my crash course in personal development. Here are a couple of lessons I've picked up along the way:

              Lesson 1: The Good Father Conundrum
              Initially, I had no clue what it meant to be a great dad, so I played sponge to everyone else's definitions. The problem? Trying and failing to meet these expectations left me feeling like the worst dad on the planet.

              Lesson 2: Energy & Fulfillment
              I discovered a helpful framework for evaluating how I spent my time.

              Lesson 3: Quality Trumps Quantity
              For the longest time, I believed I had to be the ever-present superhero, swooping in to help with everything to prove my love and support.`
            },
            {
              title: "My Life Today",
              content: "Still finding a balance between family, career and personal dreams."
            },
            {
              title: "Worldview",
              content: `- Gratitude for how fortunate I am
              - True wonder at the beauty of the universe and life
              - Strong focus on virtues
              - Strong drive to reduce human suffering`
            }
          ].map((story, index) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{story.content}</p>
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
          {[
            {
              title: "Life Purpose",
              content: `My driving philosophy is to increase the quality of human consciousness.
              There is immense pain and suffering in this world. I believe that no one deserves it, and the vast majority of it is fundamentally avoidable.

              I believe I am one of the most fortunate people to have ever lived, and that I have the potential to make a significant contribution to the well-being of humanity. My life is incredible and precious. I don't want to squander it on things that aren't of true value and meaning to me.`
            },
            {
              title: "Personal Growth",
              content: "I focus on continuous learning and self-improvement, believing that personal growth is a lifelong journey."
            }
          ].map((item) => (
            <AccordionItem key={item.title} value={item.title}>
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
          {[
            {
              company: "Tech Solutions Inc.",
              role: "Senior Software Engineer",
              period: "2020 - Present",
              responsibilities: [
                "Led development of core platform features",
                "Mentored junior developers",
                "Implemented CI/CD pipelines"
              ],
              achievements: [
                "Reduced system response time by 40%",
                "Launched 3 major features"
              ]
            }
          ].map((role, index) => (
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
                  {role.responsibilities && (
                    <div>
                      <h4 className="font-semibold mb-2">Key Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {role.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-muted-foreground">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {role.achievements && (
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
          {[
            { name: "Programming", category: "Technology" },
            { name: "Reading", category: "Personal Development" },
            { name: "Hiking", category: "Outdoor Activities" }
          ].map((hobby, index) => (
            <motion.div
              key={hobby.name}
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