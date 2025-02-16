import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Coffee,
  Code,
  Palette,
} from "lucide-react";

const About = () => {
  return (
    <div className="container py-12 space-y-16">
      {/* Bio Section */}
      <section className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tighter mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground">
            I'm a passionate web developer with a love for creating beautiful,
            functional, and user-friendly websites. With several years of
            experience in the industry, I've worked on a wide range of projects
            that have helped me develop a deep understanding of modern web
            technologies.
          </p>
        </motion.div>
      </section>

      {/* Journey Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">My Journey</h2>
        <div className="grid gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Senior Developer</h3>
              <p className="text-muted-foreground">2020 - Present</p>
              <p className="mt-2">
                Leading development teams and architecting solutions for complex web
                applications.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Computer Science Degree</h3>
              <p className="text-muted-foreground">2016 - 2020</p>
              <p className="mt-2">
                Studied advanced programming concepts and software engineering
                principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">What I Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg space-y-4">
            <Code className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-semibold">Web Development</h3>
            <p className="text-muted-foreground">
              Building responsive and performant web applications using modern
              technologies.
            </p>
          </div>
          <div className="p-6 border rounded-lg space-y-4">
            <Palette className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-semibold">UI/UX Design</h3>
            <p className="text-muted-foreground">
              Creating intuitive and beautiful user interfaces with attention to
              detail.
            </p>
          </div>
          <div className="p-6 border rounded-lg space-y-4">
            <Heart className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-semibold">Passion Projects</h3>
            <p className="text-muted-foreground">
              Working on side projects that push the boundaries of web technology.
            </p>
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter">
          When I'm Not Coding
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <Coffee className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Coffee Enthusiast</h3>
              <p className="text-muted-foreground">
                Always exploring new coffee shops and brewing methods.
              </p>
            </div>
          </div>
          {/* Add more interests here */}
        </div>
      </section>
    </div>
  );
};

export default About;
