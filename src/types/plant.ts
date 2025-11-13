export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  family: string;
  images: string[]; // Niz slika biljke
  description: string;
  capturedAt: string; // Datum i vrijeme fotografisanja
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  funFact: string; // Zanimljiva činjenica o biljci
  season: string; // Sezonska dostupnost
  rarity: string; // Rijetkost biljke
  careLevel?: 'Easy' | 'Medium' | 'Hard';
}