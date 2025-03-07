import { Card, CardContent } from "@/components/ui/card";

const GrriiddCard {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg">
      <CardContent className="p-0">
        <iframe
          src={"https://grriidd.replit.app/embed.html"}
          width="100%"
          height="1000"
          className="w-full rounded-2xl"
          style={{ border: "none" }}
          allow="microphone; camera; autoplay; fullscreen; payment"
        ></iframe>
      </CardContent>
    </Card>
  );
};

export default GrriiddCard;