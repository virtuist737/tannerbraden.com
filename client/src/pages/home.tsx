import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Experience, LifePurpose } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const { data: purpose } = useQuery<LifePurpose>({
    queryKey: ["/api/content/life-purpose"],
  });

  const { data: experience } = useQuery<Experience[]>({
    queryKey: ["/api/content/experience"],
  });

  const latestRole = experience?.[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Tanner Braden - Partner Marketing & Growth</title>
        <meta name="description" content="A passionate growth specialist building and scaling partner programs. Focusing on partnerships, marketing automation, and data-driven decisions." />
        <meta name="keywords" content="partner marketing, growth marketing, partnerships, marketing automation" />
        <meta property="og:title" content="Tanner Braden - Partner Marketing & Growth" />
        <meta property="og:description" content="A passionate growth specialist building and scaling partner programs. Focusing on partnerships, marketing automation, and data-driven decisions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content="Tanner Braden - Partner Marketing & Growth" />
        <meta name="twitter:description" content="A passionate growth specialist building and scaling partner programs. Focusing on partnerships, marketing automation, and data-driven decisions." />
      </Helmet>

      {/* Hero Section */}
      <section className="container py-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Hi, I'm <span className="text-primary">Tanner Braden</span>
          </h1>
          {latestRole && (
            <p className="mt-4 text-xl text-muted-foreground">
              {latestRole.role} at {latestRole.company}
            </p>
          )}
          <p className="mt-6 text-xl text-muted-foreground">
            {purpose?.summary || "A passionate growth specialist focusing on building and scaling partner programs."}
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link href="/about">
              <Button className="gap-2">
                Learn More About Me
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Get in Touch</Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Professional Experience Section */}
      <section className="container py-24 space-y-8 bg-muted/50">
        <h2 className="text-3xl font-bold tracking-tighter text-center">
          Professional Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experience?.slice(0, 3).map((role) => (
            <Card key={`${role.company}-${role.role}`}>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{role.company}</h3>
                <p className="text-muted-foreground">{role.role}</p>
                <p className="text-sm text-muted-foreground">{role.period}</p>
                {role.achievements && role.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-2">
                    {role.achievements.slice(0, 2).map((achievement, i) => (
                      <li key={i} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/about#experience">
            <Button variant="outline">View Full Experience</Button>
          </Link>
        </div>
      </section>

      {/* Life Purpose Section */}
      {purpose?.opportunities && (
        <section className="container py-24 space-y-8">
          <h2 className="text-3xl font-bold tracking-tighter text-center">
            What Drives Me
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purpose.opportunities.map((opportunity, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <p className="text-lg">{opportunity}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/about#purpose">
              <Button variant="outline">Learn More About My Purpose</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;