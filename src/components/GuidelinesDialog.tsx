import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { allAchievements, levels, pointsRules } from '../data/achievements';
import { Trophy, Award, Star } from 'lucide-react';

interface GuidelinesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuidelinesDialog({ open, onOpenChange }: GuidelinesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Uputstva i bodovi</DialogTitle>
          <DialogDescription>
            Saznajte kako funkcionišu bodovi, dostignuća i nivoi
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="points" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="points">Bodovi</TabsTrigger>
            <TabsTrigger value="achievements">Dostignuća</TabsTrigger>
            <TabsTrigger value="levels">Nivoi</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh] mt-4">
            {/* Bodovi Tab */}
            <TabsContent value="points" className="space-y-3 pr-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="size-5 text-yellow-600" />
                  <h3>Kako zarađivati bodove</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Sakupljajte bodove fotografirajući i identifikujući biljke. Što više rijetkih vrsta pronađete, to više bodova zarađujete!
                </p>
              </div>

              {pointsRules.map((rule) => (
                <Card key={rule.action} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4>{rule.description}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rule.action === 'basic-photo' && 'Svaka fotografija biljke'}
                        {rule.action === 'new-species-student' && 'Prva fotografija nove vrste'}
                        {rule.action === 'rare-species' && 'Fotografija rijetke biljke'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-3">
                      +{rule.points}
                    </Badge>
                  </div>
                </Card>
              ))}

              <Card className="p-4 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 mt-4">
                <div className="space-y-1">
                  <h4 className="text-green-900 dark:text-green-200">📸 Savjet za fotografisanje</h4>
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Za najbolje rezultate identifikacije, preporučujemo da slike budu snimljene vertikalno (portret orijentacija). Ovaj format omogućava bolji prikaz cijele biljke i povećava tačnost identifikacije.
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* Dostignuća Tab */}
            <TabsContent value="achievements" className="space-y-3 pr-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="size-5 text-purple-600" />
                  <h3>Sva dostignuća</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Otkljucajte dostignuća ispunjavanjem specifičnih zadataka. Svako dostignuće donosi dodatne bodove!
                </p>
              </div>

              {allAchievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`p-4 ${!achievement.unlocked ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4>{achievement.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          +{achievement.points}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Nivoi Tab */}
            <TabsContent value="levels" className="space-y-3 pr-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="size-5 text-blue-600" />
                  <h3>Sistem nivoa</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Napredujte kroz nivoe sakupljajući bodove. Svaki nivo predstavlja vaše iskustvo kao botaničar!
                </p>
              </div>

              {levels.map((level) => (
                <Card key={level.level} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full size-10 flex items-center justify-center flex-shrink-0">
                      {level.level}
                    </div>
                    <div className="flex-1">
                      <h4>{level.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {level.minPoints} - {level.maxPoints === Infinity ? '1000+' : level.maxPoints} bodova
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="p-4 bg-blue-50 border-blue-200 mt-4">
                <div className="space-y-1">
                  <h4 className="text-blue-900">Savjet</h4>
                  <p className="text-sm text-blue-800">
                    Fokusirajte se na pronalaženje novih vrsta i rijetkih biljaka kako biste brže napredovali kroz nivoe!
                  </p>
                </div>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
