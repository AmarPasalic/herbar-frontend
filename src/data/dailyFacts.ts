// Zanimljive činjenice o biljkama koje se rotiraju dnevno
export const dailyFacts = [
  {
    id: 1,
    emoji: '🌳',
    fact: 'Najstarije drvo na svijetu je bor Bristlecone Pine koji ima preko 5.000 godina i nalazi se u Kaliforniji!'
  },
  {
    id: 2,
    emoji: '🌺',
    fact: 'Rafflesia arnoldii proizvodi najveći cvijet na svijetu - može dosegnuti do 1 metar u prečniku i težiti 10kg!'
  },
  {
    id: 3,
    emoji: '🌿',
    fact: 'Bambus je najbrže rastuća biljka na svijetu - neki narastu i do 91cm za samo 24 sata!'
  },
  {
    id: 4,
    emoji: '🌵',
    fact: 'Kaktusi mogu preživjeti do 2 godine bez vode skladištenjem vode u svojim debelim stablima i listovima.'
  },
  {
    id: 5,
    emoji: '🍄',
    fact: 'Najveći živi organizam na Zemlji je gljiva Armillaria ostoyae u Oregonu koja pokriva oko 9 km²!'
  },
  {
    id: 6,
    emoji: '🌻',
    fact: 'Suncokret prati kretanje sunca tokom dana, proces koji se zove heliotropizam, ali samo dok je mlad.'
  },
  {
    id: 7,
    emoji: '🌱',
    fact: 'Biljke mogu "čuti" vodu! Koreni biljaka mogu detektovati zvuk tečenja vode i rasti prema njemu.'
  },
  {
    id: 8,
    emoji: '🌲',
    fact: 'Drveće može komunicirati jedno sa drugim kroz mrežu gljiva u zemlji koja se naziva "Wood Wide Web"!'
  },
  {
    id: 9,
    emoji: '🌹',
    fact: 'Ruže postoje već najmanje 35 miliona godina! Pronađeni su fosili ruža stari milione godina.'
  },
  {
    id: 10,
    emoji: '🍀',
    fact: 'Četverolisna djetelina je rijetka mutacija - šansa da je pronađete je samo 1 u 10.000!'
  },
  {
    id: 11,
    emoji: '🌾',
    fact: 'Pšenica se prvi put počela uzgajati prije oko 10.000 godina i omogućila je razvoj civilizacije.'
  },
  {
    id: 12,
    emoji: '🌴',
    fact: 'Kokosova palma može rasti do 30 metara visine, a kokos može otploviti 110 dana po oceanu i još uvijek proklijati!'
  },
  {
    id: 13,
    emoji: '🌸',
    fact: 'Trešnjin cvijet (sakura) cvjeta samo 7-10 dana godišnje, što simbolizuje prolaznost života u japanskoj kulturi.'
  },
  {
    id: 14,
    emoji: '🌿',
    fact: 'Amazon šuma proizvodi 20% ukupnog kiseonika na Zemlji i često se naziva "pluća planete".'
  },
  {
    id: 15,
    emoji: '🥀',
    fact: 'Venera muharka može "računati" - zatvara se tek nakon što je dodirnuta dva puta u roku od 20 sekundi.'
  },
  {
    id: 16,
    emoji: '🌺',
    fact: 'Lotus cvijet može kontrolisati svoju temperaturu kao ljudi - održava 30-35°C da privuče insekte!'
  },
  {
    id: 17,
    emoji: '🍃',
    fact: 'Eukaliptus brzo raste i može narasti do 100 metara! Koristi se za proizvodnju papira i eteričnih ulja.'
  },
  {
    id: 18,
    emoji: '🌷',
    fact: 'U 17. vijeku u Holandiji, jedna lukovica tulipana mogla je koštati više od kuće - događaj poznat kao "Tulip Mania"!'
  },
  {
    id: 19,
    emoji: '🌼',
    fact: 'Nevena (Calendula) prati sunce i može predviđati kišu - zatvara svoje cvjetove prije kiše.'
  },
  {
    id: 20,
    emoji: '🎋',
    fact: 'Bambusova šuma može apsorbovati 35% više CO2 od obične šume istih dimenzija!'
  },
  {
    id: 21,
    emoji: '🌳',
    fact: 'Jedan hrast može proizvesti do 10 miliona žirova tokom svog života od 200+ godina!'
  },
  {
    id: 22,
    emoji: '🌿',
    fact: 'Nana je poznata više od 2000 godina i Grci su je koristili za svježe disanje nakon obroka.'
  },
  {
    id: 23,
    emoji: '🌵',
    fact: 'Saguaro kaktus može živjeti preko 200 godina i dostiže visinu do 12 metara!'
  },
  {
    id: 24,
    emoji: '🍂',
    fact: 'Lišće mijenja boju u jesen jer drveće prestaje proizvoditi hlorofil, otkrivajući druge pigmente.'
  },
  {
    id: 25,
    emoji: '🌸',
    fact: 'Orhideje su najraznovrsnija biljna porodica s preko 25.000 vrsta širom svijeta!'
  },
  {
    id: 26,
    emoji: '🌱',
    fact: 'Sjemenke nekih biljaka mogu ostati u stanju mirovanja i klijati nakon više od 2000 godina!'
  },
  {
    id: 27,
    emoji: '🌲',
    fact: 'Borove šišarke muških i ženskih biljaka rastu na istom drvetu, ali su obično na različitim granama.'
  },
  {
    id: 28,
    emoji: '🌺',
    fact: 'Hibiskus može imati cvjetove promjera do 30cm i koristi se za pravljenje čaja koji snižava krvni pritisak.'
  },
  {
    id: 29,
    emoji: '🍀',
    fact: 'Irski simbol djeteline (shamrock) koristi se još od svetog Patrika u 5. vijeku za objašnjavanje Svetog Trojstva.'
  },
  {
    id: 30,
    emoji: '🌿',
    fact: 'Aloe vera sadrži preko 75 aktivnih sastojaka i koristi se u medicini već 6000 godina!'
  },
  {
    id: 31,
    emoji: '🌼',
    fact: 'Maslačak je potpuno jestiv - od korijena do cvijeta - i bogat je vitaminima A, C i K!'
  }
];

// Funkcija koja vraća činjenicu dana na osnovu trenutnog datuma
export function getDailyFact() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const factIndex = dayOfYear % dailyFacts.length;
  return dailyFacts[factIndex];
}
