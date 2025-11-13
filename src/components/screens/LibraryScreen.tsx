import { useState, useEffect } from 'react';
import { mockPlants } from '../../data/mockPlants';
import { Plant } from '../../types/plant';
import { PlantCard } from '../PlantCard';
import { PlantDetailDialog } from '../PlantDetailDialog';
import { Input } from '../ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { useAuth } from '../../hooks/useAuth';

type SortOption = 'recent' | 'alphabetical' | 'oldest';
type RarityFilter = 'all' | 'very-common' | 'common' | 'uncommon' | 'rare' | 'very-rare';
type SeasonFilter = 'all' | 'spring' | 'summer' | 'autumn' | 'winter';
type DateFilter = 'all' | 'today' | 'week' | 'month' | 'year';

export function LibraryScreen() {
  const { isOfflineMode } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [familyFilter, setFamilyFilter] = useState<string>('all');
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  // Load plants from localStorage or use mockPlants
  useEffect(() => {
    if (isOfflineMode) {
      const savedPlants = localStorage.getItem('offline_plants');
      if (savedPlants) {
        const offlinePlants = JSON.parse(savedPlants);
        // Convert offline plants to Plant type
        const convertedPlants: Plant[] = offlinePlants.map((p: any) => ({
          id: p.id,
          name: p.name,
          scientificName: p.scientificName,
          family: p.family || 'Nepoznata',
          images: [p.photoUrl],
          capturedAt: p.createdAt,
          description: p.description,
          // Generate data based on plant info
          funFact: `Prepoznata sa ${p.confidence}% sigurnošću`,
          season: 'Proljeće, Ljeto',
          rarity: p.isRare ? 'Vrlo rijetka' : p.confidence > 80 ? 'Česta' : 'Neuobičajena'
        }));
        setPlants(convertedPlants);
      } else {
        setPlants([]);
      }
    } else {
      // Use mockPlants for demonstration
      setPlants(mockPlants);
    }
  }, [isOfflineMode]);

  // Get unique families from plants - only show common ones
  const commonFamilies = ['Lamiaceae', 'Araceae', 'Crassulaceae'];
  const allFamilies = Array.from(new Set(plants.map(plant => plant.family)));
  const otherFamilies = allFamilies.filter(f => !commonFamilies.includes(f));

  const handlePlantClick = (plant: Plant) => {
    setSelectedPlant(plant);
    setDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSortBy('recent');
    setRarityFilter('all');
    setFamilyFilter('all');
    setSeasonFilter('all');
    setDateFilter('all');
  };

  // Helper function to match rarity
  const matchesRarityFilter = (plantRarity: string, filter: RarityFilter): boolean => {
    if (filter === 'all') return true;
    
    const rarityLower = plantRarity.toLowerCase();
    if (filter === 'very-common') {
      return rarityLower.includes('vrlo čest') || rarityLower.includes('very common');
    }
    if (filter === 'common') {
      return rarityLower.includes('čest') && !rarityLower.includes('vrlo') || rarityLower.includes('common') && !rarityLower.includes('very');
    }
    if (filter === 'uncommon') {
      return rarityLower.includes('uobičajen') || rarityLower.includes('neuobičajen') || rarityLower.includes('uncommon');
    }
    if (filter === 'rare') {
      return rarityLower.includes('rijetak') && !rarityLower.includes('vrlo') || rarityLower.includes('rare') && !rarityLower.includes('very');
    }
    if (filter === 'very-rare') {
      return rarityLower.includes('vrlo rijetak') || rarityLower.includes('very rare');
    }
    return false;
  };

  // Helper function to match season
  const matchesSeasonFilter = (plantSeason: string, filter: SeasonFilter): boolean => {
    if (filter === 'all') return true;
    
    const seasonLower = plantSeason.toLowerCase();
    if (filter === 'spring') {
      return seasonLower.includes('proljeće') || seasonLower.includes('spring');
    }
    if (filter === 'summer') {
      return seasonLower.includes('ljeto') || seasonLower.includes('summer');
    }
    if (filter === 'autumn') {
      return seasonLower.includes('jesen') || seasonLower.includes('autumn') || seasonLower.includes('fall');
    }
    if (filter === 'winter') {
      return seasonLower.includes('zima') || seasonLower.includes('winter');
    }
    return false;
  };

  // Helper function to match date
  const matchesDateFilter = (plantDate: string, filter: DateFilter): boolean => {
    if (filter === 'all') return true;
    
    const capturedDate = new Date(plantDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - capturedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (filter === 'today') {
      return diffDays <= 1;
    }
    if (filter === 'week') {
      return diffDays <= 7;
    }
    if (filter === 'month') {
      return diffDays <= 30;
    }
    if (filter === 'year') {
      return diffDays <= 365;
    }
    return false;
  };

  // Filter by search query, rarity, family, season and date
  let filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.family.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRarity = matchesRarityFilter(plant.rarity, rarityFilter);
    
    // Handle "Druge" option for family filter
    let matchesFamily = false;
    if (familyFilter === 'all') {
      matchesFamily = true;
    } else if (familyFilter === 'Druge') {
      matchesFamily = !commonFamilies.includes(plant.family);
    } else {
      matchesFamily = plant.family === familyFilter;
    }
    
    const matchesSeason = matchesSeasonFilter(plant.season, seasonFilter);
    const matchesDate = matchesDateFilter(plant.capturedAt, dateFilter);
    
    return matchesSearch && matchesRarity && matchesFamily && matchesSeason && matchesDate;
  });

  // Sort plants
  filteredPlants = [...filteredPlants].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime();
    } else if (sortBy === 'alphabetical') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const activeFilters = [
    rarityFilter !== 'all' && rarityFilter,
    familyFilter !== 'all' && familyFilter,
    seasonFilter !== 'all' && seasonFilter,
    dateFilter !== 'all' && dateFilter,
    sortBy !== 'recent' && sortBy,
  ].filter(Boolean);

  return (
    <div className="space-y-6 pb-6">
      <div className="space-y-2">
        <h1>Biblioteka biljaka</h1>
        <p className="text-muted-foreground">
          Vaša kolekcija identificiranih biljaka
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži biljke..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <SlidersHorizontal className="size-4" />
              {activeFilters.length > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Filteri i sortiranje</DialogTitle>
              <DialogDescription>
                Prilagodite prikaz vaše biblioteke biljaka
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Sort By */}
              <Card className="p-4">
                <Label className="text-sm mb-3 block">Sortiraj po</Label>
                <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="recent" id="recent" />
                    <Label htmlFor="recent" className="cursor-pointer text-sm">
                      Najnovije
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="oldest" id="oldest" />
                    <Label htmlFor="oldest" className="cursor-pointer text-sm">
                      Najstarije
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alphabetical" id="alphabetical" />
                    <Label htmlFor="alphabetical" className="cursor-pointer text-sm">
                      Abecedni red (A-Ž)
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Rarity Filter */}
              <Card className="p-4">
                <Label className="text-sm mb-3 block">Rijetkoća</Label>
                <RadioGroup value={rarityFilter} onValueChange={(value) => setRarityFilter(value as RarityFilter)}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="cursor-pointer text-sm">
                      Sve biljke
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="very-common" id="very-common" />
                    <Label htmlFor="very-common" className="cursor-pointer text-sm">
                      Vrlo česte
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="common" id="common" />
                    <Label htmlFor="common" className="cursor-pointer text-sm">
                      Česte
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="uncommon" id="uncommon" />
                    <Label htmlFor="uncommon" className="cursor-pointer text-sm">
                      Uobičajene
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="rare" id="rare" />
                    <Label htmlFor="rare" className="cursor-pointer text-sm">
                      Rijetke
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-rare" id="very-rare" />
                    <Label htmlFor="very-rare" className="cursor-pointer text-sm">
                      Vrlo rijetke
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Family Filter */}
              <Card className="p-4">
                <Label className="text-sm mb-3 block">Familija biljaka</Label>
                <RadioGroup value={familyFilter} onValueChange={setFamilyFilter}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="all" id="family-all" />
                    <Label htmlFor="family-all" className="cursor-pointer text-sm">
                      Sve familije
                    </Label>
                  </div>
                  {commonFamilies.map((family) => (
                    <div key={family} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={family} id={`family-${family}`} />
                      <Label htmlFor={`family-${family}`} className="cursor-pointer text-sm">
                        {family}
                      </Label>
                    </div>
                  ))}
                  {otherFamilies.length > 0 && (
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="Druge" id="family-other" />
                      <Label htmlFor="family-other" className="cursor-pointer text-sm">
                        Druge
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </Card>

              {/* Season Filter */}
              <Card className="p-4">
                <Label className="text-sm mb-3 block">Sezona</Label>
                <RadioGroup value={seasonFilter} onValueChange={(value) => setSeasonFilter(value as SeasonFilter)}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="all" id="season-all" />
                    <Label htmlFor="season-all" className="cursor-pointer text-sm">
                      Sve sezone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="spring" id="spring" />
                    <Label htmlFor="spring" className="cursor-pointer text-sm">
                      Proljeće
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="summer" id="summer" />
                    <Label htmlFor="summer" className="cursor-pointer text-sm">
                      Ljeto
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="autumn" id="autumn" />
                    <Label htmlFor="autumn" className="cursor-pointer text-sm">
                      Jesen
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="winter" id="winter" />
                    <Label htmlFor="winter" className="cursor-pointer text-sm">
                      Zima
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Date Filter */}
              <Card className="p-4">
                <Label className="text-sm mb-3 block">Datum slikanja</Label>
                <RadioGroup value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="all" id="date-all" />
                    <Label htmlFor="date-all" className="cursor-pointer text-sm">
                      Svi datumi
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="today" id="today" />
                    <Label htmlFor="today" className="cursor-pointer text-sm">
                      Danas
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="week" id="week" />
                    <Label htmlFor="week" className="cursor-pointer text-sm">
                      Ove sedmice
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="month" id="month" />
                    <Label htmlFor="month" className="cursor-pointer text-sm">
                      Ovog mjeseca
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="year" id="year" />
                    <Label htmlFor="year" className="cursor-pointer text-sm">
                      Ove godine
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Clear Filters */}
              {activeFilters.length > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleClearFilters}
                >
                  Poništi sve filtere
                </Button>
              )}

              {/* Apply Button */}
              <Button 
                className="w-full" 
                onClick={() => setFilterOpen(false)}
              >
                Primijeni
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {rarityFilter !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              {rarityFilter === 'very-common' && 'Vrlo česte'}
              {rarityFilter === 'common' && 'Česte'}
              {rarityFilter === 'uncommon' && 'Uobičajene'}
              {rarityFilter === 'rare' && 'Rijetke'}
              {rarityFilter === 'very-rare' && 'Vrlo rijetke'}
              <button onClick={() => setRarityFilter('all')}>
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {familyFilter !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              {familyFilter}
              <button onClick={() => setFamilyFilter('all')}>
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {seasonFilter !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              {seasonFilter === 'spring' && 'Proljeće'}
              {seasonFilter === 'summer' && 'Ljeto'}
              {seasonFilter === 'autumn' && 'Jesen'}
              {seasonFilter === 'winter' && 'Zima'}
              <button onClick={() => setSeasonFilter('all')}>
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {dateFilter !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              {dateFilter === 'today' && 'Danas'}
              {dateFilter === 'week' && 'Ove sedmice'}
              {dateFilter === 'month' && 'Ovog mjeseca'}
              {dateFilter === 'year' && 'Ove godine'}
              <button onClick={() => setDateFilter('all')}>
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {sortBy !== 'recent' && (
            <Badge variant="secondary" className="gap-2">
              {sortBy === 'oldest' && 'Najstarije'}
              {sortBy === 'alphabetical' && 'A-Ž'}
              <button onClick={() => setSortBy('recent')}>
                <X className="size-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredPlants.length} {filteredPlants.length === 1 ? 'biljka pronađena' : filteredPlants.length < 5 ? 'biljke pronađene' : 'biljaka pronađeno'}
      </div>

      {/* Plant Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredPlants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onClick={() => handlePlantClick(plant)}
          />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nisu pronađene biljke koje odgovaraju vašoj pretrazi</p>
          <Button 
            variant="link" 
            className="mt-2"
            onClick={handleClearFilters}
          >
            Poništi filtere
          </Button>
        </div>
      )}

      <PlantDetailDialog
        plant={selectedPlant}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}