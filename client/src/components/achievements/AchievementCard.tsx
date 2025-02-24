import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type Achievement } from "@shared/schema";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked?: boolean;
  progress?: number;
}

export function AchievementCard({ achievement, isUnlocked = false, progress = 0 }: AchievementCardProps) {
  return (
    <Card className={cn(
      "p-4 space-y-2 transition-all duration-300",
      isUnlocked ? "bg-primary/10" : "opacity-75 grayscale"
    )}>
      <div className="flex items-center gap-3">
        <div className="text-3xl">{achievement.icon}</div>
        <div>
          <h3 className="font-semibold">{achievement.title}</h3>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
        </div>
      </div>
      {!isUnlocked && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{achievement.requirements}</p>
        </div>
      )}
      {isUnlocked && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">+{achievement.points} points</span>
          <span className="text-sm text-muted-foreground">Unlocked!</span>
        </div>
      )}
    </Card>
  );
}
