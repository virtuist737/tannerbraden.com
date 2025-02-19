import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Award, ChevronRight, Sparkle, Baby, Music, Plane, Heart, Brain, Map } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Timeline } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CardProps {
  event: Timeline;
  onClick: () => void;
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
  const [selectedEvent, setSelectedEvent] = useState<Timeline | null>(null);
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
    <>
      <div className="relative container max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="absolute left-[28px] md:left-1/2 transform md:-translate-x-[1px] h-full w-[2px] bg-gradient-to-b from-primary/5 via-primary to-primary/5" />

        <div className="relative space-y-8 md:space-y-16">
          {timeline.map((event, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={event.id}>
                {/* Mobile layout - stack everything vertically */}
                <div className="block md:hidden">
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex flex-col pl-12"
                  >
                    <div className="absolute left-[24px] w-4 h-4 mt-[22px]">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_0_4px_rgba(var(--primary)/0.1)]" />
                    </div>
                    <TimelineCard
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                    />
                  </motion.div>
                </div>

                {/* Desktop layout - alternating sides */}
                <div className="hidden md:grid md:grid-cols-[1fr,auto,1fr] md:gap-8">
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
                        <TimelineCard
                          event={event}
                          onClick={() => setSelectedEvent(event)}
                        />
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
                        <TimelineCard
                          event={event}
                          onClick={() => setSelectedEvent(event)}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl h-[80vh]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                    {getIcon(selectedEvent.icon)}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">{selectedEvent.title}</DialogTitle>
                    <time className="text-sm text-muted-foreground">
                      {new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </time>
                  </div>
                </div>
              </DialogHeader>
              <ScrollArea className="h-full pr-4">
                <div className="prose prose-primary dark:prose-invert max-w-none">
                  {renderContent(selectedEvent.content)}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const TimelineCard: React.FC<CardProps> = ({ event, onClick }) => {
  return (
    <Button
      variant="outline"
      className="p-4 md:p-6 h-auto bg-card border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full md:max-w-xl text-left flex flex-col gap-4 group"
      onClick={onClick}
    >
      {event.imageUrl && (
        <div className="w-full rounded-lg overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-auto"
          />
        </div>
      )}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
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
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Button>
  );
};

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

const renderContent = (content: string) => {
  const imageRegex = /\[IMAGE:(.*?)\]/g;
  const parts = content.split(imageRegex);

  return parts.map((part, index) => {
    if (index % 2 === 1) {
      // This is an image URL
      return (
        <div key={index} className="my-4">
          <img
            src={part}
            alt="Timeline content"
            className="rounded-lg max-w-full h-auto"
            loading="lazy"
          />
        </div>
      );
    }
    // This is regular content
    return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
  });
};

export default TimelineComponent;