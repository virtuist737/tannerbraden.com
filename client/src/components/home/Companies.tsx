import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Company } from "@shared/schema";
import { Link } from "wouter";

const Companies = () => {
  // Use actual API data from the database
  const { data: companies, isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  if (isLoading) {
    return (
      <section className="container px-4 py-16 md:py-20">
        <div className="text-center">Loading companies...</div>
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
            Companies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {companies?.map((company) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 border-t-4 border-primary">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-36 h-36 mb-2 flex items-center justify-center p-2">
                    <img 
                      src={company.logoUrl} 
                      alt={company.name} 
                      className="max-w-full max-h-full" 
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-2xl font-bold">{company.name}</h3>
                  <p className="text-muted-foreground">{company.description}</p>
                  
                  {company.websiteUrl && (
                    <div className="pt-4">
                      <Link href={company.websiteUrl}>
                        <Button variant="outline" className="gap-2">
                          Visit Website
                          <ExternalLink className="h-4 w-4" />
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

export default Companies;