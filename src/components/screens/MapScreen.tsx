import { useState } from 'react';
import { mockPlants } from '../../data/mockPlants';
import { Plant } from '../../types/plant';
import { PlantDetailDialog } from '../PlantDetailDialog';
import { Card } from '../ui/card';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function MapScreen() {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const plantsWithLocation = mockPlants.filter(plant => plant.location);

  const handleMarkerClick = (plant: Plant) => {
    setSelectedPlant(plant);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="space-y-2">
        <h1>Mapa biljaka</h1>
        <p className="text-muted-foreground">
          Istražite gdje ste otkrili biljke
        </p>
      </div>

      {/* Map Placeholder */}
      <Card className="relative overflow-hidden">
        <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-blue-100 relative">
          {/* Simulated map markers */}
          <div className="absolute inset-0 p-4">
            {plantsWithLocation.map((plant, index) => (
              <button
                key={plant.id}
                onClick={() => handleMarkerClick(plant)}
                className="absolute group"
                style={{
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10) % 40}%`,
                }}
              >
                <div className="relative">
                  <MapPin className="size-8 text-red-600 drop-shadow-lg transition-transform group-hover:scale-110" fill="currentColor" />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <Badge className="text-xs">{plant.name}</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="bg-card shadow-lg">
              <Navigation className="size-4" />
            </Button>
          </div>

          {/* Map Attribution */}
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-2 text-xs text-muted-foreground text-center bg-card/90 backdrop-blur-sm">
              Interaktivna mapa lokacija biljaka
            </Card>
          </div>
        </div>
      </Card>

      {/* Location List */}
      <div className="space-y-3">
        <h2>Nedavne lokacije</h2>
        <div className="space-y-2">
          {plantsWithLocation.map((plant) => (
            <Card
              key={plant.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleMarkerClick(plant)}
            >
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="truncate">{plant.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {plant.location?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(plant.capturedAt).toLocaleDateString('bs-BA')}
                  </p>
                </div>
                <Badge variant="secondary">
                  {plant.careLevel}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <PlantDetailDialog
        plant={selectedPlant}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}