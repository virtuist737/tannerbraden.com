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
  type LucideIcon,
  Filter,
} from "lucide-react";
import type { Story, Interest, Favorite } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categoryColors = {
  'Books': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Music': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Movies': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Technology': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'Food': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'Travel': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
} as const;

const About = () => {
  const { data: stories } = useQuery<Story[]>({
    queryKey: ["/api/about/stories"],
  });

  const { data: interests } = useQuery<Interest[]>({
    queryKey: ["/api/about/interests"],
  });

  const { data: favorites } = useQuery<Favorite[]>({
    queryKey: ["/api/about/favorites"],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from favorites
  const categories = Array.from(new Set(favorites?.map(f => f.category) || []));

  // Filter favorites based on selected category
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
      <Tabs defaultValue="stories" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mx-auto">
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        {/* Stories Tab */}
        <TabsContent value="stories" className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {stories?.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <div 
                  className="aspect-video bg-cover bg-center" 
                  style={{ backgroundImage: `url(${story.image})` }}
                />
                <CardHeader>
                  <CardTitle>{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{story.content}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
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
                      className={categoryColors[favorite.category as keyof typeof categoryColors] || categoryColors.Other}
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