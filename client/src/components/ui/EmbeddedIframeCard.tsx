
import { Card, CardContent } from "@/components/ui/card";

interface EmbeddedIframeCardProps {
  embedUrl: string;
}

export const EmbeddedIframeCard = ({ embedUrl }: EmbeddedIframeCardProps) => {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg">
      <CardContent className="p-0">
        <iframe
          src={embedUrl}
          width="100%"
          height="1000"
          className="w-full rounded-2xl"
          style={{ 
            border: "none",
            scrollbarWidth: "none", /* Firefox */
            msOverflowStyle: "none", /* IE and Edge */
          }}
          allow="microphone; camera; autoplay; fullscreen; payment"
        ></iframe>
        <style jsx global>{`
          iframe::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default EmbeddedIframeCard;
