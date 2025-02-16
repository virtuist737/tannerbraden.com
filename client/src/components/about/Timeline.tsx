import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award } from "lucide-react";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  type: "work" | "education" | "achievement";
}

const timelineData: TimelineEvent[] = [
  {
    title: "Senior Developer",
    date: "2023 - Present",
    description: "Leading development teams and architecting web solutions",
    type: "work",
  },
  {
    title: "Full Stack Developer",
    date: "2020 - 2023",
    description: "Building full-stack applications and mentoring junior developers",
    type: "work",
  },
  {
    title: "Master's in Computer Science",
    date: "2018 - 2020",
    description: "Specialized in Software Engineering and Web Technologies",
    type: "education",
  },
  {
    title: "Outstanding Achievement Award",
    date: "2019",
    description: "Recognized for exceptional contributions to open source",
    type: "achievement",
  },
  {
    title: "Bachelor's in Computer Science",
    date: "2014 - 2018",
    description: "Foundation in programming and computer science principles",
    type: "education",
  },
];

const Timeline = () => {
  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "work":
        return <Briefcase className="h-6 w-6" />;
      case "education":
        return <GraduationCap className="h-6 w-6" />;
      case "achievement":
        return <Award className="h-6 w-6" />;
    }
  };

  return (
    <div className="relative container max-w-3xl mx-auto px-4">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border" />
      
      {timelineData.map((event, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`relative flex items-center mb-8 ${
            index % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`relative ${
              index % 2 === 0 ? "pr-8" : "pl-8"
            } w-1/2 flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
          >
            <motion.div
              className="bg-card p-6 rounded-lg border shadow-sm max-w-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-primary">{getIcon(event.type)}</div>
                <h3 className="font-semibold">{event.title}</h3>
              </div>
              <time className="text-sm text-muted-foreground block mb-2">
                {event.date}
              </time>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            </motion.div>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="w-4 h-4 rounded-full bg-primary border-4 border-background"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
