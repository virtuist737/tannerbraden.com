import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Leaderboard as LeaderboardType } from "@shared/schema";
import { Trophy } from "lucide-react";

interface LeaderboardProps {
  entries: LeaderboardType[];
  currentUserId?: string;
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <Card
              key={entry.id}
              className={cn(
                "p-3 flex items-center justify-between",
                entry.userId === currentUserId && "bg-primary/10"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">{index + 1}</span>
                <div>
                  <p className="font-medium">{entry.username}</p>
                  <p className="text-sm text-muted-foreground">
                    Rank #{entry.rank}
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold">{entry.score}</span>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
