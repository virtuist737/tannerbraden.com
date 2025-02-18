import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { Filter, Loader2 } from "lucide-react";
import type { Timeline, Interest, Favorite } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TimelineComponent from "@/components/about/Timeline";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 5,
  1536: 4, // 2xl
  1280: 3, // xl
  768: 2,  // md
  640: 2,  // sm
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center w-full py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const About = () => {
  const queryClient = useQueryClient();
  const { data: timeline, isLoading: timelineLoading } = useQuery<Timeline[]>({
    queryKey: ["/api/about/timeline"],
  });

  const { data: interests, isLoading: interestsLoading } = useQuery<Interest[]>({
    queryKey: ["/api/about/interests"],
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery<Favorite[]>({
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
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-12 space-y-16">
        <section className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="h-40 w-40 ring-4 ring-primary/10 ring-offset-4 ring-offset-background shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <AvatarImage src="/images/tanner2.0_dark-500x500.png" alt="Tanner Braden" />
                <AvatarFallback>TB</AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="text-center max-w-3xl mx-auto px-4">
              <h1 className="text-4xl font-bold tracking-tighter mb-4">About Me</h1>
              <p className="text-xl text-muted-foreground">
                I'm a partnerships and growth specialist with a deep drive to increase the quality of human consciousness. By combining my experience in partner marketing with my passion for building scalable solutions, I work to create meaningful impact through technology and collaboration.
              </p>
            </div>
          </motion.div>
        </section>

        <Tabs defaultValue="interests" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="timeline" className="space-y-8">
            {timelineLoading ? <LoadingSpinner /> : <TimelineComponent />}
          </TabsContent>

          <TabsContent value="interests" className="space-y-8">
            <div className="flex flex-wrap gap-2 items-center justify-center max-w-2xl mx-auto px-4">
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

            {interestsLoading ? (
              <LoadingSpinner />
            ) : (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-6 w-auto"
                columnClassName="pl-6 bg-clip-padding"
              >
                {filteredInterests?.sort((a, b) => a.sortOrder - b.sortOrder).map((interest, index) => {
                  const { ref, inView } = useInView({
                    triggerOnce: true,
                    threshold: 0.1,
                  });

                  return (
                    <motion.div
                      ref={ref}
                      key={interest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="mb-6"
                    >
                      <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="w-full">
                          {interest.imageUrl ? (
                            <img 
                              src={interest.imageUrl} 
                              alt={interest.item} 
                              className="w-full h-auto object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder.png';
                              }}
                            />
                          ) : (
                            <ImageUpload
                              imageUrl={interest.imageUrl}
                              entityId={interest.id}
                              entityType="interest"
                              onSuccess={() => handleImageUploadSuccess('interests')}
                            />
                          )}
                        </div>
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
                      </Card>
                    </motion.div>
                  );
                })}
              </Masonry>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-8">
            <div className="flex flex-wrap gap-2 items-center justify-center max-w-2xl mx-auto px-4">
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

            {favoritesLoading ? (
              <LoadingSpinner />
            ) : (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-6 w-auto"
                columnClassName="pl-6 bg-clip-padding"
              >
                {filteredFavorites?.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((favorite, index) => {
                  const { ref, inView } = useInView({
                    triggerOnce: true,
                    threshold: 0.1,
                  });

                  return (
                    <motion.div
                      ref={ref}
                      key={favorite.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="mb-6"
                    >
                      <a
                        href={favorite.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                          <div className="w-full">
                            {favorite.image ? (
                              <img 
                                src={favorite.image} 
                                alt={favorite.title} 
                                className="w-full h-auto object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder.png';
                                }}
                              />
                            ) : (
                              <ImageUpload
                                imageUrl={favorite.image}
                                entityId={favorite.id}
                                entityType="favorite"
                                onSuccess={() => handleImageUploadSuccess('favorites')}
                              />
                            )}
                          </div>
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
                          <CardContent>
                            {favorite.description && (
                              <p className="text-muted-foreground">{favorite.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      </a>
                    </motion.div>
                  );
                })}
              </Masonry>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default About;