import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Heart,
  Coffee,
  Code,
  Sparkles,
  History,
  type LucideIcon,
  Filter,
  Milestone,
} from "lucide-react";
import type { Timeline, Interest, Favorite } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const About = () => {
  const { data: timeline } = useQuery<Timeline[]>({
    queryKey: ["/api/about/timeline"],
  });

  const { data: interests } = useQuery<Interest[]>({
    queryKey: ["/api/about/interests"],
  });

  const { data: favorites } = useQuery<Favorite[]>({
    queryKey: ["/api/about/favorites"],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(favorites?.map(f => f.category) || []));
  const filteredFavorites = favorites?.filter(
    favorite => !selectedCategory || favorite.category === selectedCategory
  );

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

      {/* Tabbed Content */}
      <Tabs defaultValue="timeline" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mx-auto">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-8">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary/5 via-primary to-primary/5" />

            {timeline?.map((event, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-16"
                >
                  <div className={`grid grid-cols-[1fr,auto,1fr] gap-4 ${isEven ? '' : 'direction-rtl'}`}>
                    <div className={`${isEven ? 'text-right pr-4' : 'col-start-3 text-left pl-4'}`}>
                      <Card className="relative">
                        <CardHeader className="space-y-2">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{event.icon}</span>
                            <div>
                              <CardTitle className="text-xl">{event.title}</CardTitle>
                              <CardDescription>
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long'
                                })}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {event.content}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="relative flex items-center justify-center w-7">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                        className="w-3 h-3 rounded-full bg-primary shadow-[0_0_0_4px_rgba(var(--primary)/0.1)]"
                      />
                    </div>

                    <div className={`col-span-1 ${isEven ? 'col-start-3' : ''}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Interests Tab */}
        <TabsContent value="interests" className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {interests?.map((interest) => (
              <Card key={interest.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{interest.icon}</span>
                      <CardTitle>{interest.title}</CardTitle>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${interest.category === 'Technology' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                        ${interest.category === 'Research' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
                        ${interest.category === 'Community' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                        ${interest.category === 'Design' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' : ''}
                      `}
                    >
                      {interest.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{interest.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <Button
              variant={selectedCategory === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFavorites?.map((favorite) => (
              <Card key={favorite.id}>
                {favorite.image && (
                  <div 
                    className="aspect-video bg-cover bg-center" 
                    style={{ backgroundImage: `url(${favorite.image})` }}
                  />
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{favorite.title}</CardTitle>
                    <Badge 
                      variant="secondary"
                      className={`
                        ${favorite.category === 'Books' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                        ${favorite.category === 'Music' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
                        ${favorite.category === 'Movies' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                        ${favorite.category === 'Technology' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                        ${favorite.category === 'Food' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' : ''}
                        ${favorite.category === 'Travel' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' : ''}
                        ${favorite.category === 'Other' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' : ''}
                      `}
                    >
                      {favorite.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{favorite.description}</p>
                  {favorite.link && (
                    <a 
                      href={favorite.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mt-2 inline-block"
                    >
                      Learn more →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default About;