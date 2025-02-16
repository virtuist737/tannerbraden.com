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
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useQueryClient } from "@tanstack/react-query";

const About = () => {
  const queryClient = useQueryClient();
  const { data: timeline } = useQuery<Timeline[]>({
    queryKey: ["/api/about/timeline"],
  });

  const { data: interests } = useQuery<Interest[]>({
    queryKey: ["/api/about/interests"],
  });

  const { data: favorites } = useQuery<Favorite[]>({
    queryKey: ["/api/about/favorites"],
  });

  const [selectedInterestCategory, setSelectedInterestCategory] = useState<string | null>(null);
  const [selectedFavoriteCategory, setSelectedFavoriteCategory] = useState<string | null>(null);

  const interestCategories = Array.from(new Set(interests?.map(i => i.category) || []));
  const favoriteCategories = Array.from(new Set(favorites?.map(f => f.category) || []));

  const filteredInterests = interests?.filter(
    interest => !selectedInterestCategory || interest.category === selectedInterestCategory
  );

  const filteredFavorites = favorites?.filter(
    favorite => !selectedFavoriteCategory || favorite.category === selectedFavoriteCategory
  );

  const handleImageUploadSuccess = (entityType: string) => {
    queryClient.invalidateQueries({ queryKey: [`/api/about/${entityType}`] });
  };

  return (
    <div className="container py-12 space-y-16">
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

      <Tabs defaultValue="interests" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mx-auto">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-8">
          <TimelineComponent />
        </TabsContent>

        <TabsContent value="interests" className="space-y-8">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <Button
              variant={selectedInterestCategory === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedInterestCategory(null)}
              className="rounded-full"
            >
              All
            </Button>
            {interestCategories.map((category) => (
              <Button
                key={category}
                variant={selectedInterestCategory === category ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedInterestCategory(category)}
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
            {filteredInterests?.sort((a, b) => a.sortOrder - b.sortOrder).map((interest) => (
              <Card key={interest.id} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <ImageUpload
                  imageUrl={interest.imageUrl}
                  entityId={interest.id}
                  entityType="interest"
                  onSuccess={() => handleImageUploadSuccess('interests')}
                />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{interest.item}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`
                        transition-colors
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
                  <p className="text-sm text-muted-foreground">Category: {interest.category}</p>
                </CardContent>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-8">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <Button
              variant={selectedFavoriteCategory === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedFavoriteCategory(null)}
              className="rounded-full"
            >
              All
            </Button>
            {favoriteCategories.map((category) => (
              <Button
                key={category}
                variant={selectedFavoriteCategory === category ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedFavoriteCategory(category)}
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
            {filteredFavorites?.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((favorite) => (
              <Card key={favorite.id} className="flex flex-col h-full">
                <ImageUpload
                  imageUrl={favorite.image}
                  entityId={favorite.id}
                  entityType="favorite"
                  onSuccess={() => handleImageUploadSuccess('favorites')}
                />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{favorite.title}</CardTitle>
                    <Badge 
                      variant="secondary"
                      className={`
                        ${favorite.category === 'app' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300' : ''}
                        ${favorite.category === 'book' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                        ${favorite.category === 'podcast' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
                        ${favorite.category === 'music' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' : ''}
                        ${favorite.category === 'video games' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                      `}
                    >
                      {favorite.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  {favorite.description && (
                    <p className="text-muted-foreground">{favorite.description}</p>
                  )}
                </CardContent>
                {favorite.link && (
                  <div className="p-4 pt-0">
                    <a
                      href={favorite.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Visit Link →
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default About;