
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section className="container px-4 py-16 md:py-20 bg-muted/30">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ventures?.map((venture) => (
            <motion.div
              key={venture.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-t-4 border-primary">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-36 h-36 mb-2 flex items-center justify-center p-2">
                    <img 
                      src={venture.logoUrl} 
                      alt={venture.name} 
                      className="max-w-full max-h-full" 
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-2xl font-bold">{venture.name}</h3>
                  <p className="text-muted-foreground">{venture.description}</p>
                  
                  {venture.websiteUrl && (
                    <div className="pt-4">
                      <Link href={venture.websiteUrl}>
                        <Button variant="outline" className="gap-2">
                          Visit Website
                          <Icons.ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
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
