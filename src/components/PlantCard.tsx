import { Plant } from '../types/plant';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, Clock, Images } from 'lucide-react';
import { Badge } from './ui/badge';

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
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

export function PlantCard({ plant, onClick }: PlantCardProps) {
  const { date, time } = formatDateTime(plant.capturedAt);
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-48">
        <ImageWithFallback
          src={plant.images[0]}
          alt={plant.name}
          className="w-full h-full object-cover"
        />
        {plant.images.length > 1 && (
          <Badge className="absolute top-2 right-2 gap-1.5 bg-black/70 hover:bg-black/80">
            <Images className="size-3" />
            {plant.images.length}
          </Badge>
        )}
      </div>
      <div className="p-3 space-y-1">
        <h3 className="truncate">{plant.name}</h3>
        <p className="text-muted-foreground text-sm italic truncate">
          {plant.scientificName}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}