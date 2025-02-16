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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter } from "lucide-react";
import type { Timeline, Interest, Favorite } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TimelineComponent from "@/components/about/Timeline";

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
  const categories = Array.from(new Set(interests?.map(i => i.category) || []));
  const filteredInterests = interests?.filter(
    interest => !selectedCategory || interest.category === selectedCategory
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
            I'm a partnerships and growth specialist with a deep drive to increase the quality of human consciousness. By combining my experience in partner marketing with my passion for building scalable solutions, I work to create meaningful impact through technology and collaboration.
          </p>
        </motion.div>
      </section>

      {/* Tabbed Content */}
      <Tabs defaultValue="interests" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mx-auto">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-8">
          <TimelineComponent />
        </TabsContent>

        {/* Interests Tab */}
        <TabsContent value="interests" className="space-y-8">
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
            {filteredInterests?.map((interest) => (
              <Card key={interest.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{interest.category}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${interest.type === 'interests' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                        ${interest.type === 'instruments' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
                        ${interest.type === 'activities' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                      `}
                    >
                      {interest.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{interest.item}</p>
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
            {favorites?.map((favorite) => (
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