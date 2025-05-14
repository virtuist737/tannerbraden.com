
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Venture } from "@shared/schema";
import { Link } from "wouter";

const Ventures = () => {
  const { data: ventures, isLoading } = useQuery<Venture[]>({
    queryKey: ["/api/ventures"],
  });

  if (isLoading) {
    return (
      <section className="container px-4 py-16 md:py-20">
        <div className="text-center">Loading ventures...</div>
      </section>
    );
  }

  return (
    <section className="container px-4 py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
            Ventures
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Here are my main two ventures to which I dedicate most of my time and energy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ventures?.map((venture) => (
            <motion.div
              key={venture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center p-6">
                  <div className="w-32 h-32 mb-4 flex items-center justify-center">
                    <img 
                      src={venture.logoUrl} 
                      alt={venture.name} 
                      className="max-w-full max-h-full"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{venture.name}</h3>
                </CardHeader>
                <CardContent className="text-center px-6 pb-6">
                  <p className="text-muted-foreground mb-6">{venture.description}</p>
                  {venture.websiteUrl && (
                    <Button variant="outline" asChild className="gap-2">
                      <a 
                        href={venture.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                        <Icons.ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Ventures;
