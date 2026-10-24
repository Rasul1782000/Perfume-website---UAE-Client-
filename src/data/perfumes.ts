export type ScentFamily = 'Woody' | 'Floral' | 'Amber' | 'Citrus' | 'Gourmand' | 'Leather';

export interface PerfumeItem {
  id: string;
  name: string;
  subtitle: string;
  price: number; // 50ml price
  volumePrices: {
    '30ml': number;
    '50ml': number;
    '100ml': number;
  };
  concentration: 'Extrait de Parfum' | 'Eau de Parfum' | 'Eau de Toilette';
  concentrationPct: number;
  family: ScentFamily;
  image: string;
  description: string;
  perfumer: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  longevity: string;
  sillage: 'Intimate Skin Scent' | 'Moderate Trail' | 'Enveloping Aura';
  seasons: string[];
  badge?: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
}

export const PERFUMES_LIST: PerfumeItem[] = [
  {
    id: 'santal-mystique',
    name: 'Santal Mystique',
    subtitle: 'Creamy Australian Sandalwood & Smoked Cardamom',
    price: 260,
    volumePrices: {
      '30ml': 185,
      '50ml': 260,
      '100ml': 365,
    },
    concentration: 'Eau de Parfum',
    concentrationPct: 22,
    family: 'Woody',
    image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
    description:
      'An intoxicating, meditative harmony of sustainably sourced Mysore and Australian sandalwood, enveloped in powdery Florentine iris, green papyrus, and radiant cardamom. A quiet yet commanding tactile warmth that fuses intimately with the skin.',
    perfumer: 'Laurent Méric, Master Perfumer',
    notes: {
      top: ['Green Cardamom', 'Violet Leaf', 'Calabrian Bergamot'],
      heart: ['Florentine Orris', 'Egyptian Papyrus', 'Cedarwood Atlas'],
      base: ['Australian Sandalwood', 'White Ambergris', 'Smoked Leather'],
    },
    longevity: '10–12 Hours',
    sillage: 'Moderate Trail',
    seasons: ['All Seasons', 'Evening', 'Signature'],
    badge: 'Maison Bestseller',
    rating: 4.95,
    reviewsCount: 142,
    inStock: true,
  },
  {
    id: 'velvet-rose-noire',
    name: 'Velvet Rose Noire',
    subtitle: 'Smoked Damask Rose & Rare Cambodian Oud',
    price: 320,
    volumePrices: {
      '30ml': 225,
      '50ml': 320,
      '100ml': 440,
    },
    concentration: 'Extrait de Parfum',
    concentrationPct: 30,
    family: 'Floral',
    image: '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
    description:
      'A nocturnal, chiaroscuro celebration of the deep red Damask rose harvested at dawn in Grasse, steeped in aged Cambodian oud, dark black currant liqueur, and velvety patchouli. Deep, seductive, and undeniably opulent.',
    perfumer: 'Camille Saint-Honoré',
    notes: {
      top: ['Cassis Nectar', 'Pink Peppercorn', 'Saffron Threads'],
      heart: ['Grasse Centifolia Rose', 'Damask Rose Absolute', 'Cistus Labdanum'],
      base: ['Smoked Agarwood (Oud)', 'Indonesian Patchouli', 'Castoreum Accord'],
    },
    longevity: '14–16 Hours',
    sillage: 'Enveloping Aura',
    seasons: ['Autumn', 'Winter', 'Nocturne'],
    badge: 'Pure Extrait',
    rating: 4.98,
    reviewsCount: 98,
    inStock: true,
  },
  {
    id: 'citrus-neroli-blanc',
    name: 'Citrus Neroli Blanc',
    subtitle: 'Sunlit Bergamot, Bitter Orange & Neroli Blossom',
    price: 210,
    volumePrices: {
      '30ml': 150,
      '50ml': 210,
      '100ml': 295,
    },
    concentration: 'Eau de Parfum',
    concentrationPct: 18,
    family: 'Citrus',
    image: '/src/assets/images/perfume_bergamot_flacon_1792865211919.jpg',
    description:
      'The morning breeze through a Mediterranean citrus orchard overlooking the cliffs of Positano. Sparkling Calabrian bergamot zest and hand-pressed orange blossom meet crushed mint, petitgrain, and sun-bleached driftwood.',
    perfumer: 'Matteo Bellini, Grasse',
    notes: {
      top: ['Calabrian Bergamot', 'Bitter Orange Peel', 'Crisp Mandarin'],
      heart: ['Tunisian Neroli', 'Petitgrain Paraguay', 'Orange Blossom Absolute'],
      base: ['White Cedar', 'Clean Linen Musk', 'Ambroxan'],
    },
    longevity: '8–10 Hours',
    sillage: 'Moderate Trail',
    seasons: ['Spring', 'Summer', 'Daytime'],
    badge: 'Solar Edition',
    rating: 4.91,
    reviewsCount: 114,
    inStock: true,
  },
  {
    id: 'tonka-vanille-amber',
    name: 'Tonka & Vanille Ambrée',
    subtitle: 'Wild Bourbon Vanilla, Roasted Tonka & Cured Tobacco',
    price: 285,
    volumePrices: {
      '30ml': 195,
      '50ml': 285,
      '100ml': 390,
    },
    concentration: 'Extrait de Parfum',
    concentrationPct: 28,
    family: 'Gourmand',
    image: '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
    description:
      'Far from confectionery sweet, this is an adult, smoky study in dark Madagascar vanilla bean pods macerated in vintage cognac barrels, infused with roasted tonka beans, blonde tobacco leaf, and rich benzoin tears.',
    perfumer: 'Éléonore Dupuis',
    notes: {
      top: ['Aged Cognac', 'Cinnamon Bark', 'Wild Plum'],
      heart: ['Madagascar Bourbon Vanilla', 'Roasted Tonka Bean', 'Tobacco Leaf'],
      base: ['Benzoin Siam', 'Golden Amber', 'Precious Woods'],
    },
    longevity: '12–15 Hours',
    sillage: 'Enveloping Aura',
    seasons: ['Autumn', 'Winter', 'Cozy Nights'],
    badge: 'Award Winner',
    rating: 4.96,
    reviewsCount: 167,
    inStock: true,
  },
  {
    id: 'aurore-doree',
    name: 'Aurore Dorée',
    subtitle: 'Liquid Solar Iris, Golden Mimosa & White Truffle',
    price: 340,
    volumePrices: {
      '30ml': 240,
      '50ml': 340,
      '100ml': 480,
    },
    concentration: 'Extrait de Parfum',
    concentrationPct: 32,
    family: 'Amber',
    image: '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
    description:
      'The house’s crowning jewel. Aurore Dorée captures the golden hour light spilling across the stone facades of Paris. Precious Tuscan orris butter is bathed in mimosa blossoms, crystallized honey, and rare Mysore sandalwood.',
    perfumer: 'Laurent Méric & Henriette Cassan',
    notes: {
      top: ['Italian Bergamot', 'Star Anise', 'White Truffle Accord'],
      heart: ['Tuscan Orris Butter', 'French Mimosa', 'Honey Absolute'],
      base: ['Aged Sandalwood', 'Cashmeran', 'Bourbon Vanilla Bean'],
    },
    longevity: '16+ Hours',
    sillage: 'Enveloping Aura',
    seasons: ['All Seasons', 'Grand Evening', 'Ceremonial'],
    badge: 'Maison Masterpiece',
    rating: 5.0,
    reviewsCount: 82,
    inStock: true,
  },
  {
    id: 'cuir-sauvage',
    name: 'Cuir Sauvage',
    subtitle: 'Florentine Tannery Leather, Wild Thyme & Saffron',
    price: 275,
    volumePrices: {
      '30ml': 190,
      '50ml': 275,
      '100ml': 380,
    },
    concentration: 'Eau de Parfum',
    concentrationPct: 24,
    family: 'Leather',
    image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
    description:
      'A tribute to historical Tuscan saddleries and leather craftsmanship. Raw, tactile leather softened by sweet wild raspberries, medicinal saffron, and green herbal thyme, anchored by smoky birch tar and animalic amber.',
    perfumer: 'Marco Vieri',
    notes: {
      top: ['Wild Thyme', 'Kashmir Saffron', 'Wild Raspberry'],
      heart: ['Florentine Leather', 'Night-Blooming Jasmine', 'Olibanum'],
      base: ['Birch Tar', 'Black Suede', 'Ambergris'],
    },
    longevity: '12 Hours',
    sillage: 'Moderate Trail',
    seasons: ['Autumn', 'Winter', 'Bold Statement'],
    rating: 4.89,
    reviewsCount: 74,
    inStock: true,
  },
];

export const DISCOVERY_SAMPLES = [
  { id: 'sample-santal', name: 'Santal Mystique (2ml Vial)', family: 'Woody' },
  { id: 'sample-rose', name: 'Velvet Rose Noire (2ml Vial)', family: 'Floral' },
  { id: 'sample-citrus', name: 'Citrus Neroli Blanc (2ml Vial)', family: 'Citrus' },
  { id: 'sample-vanilla', name: 'Tonka & Vanille (2ml Vial)', family: 'Gourmand' },
  { id: 'sample-aurore', name: 'Aurore Dorée (2ml Vial)', family: 'Amber' },
];
