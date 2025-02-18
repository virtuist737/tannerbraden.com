import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageUpload } from "@/components/shared/ImageUpload";
import type { Interest } from "@shared/schema";

interface InterestCardProps {
  interest: Interest;
  index: number;
  onImageUploadSuccess: () => void;
}

export default function InterestCard({ interest, index, onImageUploadSuccess }: InterestCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    delay: 100,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow flex flex-col">
        <div className="w-full">
          {interest.imageUrl ? (
            <img 
              src={interest.imageUrl} 
              alt={interest.item} 
              className="w-full h-auto object-contain rounded-t-lg"
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
              onSuccess={onImageUploadSuccess}
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
}