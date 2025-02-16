import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Award, ChevronDown, Sparkle, Baby, Music, Plane, Heart, Brain, Map } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Timeline } from "@shared/schema";

interface CardProps {
  event: Timeline;
  expandedIndex: number | null;
  index: number;
  setExpandedIndex: (index: number | null) => void;
}

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

const TimelineComponent = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { data: timeline } = useQuery<Timeline[]>({
    queryKey: ["/api/about/timeline"],
  });

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

  if (!timeline) return null;

  return (
    <div className="relative container max-w-7xl mx-auto px-4 py-16">
      <div className="absolute left-1/2 transform -translate-x-[1px] h-full w-[2px] bg-gradient-to-b from-primary/5 via-primary to-primary/5" />

      <div className="relative">
        {timeline.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={event.id} className="mb-16">
              <div className="relative grid grid-cols-[1fr,auto,1fr] gap-8">
                {/* Left side content */}
                <div className={isEven ? 'pr-4' : ''}>
                  {isEven && (
                    <motion.div
                      variants={cardVariants}
                      custom={isEven}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      className="flex justify-end"
                    >
                      <TimelineCard event={event} expandedIndex={expandedIndex} index={index} setExpandedIndex={setExpandedIndex} />
                    </motion.div>
                  )}
                </div>

                {/* Timeline point */}
                <div className="flex items-center justify-center">
                  <motion.div
                    variants={dotVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative w-4 h-4 flex items-center justify-center"
                  >
                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_0_4px_rgba(var(--primary)/0.1)]" />
                  </motion.div>
                </div>

                {/* Right side content */}
                <div className={isEven ? '' : 'pl-4'}>
                  {!isEven && (
                    <motion.div
                      variants={cardVariants}
                      custom={isEven}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      className="flex justify-start"
                    >
                      <TimelineCard event={event} expandedIndex={expandedIndex} index={index} setExpandedIndex={setExpandedIndex} />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TimelineCard: React.FC<CardProps> = ({ event, expandedIndex, index, setExpandedIndex }) => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case "👶":
        return <Baby className="h-5 w-5" />;
      case "🎵":
        return <Music className="h-5 w-5" />;
      case "✈️":
        return <Plane className="h-5 w-5" />;
      case "🎓":
        return <GraduationCap className="h-5 w-5" />;
      case "💑":
        return <Heart className="h-5 w-5" />;
      case "🤔":
        return <Sparkle className="h-5 w-5" />;
      case "🇨🇳":
        return <Map className="h-5 w-5" />;
      case "🧠":
        return <Brain className="h-5 w-5" />;
      default:
        return <Briefcase className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
          {getIcon(event.icon)}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <time className="text-sm text-muted-foreground">
            {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}
          </time>
        </div>
      </div>

      <p className="text-muted-foreground mt-2">{event.content}</p>

      {event.content.length > 200 && (
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
                  {event.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TimelineComponent;