import { useEffect } from "react";
import { useGamification } from "@/lib/gamification";
import { AchievementCard } from "./AchievementCard";
import { Leaderboard } from "./Leaderboard";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star } from "lucide-react";

export function GamificationContainer() {
  const {
    userId,
    achievements,
    progress,
    leaderboard,
    unlockedAchievements,
    points,
    fetchAchievements,
    fetchLeaderboard
  } = useGamification();
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
    fetchLeaderboard();

    // Poll for updates every minute
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchAchievements, fetchLeaderboard]);

  useEffect(() => {
    if (progress?.totalPoints !== points && progress?.totalPoints) {
      toast({
        title: "Points Updated!",
        description: `You now have ${progress.totalPoints} points!`,
      });
    }
  }, [progress?.totalPoints, points, toast]);

  return (
    <div className="container py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Progress */}
        <Card className="p-4 col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-bold">Your Progress</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Points</span>
                <span className="text-sm text-muted-foreground">
                  {progress?.totalPoints || 0} points
                </span>
              </div>
              <Progress
                value={(progress?.totalPoints || 0) / 10}
                className="h-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{progress?.visitStreak || 0}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {progress?.collectiblesFound || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Collectibles Found
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Leaderboard */}
        <div className="col-span-1">
          <Leaderboard entries={leaderboard} currentUserId={userId} />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={unlockedAchievements.has(achievement.id)}
              progress={50} // TODO: Calculate actual progress
            />
          ))}
        </div>
      </div>
    </div>
  );
}
