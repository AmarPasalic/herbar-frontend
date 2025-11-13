import { useState } from 'react';
import { mockPlants } from '../../data/mockPlants';
import { getCurrentUser } from '../../data/mockUser';
import { getDailyFact } from '../../data/dailyFacts';
import { getCurrentLevel, allAchievements } from '../../data/achievements';
import { usePoints } from '../../hooks/usePoints';
import { Plant } from '../../types/plant';
import { PlantCard } from '../PlantCard';
import { PlantDetailDialog } from '../PlantDetailDialog';
import { Card } from '../ui/card';
import { Leaf, Book, User, Sparkles, Trophy, Award, Star } from 'lucide-react';
import { Badge } from '../ui/badge';

export function HomeScreen() {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentUser = getCurrentUser();
  const dailyFact = getDailyFact();
  const totalPoints = usePoints();
  const currentLevel = getCurrentLevel(totalPoints);
  const unlockedAchievements = allAchievements.filter(a => a.unlocked);

  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
    setDialogOpen(true);
  };

  const recentPlants = mockPlants.slice(0, 3);

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Leaf className="size-8 text-green-600" />
          <h1>Eko Explorer</h1>
        </div>
        <p className="text-muted-foreground">
          Otkrijte i dokumentujte biljni svijet oko vas
        </p>
      </div>

      {/* User Info Card */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <div className="bg-card rounded-full p-2 border">
            <User className="size-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-green-900 dark:text-green-200">{currentUser.name}</h3>
            <p className="text-sm text-green-700 dark:text-green-300">Odjeljenje: {currentUser.grade}</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center space-y-2">
          <div className="flex justify-center">
            <Trophy className="size-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Nivo</div>
            <Badge variant="secondary" className="mt-1">
              {currentLevel.level}
            </Badge>
          </div>
          <div className="text-xs text-blue-600">{currentLevel.name}</div>
        </Card>
        <Card className="p-4 text-center space-y-2">
          <div className="flex justify-center">
            <Star className="size-5 text-yellow-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Bodovi</div>
            <div className="mt-1">{totalPoints}</div>
          </div>
          <div className="text-xs text-yellow-600">Ukupno</div>
        </Card>
        <Card className="p-4 text-center space-y-2">
          <div className="flex justify-center">
            <Award className="size-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Dostignuća</div>
            <div className="mt-1">{unlockedAchievements.length}/{allAchievements.length}</div>
          </div>
          <div className="text-xs text-purple-600">Otkljucano</div>
        </Card>
      </div>

      {/* Recent Discoveries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2>Nedavna otkrića</h2>
          <Book className="size-5 text-muted-foreground" />
        </div>
        <div className="grid gap-4">
          {recentPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onClick={() => handlePlantClick(plant)}
            />
          ))}
        </div>
      </div>

      {/* Daily Fact */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
        <div className="flex gap-3">
          <div className="text-3xl flex-shrink-0 mt-0.5">{dailyFact.emoji}</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
              <h4 className="text-purple-900 dark:text-purple-200">Zanimljiva činjenica dana</h4>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              {dailyFact.fact}
            </p>
          </div>
        </div>
      </Card>

      <PlantDetailDialog
        plant={selectedPlant}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}