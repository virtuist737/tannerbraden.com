import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/shared/ImageUpload";
import type { Interest } from "@shared/schema";

interface InterestCardProps {
  interest: Interest;
  onImageUploadSuccess: () => void;
}

export default function InterestCard({ interest, onImageUploadSuccess }: InterestCardProps) {
  return (
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
  );
}