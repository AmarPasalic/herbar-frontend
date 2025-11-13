import { Plant } from "../types/plant";

export const mockPlants: Plant[] = [
  {
    id: "1",
    name: "Paprat",
    scientificName: "Asplenium nidus",
    family: "Aspleniaceae",
    images: [
      "https://images.unsplash.com/photo-1722554086475-f11257a9eb6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJuJTIwcGxhbnQlMjBjbG9zZXxlbnwxfHx8fDE3NjAwNDE3NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmZXJuJTIwcGxhbnQlMjBjbG9zZXxlbnwxfHx8fDE3NjAwNDE3NzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description:
      "Tropska paprat sa jednostavnim, jarko zelenim listovima. Porijeklom iz tropskih regija Azije, Afrike i Australije.",
    capturedAt: "2025-10-05T14:23:00",
    location: {
      lat: 40.7128,
      lng: -74.006,
      name: "Centralni park, NYC",
    },
    funFact: "Može pročistiti zrak u zatvorenim prostorijama",
    season: "Proljeće do rane jeseni",
    rarity: "Česta",
    careLevel: "Medium",
  },
  {
    id: "2",
    name: "Eheverija",
    scientificName: "Echeveria elegans",
    family: "Crassulaceae",
    images: [
      "https://images.unsplash.com/photo-1550207477-85f418dc3448?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjdWxlbnQlMjBwbGFudHxlbnwxfHx8fDE3NjAwNDE3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzdWNjdWxlbnQlMjBwbGFudHxlbnwxfHx8fDE3NjAwNDE3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzdWNjdWxlbnQlMjBwbGFudHxlbnwxfHx8fDE3NjAwNDE3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description:
      "Sukulent u obliku rozete rodom iz polupustinjskih područja Meksika. Poznata po prekrasnim plavo-zelenim listovima.",
    capturedAt: "2025-10-03T10:15:00",
    location: {
      lat: 40.7589,
      lng: -73.9851,
      name: "Times Square bašta",
    },
    funFact: "Otporna na sušu i zahtijeva malo vode",
    season: "Proljeće do rane jeseni",
    rarity: "Uobičajena",
    careLevel: "Easy",
  },
  {
    id: "3",
    name: "Lavanda",
    scientificName: "Lavandula angustifolia",
    family: "Lamiaceae",
    images: [
      "https://images.unsplash.com/photo-1541927634837-a7d5c4892527?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXZlbmRlciUyMGZsb3dlcnN8ZW58MXx8fHwxNzU5OTg2Nzk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description:
      "Cvjetna biljka iz porodice metvica, cijenjena zbog mirisnih ljubičastih cvjetova i aromatičnih svojstava.",
    capturedAt: "2025-10-01T16:45:00",
    location: {
      lat: 40.7614,
      lng: -73.9776,
      name: "Botanička bašta Brooklyn",
    },
    funFact: "Prirodni repelent protiv komaraca",
    season: "Ljeto (juni - avgust)",
    rarity: "Rijetka",
    careLevel: "Easy",
  },
  {
    id: "4",
    name: "Monstera",
    scientificName: "Monstera deliciosa",
    family: "Araceae",
    images: [
      "https://images.unsplash.com/photo-1653404809389-f370ea4310dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25zdGVyYSUyMHBsYW50fGVufDF8fHx8MTc2MDA0MDc1OHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb25zdGVyYSUyMHBsYW50fGVufDF8fHx8MTc2MDA0MDc1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description:
      "Vrsta cvjetne biljke porijeklom iz tropskih šuma. Poznata po velikim, prirodno perforiranim listovima.",
    capturedAt: "2025-09-28T09:30:00",
    location: {
      lat: 40.758,
      lng: -73.9855,
      name: "Kućna bašta",
    },
    funFact: "Rupe u listovima pomažu biljci da izdrži jake vjetrove",
    season: "Proljeće do kasne jeseni",
    rarity: "Uobičajena",
    careLevel: "Easy",
  },
  {
    id: "5",
    name: "Bosiljak",
    scientificName: "Ocimum basilicum",
    family: "Lamiaceae",
    images: [
      "https://images.unsplash.com/photo-1567454932354-6cafa1ca23e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJicyUyMGdhcmRlbnxlbnwxfHx8fDE3NjAwNDE3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description:
      "Kulinarsko bilje iz porodice Lamiaceae. Nježna biljka koja se široko koristi u kuhinjama širom svijeta.",
    capturedAt: "2025-09-25T13:20:00",
    location: {
      lat: 40.7489,
      lng: -73.968,
      name: "Bašta za kuhanje",
    },
    funFact: "Može odbiti muhe i komarce",
    season: "Ljeto (maj - septembar)",
    rarity: "Vrlo česta",
    careLevel: "Easy",
  },
  {
    id: "6",
    name: "Vrtna ruža",
    scientificName: "Rosa × hybrida",
    family: "Rosaceae",
    images: [
      "https://images.unsplash.com/photo-1622818171279-fe0b6a336835?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBnYXJkZW58ZW58MXx8fHwxNzU5OTM5MDQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxyb3NlJTIwZmxvd2VyfGVufDF8fHx8MTc1OTkzOTA0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description:
      "Hibridne ruže uzgajane za svoju ljepotu i miris, popularne u baštama širom svijeta.",
    capturedAt: "2025-09-20T11:00:00",
    location: {
      lat: 40.7812,
      lng: -73.9665,
      name: "Javna bašta",
    },
    funFact: "Postoji preko 30,000 sorti ruža",
    season: "Proljeće do kasne jeseni",
    rarity: "Česta",
    careLevel: "Medium",
  },
];