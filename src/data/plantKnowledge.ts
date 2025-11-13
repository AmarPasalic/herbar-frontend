// Minimal local mapping to enrich filename-based identification fallbacks
// Extend as needed
export type PlantInfo = {
  common: string;
  scientific: string;
  family: string;
  description: string;
  aliases?: string[]; // lowercase aliases to match filenames
};

const DB: PlantInfo[] = [
  {
    common: 'Tratinca',
    scientific: 'Bellis perennis',
    family: 'Asteraceae',
    description: 'Tratinka (Bellis perennis) je niska višegodišnja biljka sa bijelim laticama i žutim diskom, česta na travnjacima i livadama.',
    aliases: ['tratincica', 'tratinka', 'bellis', 'daisy']
  },
  {
    common: 'Visibaba',
    scientific: 'Galanthus nivalis',
    family: 'Amaryllidaceae',
    description: 'Visibaba (Galanthus nivalis) je rana proljetna biljka sa visećim bijelim cvjetovima, često se pojavljuje dok je tlo još hladno.',
    aliases: ['visibaba', 'galanthus']
  },
  {
    common: 'Lavanda',
    scientific: 'Lavandula angustifolia',
    family: 'Lamiaceae',
    description: 'Lavanda (Lavandula angustifolia) je mirisna polugrmovita biljka sa ljubičastim cvatovima i uskim listovima, često korištena u aromaterapiji.',
    aliases: ['lavanda', 'lavandula']
  },
  {
    common: 'Paprat',
    scientific: 'Pteridophyta',
    family: 'Polypodiaceae',
    description: 'Paprat je skupina biljaka sa perastim listovima (frondovima) koje se razmnožavaju sporama, bez cvjetova i sjemena.',
    aliases: ['paprat', 'fern']
  }
];

export function lookupPlantByHint(hint: string): PlantInfo | null {
  if (!hint) return null;
  const h = hint.trim().toLowerCase();
  // Exact alias/common match
  for (const p of DB) {
    if (p.common.toLowerCase() === h || p.scientific.toLowerCase() === h) return p;
    if (p.aliases?.includes(h)) return p;
  }
  // Contains match
  for (const p of DB) {
    if (p.common.toLowerCase().includes(h) || h.includes(p.common.toLowerCase())) return p;
    if (p.scientific.toLowerCase().includes(h) || h.includes(p.scientific.toLowerCase())) return p;
    if (p.aliases?.some(a => h.includes(a))) return p;
  }
  return null;
}
