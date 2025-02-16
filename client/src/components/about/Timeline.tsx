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
        return <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />;
      case "education":
        return <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />;
      case "achievement":
        return <Award className="h-5 w-5 sm:h-6 sm:w-6" />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.15,
      },
    }),
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1 },
  };

  return (
    <div className="relative container max-w-4xl mx-auto px-4 py-8">
      <div 
        className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20" 
      />

      {timelineData.map((event, index) => (
        <motion.div
          key={index}
          custom={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={cardVariants}
          className={`relative flex items-start sm:items-center mb-12 ${
            index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
          }`}
        >
          <div
            className={`relative pl-8 sm:pl-0 ${
              index % 2 === 0 ? "sm:pr-8" : "sm:pl-8"
            } w-full sm:w-1/2 flex ${index % 2 === 0 ? "sm:justify-end" : "sm:justify-start"}`}
          >
            <motion.div
              className="bg-card p-4 sm:p-6 rounded-lg border shadow-sm w-full sm:max-w-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-primary">{getIcon(event.type)}</div>
                  <h3 className="font-semibold text-sm sm:text-base">{event.title}</h3>
                </div>
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={expandedIndex === index ? "Show less" : "Show more"}
                >
                  <motion.div
                    animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>
              </div>
              <time className="text-xs sm:text-sm text-muted-foreground block mb-2">
                {event.date}
              </time>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {event.description}
              </p>
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={expandVariants}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs sm:text-sm text-muted-foreground mt-4 pt-4 border-t">
                      {event.details}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-6 sm:top-1/2">
            <motion.div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary border-4 border-background shadow-md"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.15,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;