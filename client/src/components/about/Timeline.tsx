import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Award, ChevronDown } from "lucide-react";
import { useState } from "react";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  type: "work" | "education" | "achievement";
  details?: string;
}

const timelineData: TimelineEvent[] = [
  {
    title: "Senior Developer",
    date: "2023 - Present",
    description: "Leading development teams and architecting web solutions",
    details: "Spearheading innovative projects, mentoring team members, and implementing best practices in software development. Focus on scalable architecture and performance optimization.",
    type: "work",
  },
  {
    title: "Full Stack Developer",
    date: "2020 - 2023",
    description: "Building full-stack applications and mentoring junior developers",
    details: "Developed and maintained multiple production applications using React, Node.js, and PostgreSQL. Led technical discussions and code reviews.",
    type: "work",
  },
  {
    title: "Master's in Computer Science",
    date: "2018 - 2020",
    description: "Specialized in Software Engineering and Web Technologies",
    details: "Research focus on distributed systems and modern web architectures. Completed thesis on scalable microservices architecture.",
    type: "education",
  },
  {
    title: "Outstanding Achievement Award",
    date: "2019",
    description: "Recognized for exceptional contributions to open source",
    details: "Contributed to major open source projects and created developer tools used by thousands of developers worldwide.",
    type: "achievement",
  },
  {
    title: "Bachelor's in Computer Science",
    date: "2014 - 2018",
    description: "Foundation in programming and computer science principles",
    details: "Core coursework in algorithms, data structures, and software engineering. Participated in competitive programming competitions.",
    type: "education",
  },
];

const Timeline = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "work":
        return <Briefcase className="h-5 w-5" />;
      case "education":
        return <GraduationCap className="h-5 w-5" />;
      case "achievement":
        return <Award className="h-5 w-5" />;
    }
  };

  const cardVariants = {
    hidden: (isEven: boolean) => ({
      opacity: 0,
      x: isEven ? 50 : -50,
    }),
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: {
        height: {
          duration: 0.3,
          ease: "easeOut",
        },
        opacity: {
          duration: 0.2,
          delay: 0.1,
        },
      },
    },
  };

  return (
    <div className="relative container max-w-7xl mx-auto px-4 py-16">
      {/* Central timeline line with gradient */}
      <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary/5 via-primary to-primary/5" />

      <div className="relative">
        {timelineData.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={index} className="mb-16 flex justify-center items-center">
              <div className={`w-full grid grid-cols-[1fr,auto,1fr] gap-4 ${isEven ? '' : 'direction-rtl'}`}>
                {/* Content */}
                <motion.div
                  className={`col-span-1 ${isEven ? 'text-right pr-4' : 'col-start-3 text-left pl-4'}`}
                  variants={cardVariants}
                  custom={isEven}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <motion.div
                    className="bg-card border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-2 justify-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                        {getIcon(event.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <time className="text-sm text-muted-foreground">{event.date}</time>
                      </div>
                    </div>

                    <p className="text-muted-foreground mt-2">{event.description}</p>

                    {event.details && (
                      <div className="mt-4">
                        <button
                          onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          {expandedIndex === index ? "Show less" : "Learn more"}
                          <motion.div
                            animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {expandedIndex === index && (
                            <motion.div
                              initial="collapsed"
                              animate="expanded"
                              exit="collapsed"
                              variants={expandVariants}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                                {event.details}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Timeline point */}
                <motion.div
                  className="relative flex items-center justify-center w-7"
                  variants={dotVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_0_4px_rgba(var(--primary)/0.1)]" />
                </motion.div>

                {/* Empty column for spacing */}
                <div className={`col-span-1 ${isEven ? 'col-start-3' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;