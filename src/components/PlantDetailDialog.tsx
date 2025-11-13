import { Plant } from '../types/plant';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Lightbulb, Calendar, Clock, CalendarDays, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

interface PlantDetailDialogProps {
  plant: Plant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const dateFormatted = date.toLocaleDateString('bs-BA', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const timeFormatted = date.toLocaleTimeString('bs-BA', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  return { date: dateFormatted, time: timeFormatted };
}

export function PlantDetailDialog({ plant, open, onOpenChange }: PlantDetailDialogProps) {
  if (!plant) return null;

  const { date, time } = formatDateTime(plant.capturedAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] p-0">
        <div className="relative h-64">
          {plant.images.length === 1 ? (
            <ImageWithFallback
              src={plant.images[0]}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Carousel className="w-full h-full">
              <CarouselContent>
                {plant.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <ImageWithFallback
                      src={image}
                      alt={`${plant.name} - slika ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          )}
        </div>
        <ScrollArea className="max-h-[calc(90vh-16rem)]">
          <div className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle>{plant.name}</DialogTitle>
              <DialogDescription>
                <span className="italic">{plant.scientificName}</span>
                <span className="block text-sm mt-1">Familija: {plant.family}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-4" />
                  <span>{time}</span>
                </div>
              </div>

              <div>
                <p>{plant.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm">Zanimljive činjenice:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1.5">
                    <Lightbulb className="size-3" />
                    {plant.funFact}
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5">
                    <CalendarDays className="size-3" />
                    {plant.season}
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5">
                    <Sparkles className="size-3" />
                    {plant.rarity}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
