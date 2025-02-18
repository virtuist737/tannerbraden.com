import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="w-full">
          {interest.image ? (
            <img 
              src={interest.image} 
              alt={interest.title} 
              className="w-full h-auto object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.png';
              }}
            />
          ) : (
            <ImageUpload
              imageUrl={interest.image}
              entityId={interest.id}
              entityType="interest"
              onSuccess={onImageUploadSuccess}
            />
          )}
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{interest.title}</CardTitle>
            <Badge variant="secondary">{interest.category}</Badge>
          </div>
        </CardHeader>
        {interest.description && (
          <CardContent>
            <p className="text-muted-foreground">{interest.description}</p>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}