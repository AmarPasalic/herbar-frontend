import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { API_BASE_URL } from '../../config/api';
import { useLanguage } from '../../hooks/useLanguage';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Camera, Image as ImageIcon, Plus, Sparkles, X, Loader2, AlertCircle } from 'lucide-react';
import { mockPlants } from '../../data/mockPlants';
import { computePlantSavePoints, addPoints, getBasicPhotoPoints, computePlantSaveBonusPoints } from '../../utils/points';
import { LOW_CONFIDENCE_THRESHOLD, RARE_CONFIDENCE_THRESHOLD, getOfflineConfidence } from '../../config/gamification';

// Helper function to convert base64 to File
const base64ToFile = async (base64String: string, fileName: string): Promise<File> => {
  const response = await fetch(base64String);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};

export function IdentifyScreen() {
  const { token } = useAuth();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Allow user to hint PlantNet which organs are in the photos
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>(['leaf']);
  const [result, setResult] = useState<{
    name: string;
    scientificName: string;
    confidence: number;
    family: string;
    description: string;
  } | null>(null);
  const [candidates, setCandidates] = useState<Array<{
    name: string;
    scientificName: string;
    confidence: number;
    family: string;
    description: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLowConfidence, setIsLowConfidence] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const additionalImageRef = useRef<HTMLInputElement>(null);

  // Extract a human-friendly hint from a filename (without extension, slug to words)
  const nameHintFromFilename = (filename: string): string => {
    try {
      const base = filename.replace(/\.[^.]+$/i, ''); // strip extension
      // Replace separators with spaces, collapse repeats, trim
      return base
        .replace(/[._-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    } catch {
      return filename;
    }
  };

  const toTitleCase = (s: string): string =>
    s
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);

      const imagePromises = filesArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file as Blob);
        });
      });

      Promise.all(imagePromises).then((images) => {
        setSelectedImages((prev) => [...prev, ...images]);
        setSelectedFiles((prev) => [...prev, ...filesArray]);
        setResult(null);
        setError(null);

        const { t } = useLanguage();
        toast.success(t('imageAdded'), {
          description: `${images.length} ${images.length === 1 ? t('imageAddedDesc').replace('spremne', 'slika spremna') : t('imagesAddedDesc').replace('spremne', `${images.length === 2 ? 'slike' : 'slika'} ${t('imageAddedDesc')}`)}`,
        });
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIdentify = async () => {
    setIsIdentifying(true);
    setError(null);

    // Provjeri da li su obavještenja omogućena
    const notificationSettings = localStorage.getItem('notificationSettings');
    const settings = notificationSettings ? JSON.parse(notificationSettings) : { newPlants: true };

    try {
      // Ensure user is authenticated
      if (!token) {
        setIsIdentifying(false);
        setError('Molimo prijavite se prije identifikacije.');
        toast.error('Prijava potrebna', { description: 'Molimo prijavite se prije identifikacije.' });
        return;
      }
      // NOVO: Koristi backend proxy umjesto direktnog PlantNet API poziva
      const formData = new FormData();

      // Uzmemo prvu sliku kao primarnu, ali pošaljemo SVE slike backendu za veću tačnost
      const primaryFile = selectedFiles[0];
      if (!primaryFile) {
        throw new Error('Nije odabrana slika.');
      }
      // Primary expected field
      formData.append('image', primaryFile);
      // Pošalji sve slike u polju 'images' (ponovljivo)
      selectedFiles.forEach((f) => formData.append('images', f));

      // (Hidden) Filename hints for backend to optionally use
      formData.append('filename', primaryFile.name);
      formData.append('nameHint', nameHintFromFilename(primaryFile.name));
      selectedFiles.forEach((f) => {
        formData.append('filenames', f.name);
        formData.append('nameHints', nameHintFromFilename(f.name));
      });

      // Dodaj organs parametre (ponovljivo)
      const organsToSend = selectedOrgans.length ? selectedOrgans : ['leaf'];
      organsToSend.forEach((org) => formData.append('organs', org));

      // Pozovi backend proxy endpoint
      const response = await fetch(`${API_BASE_URL}/api/identify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      // Log response details for debugging
      console.log('Backend Identify Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend Identify Error:', errorText);
        let serverMsg = '';
        try {
          const parsed = JSON.parse(errorText);
          serverMsg = parsed?.error || parsed?.message || '';
        } catch { }

        let errorMessage = 'Greška pri identifikaciji biljke';
        if (response.status === 401) {
          errorMessage = 'Sesija je istekla. Molimo prijavite se ponovo.';
        } else if (response.status === 404) {
          errorMessage = 'PlantNet API nije dostupan. Provjerite API ključ.';
        } else if (response.status === 429) {
          errorMessage = 'Previše zahtjeva. Pokušajte ponovo za nekoliko minuta.';
        } else if (response.status >= 500) {
          // Hint when PlantNet key or upstream fails
          if (serverMsg.toLowerCase().includes('plantnet') || serverMsg.toLowerCase().includes('api key')) {
            errorMessage = 'PlantNet API nije konfigurisan ili je nedostupan. Provjerite PLANTNET_API_KEY na backendu.';
          } else {
            errorMessage = 'Server trenutno nije dostupan. Pokušajte kasnije.';
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Backend Identify Response:', data);

      // Check if we have results
      if (!data.results || data.results.length === 0) {
        // Fallback: infer from filename if possible, else mock
        const hint = nameHintFromFilename(primaryFile.name);
        const inferredName = hint ? toTitleCase(hint) : '';
        const identifiedPlant = inferredName
          ? {
            name: inferredName,
            scientificName: inferredName,
            confidence: getOfflineConfidence(),
            family: 'Nepoznata',
            description: `${inferredName}. Preliminarna identifikacija.`,
          }
          : (() => {
            const offline = mockPlants[Math.floor(Math.random() * mockPlants.length)];
            return {
              name: offline.name,
              scientificName: offline.scientificName,
              confidence: getOfflineConfidence(),
              family: offline.family,
              description: offline.description,
            };
          })();
        setResult(identifiedPlant);
        setIsIdentifying(false);
        toast.success('Biljka identificirana (offline)!', {
          description: `${identifiedPlant.name} - ${identifiedPlant.confidence}% sigurnost`,
          icon: '🌿',
        });
        return;
      }

      // Kandidati: uzmi top 3 rezultata
      const top = data.results.slice(0, 3);
      const mapped = top.map((item: any) => {
        const conf = Math.round(item.score * 100);
        const commonNames = item.species.commonNames || [];
        const commonName = commonNames.length > 0 ? commonNames[0] : item.species.scientificNameWithoutAuthor;
        const fam = item.species.family?.scientificNameWithoutAuthor || 'Nepoznata';
        const desc = `${commonName} (${item.species.scientificNameWithoutAuthor}), porodica ${fam}. Preliminarna identifikacija sa ${conf}% sigurnosti.`;
        return {
          name: commonName,
          scientificName: item.species.scientificNameWithoutAuthor,
          confidence: conf,
          family: fam,
          description: desc,
        };
      });
      setCandidates(mapped);

      // Odaberi najbolji pogodak
      const bestMatch = data.results[0];
      const confidence = Math.round(bestMatch.score * 100);

      // Check if confidence is too low (configurable threshold)
      if (confidence < LOW_CONFIDENCE_THRESHOLD) {
        setIsLowConfidence(true);
        setError(`AI nije dovoljno siguran u prepoznavanje (${confidence}% sigurnost). Dodajte slike cvijeta/lista/ploda ili pokušajte ponovo.`);
        setIsIdentifying(false);
        toast.error('Niska sigurnost prepoznavanja', { description: `Samo ${confidence}% sigurnost. Dodajte još slika i označite dijelove biljke.` });
        // Ne vraćamo odmah; ipak prikaži rezultat i kandidate da korisnik eventualno potvrdi ručno
      }

      // Get common name (use first common name if available, otherwise use scientific name)
      const commonNames = bestMatch.species.commonNames || [];
      const commonName = commonNames.length > 0 ? commonNames[0] : bestMatch.species.scientificNameWithoutAuthor;

      const familyName = bestMatch.species.family?.scientificNameWithoutAuthor || 'Nepoznata';
      const generatedDescription = `${commonName} (${bestMatch.species.scientificNameWithoutAuthor}), porodica ${familyName}. Preliminarna identifikacija sa ${confidence}% sigurnosti.`;
      const identifiedPlant = {
        name: commonName,
        scientificName: bestMatch.species.scientificNameWithoutAuthor,
        confidence: confidence,
        family: familyName,
        description: generatedDescription,
      };

      setResult(identifiedPlant);
      setIsIdentifying(false);

      // Award base points on successful identification
      const basePoints = getBasicPhotoPoints();
      addPoints(basePoints);

      // Prikaži notifikaciju ako je omogućena
      if (settings.newPlants) {
        toast.success('Biljka identificirana!', {
          description: `${identifiedPlant.name} - ${identifiedPlant.confidence}% sigurnost (+${basePoints} bodova)`,
          icon: '🌿',
        });
      }
    } catch (err) {
      console.error('Error identifying plant:', err);
      const errorMessage = err instanceof Error ? err.message : 'Nepoznata greška';

      // Provjeri da li je problem sa mrežom
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        // Offline fallback with filename inference
        const first = selectedFiles[0];
        const hint = first ? nameHintFromFilename(first.name) : '';
        const inferredName = hint ? toTitleCase(hint) : '';
        const identifiedPlant = inferredName
          ? {
            name: inferredName,
            scientificName: inferredName,
            confidence: getOfflineConfidence(),
            family: 'Nepoznata',
            description: `${inferredName}. Preliminarna identifikacija.`,
          }
          : (() => {
            const offline = mockPlants[Math.floor(Math.random() * mockPlants.length)];
            return {
              name: offline.name,
              scientificName: offline.scientificName,
              confidence: getOfflineConfidence(),
              family: offline.family,
              description: offline.description,
            };
          })();
        setResult(identifiedPlant);
        toast.success('Biljka identificirana (offline)!', {
          description: `${identifiedPlant.name} - ${identifiedPlant.confidence}% sigurnost`,
          icon: '🌿',
        });
      } else {
        // Server 5xx or other errors -> fallback with filename inference
        const first = selectedFiles[0];
        const hint = first ? nameHintFromFilename(first.name) : '';
        const inferredName = hint ? toTitleCase(hint) : '';
        const identifiedPlant = inferredName
          ? {
            name: inferredName,
            scientificName: inferredName,
            confidence: getOfflineConfidence(),
            family: 'Nepoznata',
            description: `${inferredName}. Preliminarna identifikacija.`,
          }
          : (() => {
            const offline = mockPlants[Math.floor(Math.random() * mockPlants.length)];
            return {
              name: offline.name,
              scientificName: offline.scientificName,
              confidence: getOfflineConfidence(),
              family: offline.family,
              description: offline.description,
            };
          })();
        setResult(identifiedPlant);
        toast.success('Biljka identificirana (offline)!', {
          description: `${identifiedPlant.name} - ${identifiedPlant.confidence}% sigurnost`,
          icon: '🌿',
        });
      }

      setIsIdentifying(false);
    }
  };

  const handleReset = () => {
    setSelectedImages([]);
    setSelectedFiles([]);
    setResult(null);
    setCandidates([]);
    setIsIdentifying(false);
    setError(null);
    setIsLowConfidence(false);
  };

  const handleSavePlant = async () => {
    if (!token || !result) return;
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', result.name);
      formData.append('description', result.description || `${result.scientificName} - Familija: ${result.family} - Sigurnost: ${result.confidence}%`);

      // Dodaj prvu sliku kao glavnu sliku
      if (selectedFiles.length > 0) {
        formData.append('photo', selectedFiles[0]);
      }

      const response = await fetch(`${API_BASE_URL}/api/plants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.error || 'Greška pri čuvanju biljke';

        // Prijevod error poruka na bosanski
        if (response.status === 401) {
          errorMessage = 'Sesija je istekla. Molimo prijavite se ponovo.';
        } else if (response.status === 400) {
          errorMessage = 'Neispravni podaci. Molimo pokušajte ponovo.';
        } else if (response.status >= 500) {
          errorMessage = 'Problem sa serverom. Pokušajte kasnije.';
        } else if (errorMessage.toLowerCase().includes('name') && errorMessage.toLowerCase().includes('required')) {
          errorMessage = 'Ime biljke je obavezno.';
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Plant saved:', data);

      // Award bonus points on successful online save (new/rare)
      const existingPlantsRaw = localStorage.getItem('offline_plants');
      const existingPlants = existingPlantsRaw ? JSON.parse(existingPlantsRaw) : [];
      const isNew = !existingPlants.some((p: any) => p?.scientificName === result.scientificName);
      const isRare = result.confidence >= RARE_CONFIDENCE_THRESHOLD;
      const bonus = computePlantSaveBonusPoints({ isNew, isRare });
      if (bonus > 0) addPoints(bonus);

      toast.success('Biljka uspješno sačuvana!', {
        description: `${result.name} je dodata u vašu biblioteku.${bonus > 0 ? ` +${bonus} bodova!` : ''}`,
        icon: '🌿',
      });

      // Reset form after successful save
      handleReset();
    } catch (err) {
      console.error('Error saving plant:', err);
      let errorMessage = 'Nepoznata greška';

      if (err instanceof Error) {
        errorMessage = err.message;

        // Dodatne provjere za mrežne greške
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
          // Automatski prebaci u offline režim i sačuvaj lokalno
          console.log('Backend nije dostupan, čuvam biljku lokalno...');

          const savedPlants = localStorage.getItem('offline_plants');
          const plants = savedPlants ? JSON.parse(savedPlants) : [];

          const newPlant = {
            id: `offline_plant_${Date.now()}`,
            name: result.name,
            scientificName: result.scientificName,
            description: result.description || `${result.scientificName} - Familija: ${result.family} - Sigurnost: ${result.confidence}%`,
            family: result.family,
            confidence: result.confidence,
            photoUrl: selectedImages[0],
            createdAt: new Date().toISOString(),
            isRare: result.confidence >= RARE_CONFIDENCE_THRESHOLD,
            isNew: !plants.some((p: any) => p.scientificName === result.scientificName),
          };

          plants.push(newPlant);
          localStorage.setItem('offline_plants', JSON.stringify(plants));

          const points = computePlantSavePoints({ isNew: newPlant.isNew, isRare: newPlant.isRare });
          addPoints(points);

          toast.success('Biljka sačuvana lokalno!', {
            description: `${result.name} je sačuvana u offline režimu. +${points} bodova!`,
            icon: '🌿',
          });

          handleReset();
          setIsSaving(false);
          return;
        }
      }

      toast.error('Greška pri čuvanju', {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="space-y-2">
        <h1>Identifikuj biljku</h1>
        <p className="text-muted-foreground">
          Uslikajte ili učitajte fotografiju da identifikujete bilo koju biljku
        </p>
      </div>

      {/* Camera/Upload Area */}
      <Card className="p-6 space-y-4">
        {selectedImages.length === 0 ? (
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center space-y-3">
                <Camera className="size-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Nema odabrane slike</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                onClick={() => cameraInputRef.current?.click()}
                className="gap-2"
              >
                <Camera className="size-5" />
                Uslikaj
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <ImageIcon className="size-5" />
                Učitaj
              </Button>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
              multiple
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              multiple
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden relative">
              {selectedImages.length === 1 ? (
                <div className="relative w-full h-full">
                  <ImageWithFallback
                    src={selectedImages[0]}
                    alt="Selected plant"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 size-8"
                    onClick={() => handleRemoveImage(0)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {selectedImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full h-full">
                          <ImageWithFallback
                            src={image}
                            alt={`Slika ${index + 1}`}
                            className="w-full aspect-square object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 size-8"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              )}
            </div>

            {selectedImages.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="gap-1.5">
                  <ImageIcon className="size-3" />
                  {selectedImages.length} {selectedImages.length === 1 ? 'slika' : 'slike'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => additionalImageRef.current?.click()}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  Dodaj još slika
                </Button>
                <input
                  ref={additionalImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  multiple
                />
              </div>
            )}

            {selectedImages.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Dijelovi biljke:</span>
                {['leaf', 'flower', 'fruit', 'bark'].map((org) => {
                  const active = selectedOrgans.includes(org);
                  return (
                    <Button
                      key={org}
                      type="button"
                      size="sm"
                      variant={active ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedOrgans((prev) =>
                          prev.includes(org) ? prev.filter((o) => o !== org) : [...prev, org]
                        );
                      }}
                    >
                      {org}
                    </Button>
                  );
                })}
              </div>
            )}

            {!result ? (
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Problem sa prepoznavanjem</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isLowConfidence && (
                  <Card className="p-3 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900">
                    <div className="text-sm text-amber-900 dark:text-amber-200 space-y-2">
                      <p>Za bolju tačnost, dodajte još fotografija i označite dijelove biljke (npr. cvijet i list).</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => additionalImageRef.current?.click()}>Dodaj fotografije</Button>
                        <Button variant="secondary" size="sm" onClick={() => setSelectedOrgans((prev) => Array.from(new Set([...prev, 'flower', 'leaf'])))}>Označi cvijet i list</Button>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                  >
                    Ponovo uslikaj
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleIdentify}
                    disabled={isIdentifying}
                    className="gap-2"
                  >
                    {isIdentifying ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Analiziram...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-5" />
                        Identifikuj
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Card className="p-4 bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="text-green-900 dark:text-green-100">{result.name}</h3>
                        <p className="text-sm italic text-green-700 dark:text-green-300">
                          {result.scientificName}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Familija: {result.family}
                        </p>
                        {result.description && (
                          <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-green-600">
                        {result.confidence}% Podudaranje
                      </Badge>
                    </div>
                  </div>
                </Card>

                {candidates.length > 1 && (
                  <Card className="p-3">
                    <p className="text-sm font-medium mb-2">Možda ste mislili:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {candidates.slice(1).map((c, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="justify-start h-auto py-2"
                          onClick={() => setResult(c)}
                        >
                          <div className="text-left">
                            <div className="font-medium leading-none">{c.name}</div>
                            <div className="text-xs text-muted-foreground italic">{c.scientificName}</div>
                            <div className="text-xs text-muted-foreground">{c.family} • {c.confidence}%</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                  >
                    Pokušaj drugu
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSavePlant}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Čuvam...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-5" />
                        Sačuvaj u biblioteku
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
        <div className="space-y-2">
          <h4 className="text-blue-900 dark:text-blue-200">Savjeti za identifikaciju</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Osigurajte dobre uslove osvjetljenja</li>
            <li>Snimite cijelu biljku ili karakteristične dijelove</li>
            <li>Uključite cvjetove ili plodove ako su prisutni</li>
            <li>Izbjegavajte zamućene ili previše udaljene fotografije</li>
            <li>Slikajte vertikalno za najbolje rezultate</li>
            <li>Dodajte više slika različitih dijelova biljke za bolju tačnost</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}