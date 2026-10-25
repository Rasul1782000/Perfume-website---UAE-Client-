export type ScentFamily = 'Woody' | 'Floral' | 'Amber' | 'Citrus' | 'Gourmand' | 'Leather' | 'Oud';
export type ScentOrigin = 'French Atelier' | 'Arabian Royal';

export interface PerfumeReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface BundleItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface PerfumeItem {
  id: string;
  name: string;
  arabicName?: string;
  subtitle: string;
  origin: ScentOrigin;
  originLabel: string;
  price: number; // 50ml price
  originalPrice?: number; // for deals
  volumePrices: {
    '30ml': number;
    '50ml': number;
    '100ml': number;
  };
  concentration: 'Extrait de Parfum' | 'Eau de Parfum';
  concentrationPct: number;
  family: ScentFamily;
  gender: 'Unisex' | 'Women' | 'Men';
  brand: 'Maison Aurelia Paris' | 'Aurelia Royal Al-Oud' | 'Atelier de Grasse' | 'Qasr Al-Aroma Dubai';
  image: string;
  hoverImage: string;
  galleryImages: string[];
  description: string;
  heritageStory: string;
  perfumer: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  longevity: string;
  sillage: 'Intimate Skin Scent' | 'Moderate Trail' | 'Enveloping Aura' | 'Imperial Grand Sillage';
  seasons: string[];
  badge?: string;
  hasRareIngredients?: boolean;
  rareIngredients?: string[];
  sustainablyHarvested?: boolean;
  dealOfTheDay?: boolean;
  dealEndsAt?: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  frequentlyBoughtWith?: BundleItem[];
  reviews: PerfumeReview[];
}

export const PERFUMES_LIST: PerfumeItem[] = [
  // 1. Arabian Royal Flagship: Royal Cambodian Dehn Al Oud
  {
    id: 'oud-imperial-royal',
    name: 'Oud Impérial Al-Malaki',
    arabicName: 'العود الإمبراطوري الملكي',
    subtitle: 'Wild Cambodian Agarwood, Taif Rose & Smoked Amber',
    origin: 'Arabian Royal',
    originLabel: 'Qasr Al-Aroma · Dubai & Muscat',
    price: 360,
    originalPrice: 420,
    volumePrices: {
      '30ml': 260,
      '50ml': 360,
      '100ml': 490,
    },
    concentration: 'Extrait de Parfum',
    concentrationPct: 32,
    family: 'Oud',
    gender: 'Unisex',
    brand: 'Aurelia Royal Al-Oud',
    image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
    hoverImage: '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
    galleryImages: [
      '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
      '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
    ],
    description:
      'A majestic homage to the royal courts of Arabia. Hand-distilled wild Cambodian agarwood cured for 18 years meets hand-plucked Taif roses, aged Omani frankincense, and warm golden ambergris. Rich, magnetic, and unforgettable.',
    heritageStory:
      'Formulated in collaboration between master perfumers in Grasse and Dubai. The raw agarwood is sustainably harvested from aged aquilaria trees in Southeast Asia and blended with sun-distilled mountain roses from Taif, Saudi Arabia.',
    perfumer: 'Sheikh Tariq Al-Mansoor & Laurent Méric',
    notes: {
      top: ['Royal Kashmir Saffron', 'Cardamom Pods', 'Smoked Incense'],
      heart: ['Taif Mountain Rose', 'Aged Cambodian Oud', 'Birch Wood'],
      base: ['Black Ambergris', 'Smoked Leather', 'Pure Musk Al-Ghazal'],
    },
    longevity: '18+ Hours (Eternal)',
    sillage: 'Imperial Grand Sillage',
    seasons: ['All Seasons', 'Royal Ceremonies', 'Evening'],
    badge: 'Arabian Royal Exclusive',
    hasRareIngredients: true,
    rareIngredients: ['Wild 18-Year Cambodian Agarwood', 'Taif Mountain Rose', 'Black Ambergris'],
    sustainablyHarvested: true,
    dealOfTheDay: true,
    rating: 4.99,
    reviewsCount: 184,
    inStock: true,
    stockCount: 12,
    frequentlyBoughtWith: [
      {
        id: 'bundle-bakhoor-malaki',
        name: 'Royal Bakhoor Incense Chips (50g)',
        price: 85,
        category: 'Home & Rituals',
        image: '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
      },
      {
        id: 'bundle-hair-mist-oud',
        name: 'Oud Impérial Silken Hair Mist (30ml)',
        price: 75,
        category: 'Hair Perfume',
        image: '/src/assets/images/perfume_bergamot_flacon_1792865211919.jpg',
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Fatima Al-Nuaimi',
        location: 'Dubai, UAE',
        rating: 5,
        date: 'October 18, 2026',
        title: 'Authentic royal Dehn Al Oud with Parisian finesse',
        comment:
          'The combination of real aged Cambodian oud with French maceration makes this the smoothest, most luxurious scent in my private collection. Lasts beyond 24 hours on abayas.',
        verifiedBuyer: true,
      },
      {
        id: 'rev-2',
        author: 'Jean-Luc Moreau',
        location: 'Paris, France',
        rating: 5,
        date: 'September 29, 2026',
        title: 'An absolute masterpiece of niche perfumery',
        comment:
          'Never have I smelled an oud so cleanly balanced with Taif rose. It radiates prestige without being aggressive.',
        verifiedBuyer: true,
      },
    ],
  },

  // 2. French Haute Parfumerie: Aurore Dorée Extrait
  {
    id: 'aurore-doree',
    name: 'Aurore Dorée Extrait',
    subtitle: 'Florentine Iris Butter, French Mimosa & Wild Honey',
    origin: 'French Atelier',
    originLabel: 'Palais-Royal · Paris & Grasse',
    price: 340,
    volumePrices: {
      '30ml': 240,
      '50ml': 340,
      '100ml': 480,
    },
    concentration: 'Extrait de Parfum',
    concentrationPct: 32,
    family: 'Amber',
    gender: 'Unisex',
    brand: 'Maison Aurelia Paris',
    image: '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
    hoverImage: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
    galleryImages: [
      '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
      '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
      '/src/assets/images/perfume_bergamot_flacon_1792865211919.jpg',
    ],
    description:
      'The crown jewel of French grand parfumerie. Aurore Dorée captures golden hour light spilling across the stone colonnades of Paris. Rare Tuscan iris butter is bathed in Provence mimosa blossoms, crystallized honey, and Mysore sandalwood.',
    heritageStory:
      'Distilled following an authentic 18th-century French formula. Iris rhizomes are cured for 3 full years in dark cellars before steam distillation, yielding pure orris butter valued above its weight in pure gold.',
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
    hasRareIngredients: true,
    rareIngredients: ['3-Year Aged Tuscan Orris Butter', 'Provence Mimosa Blossom'],
    sustainablyHarvested: true,
    rating: 5.0,
    reviewsCount: 96,
    inStock: true,
    stockCount: 15,
    frequentlyBoughtWith: [
      {
        id: 'bundle-atomizer-gold',
        name: 'Pocket Brass Flacon Atomizer (10ml)',
        price: 45,
        category: 'Travel Luxury',
        image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      },
      {
        id: 'bundle-candle-aurore',
        name: 'Aurore Dorée Bougie Parfumée (220g)',
        price: 80,
        category: 'Atelier Candle',
        image: '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
      },
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Eleanor Vance',
        location: 'New York, USA',
        rating: 5,
        date: 'October 12, 2026',
        title: 'The most sublime powdery iris I have ever experienced',
        comment:
          'Rich, buttery, solar, and aristocratic. People stop me on Madison Avenue to ask what perfume this is.',
        verifiedBuyer: true,
      },
    ],
  },

  // 3. French Classic: Velvet Rose Noire
  {
    id: 'velvet-rose-noire',
    name: 'Velvet Rose Noire',
    arabicName: 'وردة المخمل السوداء',
    subtitle: 'Grasse Centifolia Rose, Blackcurrant & Smoked Patchouli',
    origin: 'French Atelier',
    originLabel: 'Domaine de Manon · Grasse',
    price: 320,
    volumePrices: {
      '30ml': 225,
      '50ml': 320,
      '100ml': 440,
    },
    concentration: 'Extrait de Parfum',
    concentrationPct: 30,
    family: 'Floral',
    gender: 'Women',
    brand: 'Atelier de Grasse',
    image: '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
    hoverImage: '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
    galleryImages: [
      '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
      '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
    ],
    description:
      'A nocturnal chiaroscuro celebration of the deep red Rose de Mai harvested at dawn in Grasse, steeped in dark cassis nectar, aged patchouli, and a subtle touch of smoked wood. Velvety, intoxicating, and seductive.',
    heritageStory:
      'The roses are gathered by hand exclusively during the month of May between 6 AM and 9 AM to preserve the volatile morning dew notes before the Provençal sun warms the petals.',
    perfumer: 'Camille Saint-Honoré',
    notes: {
      top: ['Cassis Nectar', 'Pink Peppercorn', 'Saffron Threads'],
      heart: ['Grasse Centifolia Rose', 'Damask Rose Absolute', 'Cistus Labdanum'],
      base: ['Smoked Agarwood', 'Indonesian Patchouli', 'Amber Noir'],
    },
    longevity: '14–16 Hours',
    sillage: 'Enveloping Aura',
    seasons: ['Autumn', 'Winter', 'Nocturne'],
    badge: 'Pure Extrait',
    hasRareIngredients: true,
    rareIngredients: ['Dawn-Picked Centifolia Rose de Grasse', 'Damask Rose Absolute'],
    sustainablyHarvested: true,
    rating: 4.98,
    reviewsCount: 112,
    inStock: true,
    stockCount: 18,
    frequentlyBoughtWith: [
      {
        id: 'bundle-rose-body-oil',
        name: 'Huile Sèche Parfumée Velvet Rose (100ml)',
        price: 70,
        category: 'Body Care',
        image: '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
      },
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Soraia Al-Hashemi',
        location: 'Abu Dhabi, UAE',
        rating: 5,
        date: 'October 2, 2026',
        title: 'French rose poetry with Arabian depth',
        comment:
          'The cassis opening melts into the most divine dark rose. It projects magnificently and leaves an intoxicating sillage.',
        verifiedBuyer: true,
      },
    ],
  },

  // 4. Arabian Amber & Spice: Sultani Amber Al-Zafaran
  {
    id: 'sultani-amber-zafaran',
    name: 'Sultani Amber Al-Zafaran',
    arabicName: 'عنبر السلطان بالزعفران',
    subtitle: 'Golden Saffron Threads, Royal Amber & Ceylonese Cinnamon',
    origin: 'Arabian Royal',
    originLabel: 'Qasr Al-Aroma · Muscat & Riyadh',
    price: 295,
    originalPrice: 350,
    volumePrices: {
      '30ml': 210,
      '50ml': 295,
      '100ml': 415,
    },
    concentration: 'Extrait de Parfum',
    concentrationPct: 29,
    family: 'Amber',
    gender: 'Unisex',
    brand: 'Aurelia Royal Al-Oud',
    image: '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
    hoverImage: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
    galleryImages: [
      '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
      '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
    ],
    description:
      'Warm golden luxury inspired by Arabian palace evenings. A blazing opening of Kashmiri saffron and roasted cardamom settles into rich golden amber, dark vanilla beans, and sweet woods.',
    heritageStory:
      'Infused with red gold saffron threads steeped in aged resin tears for over nine months. An ancient Middle Eastern perfumery secret that yields unmatched warmth and projection.',
    perfumer: 'Mansoor Al-Husseini',
    notes: {
      top: ['Kashmiri Red Saffron', 'Blood Orange', 'Nutmeg'],
      heart: ['Royal Amber Resin', 'Ceylonese Cinnamon', 'Golden Myrrh'],
      base: ['Bourbon Vanilla Pod', 'Cedarwood Atlas', 'Dark Musks'],
    },
    longevity: '15–18 Hours',
    sillage: 'Imperial Grand Sillage',
    seasons: ['Autumn', 'Winter', 'Evenings'],
    badge: 'Deals of the Day',
    hasRareIngredients: true,
    rareIngredients: ['Kashmiri Red Gold Saffron Threads', 'Pure Amber Resin Tears'],
    sustainablyHarvested: true,
    dealOfTheDay: true,
    rating: 4.96,
    reviewsCount: 148,
    inStock: true,
    stockCount: 8,
    frequentlyBoughtWith: [
      {
        id: 'bundle-bakhoor-zafaran',
        name: 'Sultani Saffron Bakhoor Tablets',
        price: 65,
        category: 'Home Fragrance',
        image: '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
      },
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Abdullah Al-Kuwari',
        location: 'Doha, Qatar',
        rating: 5,
        date: 'October 14, 2026',
        title: 'Liquid gold in a flacon',
        comment:
          'The saffron and amber in this are sublime. Everyone in the majlis complimented me immediately.',
        verifiedBuyer: true,
      },
    ],
  },

  // 5. French Woody Masterpiece: Santal Mystique
  {
    id: 'santal-mystique',
    name: 'Santal Mystique',
    subtitle: 'Creamy Australian Sandalwood & Smoked Cardamom',
    origin: 'French Atelier',
    originLabel: 'Palais-Royal · Paris',
    price: 260,
    volumePrices: {
      '30ml': 185,
      '50ml': 260,
      '100ml': 365,
    },
    concentration: 'Eau de Parfum',
    concentrationPct: 22,
    family: 'Woody',
    gender: 'Unisex',
    brand: 'Maison Aurelia Paris',
    image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
    hoverImage: '/src/assets/images/perfume_bergamot_flacon_1792865211919.jpg',
    galleryImages: [
      '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
    ],
    description:
      'An intoxicating, meditative harmony of sustainably sourced sandalwood, powdery Florentine iris, green papyrus, and radiant cardamom. A quiet yet commanding tactile warmth that fuses intimately with your skin chemistry.',
    heritageStory:
      'Created under the vaulted ceilings of the historic Galerie de Valois atelier. The sandalwood oils rest in aged French oak casks for six months prior to bottling.',
    perfumer: 'Laurent Méric, Master Perfumer',
    notes: {
      top: ['Green Cardamom', 'Violet Leaf', 'Calabrian Bergamot'],
      heart: ['Florentine Orris', 'Egyptian Papyrus', 'Cedarwood Atlas'],
      base: ['Australian Sandalwood', 'White Ambergris', 'Soft Leather'],
    },
    longevity: '10–12 Hours',
    sillage: 'Moderate Trail',
    seasons: ['All Seasons', 'Signature Daily', 'Evening'],
    badge: 'Bestseller',
    hasRareIngredients: true,
    rareIngredients: ['Certified Sustainable Australian Sandalwood', 'Florentine Orris'],
    sustainablyHarvested: true,
    rating: 4.95,
    reviewsCount: 220,
    inStock: true,
    stockCount: 24,
    frequentlyBoughtWith: [
      {
        id: 'bundle-santal-travel',
        name: 'Santal Mystique Discovery Travel Set (3x10ml)',
        price: 90,
        category: 'Travel Coffret',
        image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      },
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Charlotte de Courcelles',
        location: 'Lyon, France',
        rating: 5,
        date: 'October 5, 2026',
        title: 'The cleanest, most comforting luxury sandalwood',
        comment:
          'Sophisticated, intellectual, and effortlessly chic. It has been my signature scent for three years now.',
        verifiedBuyer: true,
      },
    ],
  },

  // 6. Arabian Leather & Smoked Oud: Cuir d'Orient Al-Aswad
  {
    id: 'cuir-orient-aswad',
    name: "Cuir d'Orient Al-Aswad",
    arabicName: 'جلد الشرق الأسود',
    subtitle: 'Black Suede, Smoked Birch & Rare Royal Frankincense',
    origin: 'Arabian Royal',
    originLabel: 'Qasr Al-Aroma · Dubai',
    price: 310,
    volumePrices: {
      '30ml': 220,
      '50ml': 310,
      '100ml': 430,
    },
    concentration: 'Extrait de Parfum',
    concentrationPct: 28,
    family: 'Leather',
    gender: 'Men',
    brand: 'Aurelia Royal Al-Oud',
    image: '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
    hoverImage: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
    galleryImages: [
      '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
      '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
    ],
    description:
      'An intense, dark leather creation combining Bedouin saddle-leather chords with sacred Hojari frankincense, smoky birch, and sweet wild raspberry. Intensely masculine, aristocratic, and long-lasting.',
    heritageStory:
      'Celebrates centuries-old equestrian and falconry traditions in the Arabian desert, fused with French leather extraction methods perfected in Grasse.',
    perfumer: 'Tariq Al-Mansoor & Camille Saint-Honoré',
    notes: {
      top: ['Wild Thyme', 'Medicinal Saffron', 'Wild Mountain Berry'],
      heart: ['Imperial Black Suede', 'Green Frankincense', 'Oud Smoke'],
      base: ['Birch Tar', 'Castoreum Accord', 'Musk'],
    },
    longevity: '16+ Hours',
    sillage: 'Imperial Grand Sillage',
    seasons: ['Autumn', 'Winter', 'Statement Nights'],
    badge: 'Bold & Noble',
    hasRareIngredients: true,
    rareIngredients: ['Royal Green Hojari Frankincense', 'Ancient Birch Tar'],
    sustainablyHarvested: true,
    rating: 4.92,
    reviewsCount: 88,
    inStock: true,
    stockCount: 14,
    frequentlyBoughtWith: [
      {
        id: 'bundle-cuir-balm',
        name: "Cuir d'Orient Aftershave Balm (75ml)",
        price: 55,
        category: 'Grooming',
        image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      },
    ],
    reviews: [
      {
        id: 'rev-7',
        author: 'Hamad Al-Maktoum',
        location: 'Dubai, UAE',
        rating: 5,
        date: 'October 11, 2026',
        title: 'Dark, masculine, and royal',
        comment:
          'If you enjoy rich leather and incense that commands respect in a board meeting or wedding, this is unmatched.',
        verifiedBuyer: true,
      },
    ],
  },

  // 7. French Citrus Luminous: Citrus Neroli Blanc
  {
    id: 'citrus-neroli-blanc',
    name: 'Citrus Neroli Blanc',
    subtitle: 'Calabrian Bergamot, Bitter Orange & Grasse Fleur d’Oranger',
    origin: 'French Atelier',
    originLabel: 'Côte d’Azur · Grasse',
    price: 210,
    volumePrices: {
      '30ml': 150,
      '50ml': 210,
      '100ml': 295,
    },
    concentration: 'Eau de Parfum',
    concentrationPct: 18,
    family: 'Citrus',
    gender: 'Unisex',
    brand: 'Atelier de Grasse',
    image: '/src/assets/images/perfume_bergamot_flacon_1792865211919.jpg',
    hoverImage: '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
    galleryImages: [
      '/src/assets/images/perfume_bergamot_flacon_1792865211919.jpg',
      '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
    ],
    description:
      'The morning breeze through a sun-drenched Mediterranean citrus orchard overlooking the cliffs of the French Riviera. Sparkling Calabrian bergamot zest and hand-pressed orange blossom meet petitgrain and clean linen musk.',
    heritageStory:
      'Harvested from organic orange groves in Grasse and southern Italy. Cold-pressed by hand to preserve the bright effervescence of the natural essential oils.',
    perfumer: 'Matteo Bellini, Grasse',
    notes: {
      top: ['Calabrian Bergamot', 'Bitter Orange Peel', 'Crisp Mandarin'],
      heart: ['Tunisian Neroli', 'Petitgrain Bigarade', 'Fleur d’Oranger'],
      base: ['White Cedar', 'Clean Linen Musk', 'Solar Ambroxan'],
    },
    longevity: '8–10 Hours',
    sillage: 'Moderate Trail',
    seasons: ['Spring', 'Summer', 'Daytime'],
    badge: 'Solar Refreshment',
    hasRareIngredients: false,
    rareIngredients: [],
    sustainablyHarvested: true,
    rating: 4.91,
    reviewsCount: 130,
    inStock: true,
    stockCount: 30,
    frequentlyBoughtWith: [
      {
        id: 'bundle-neroli-mist',
        name: 'Brume Fraîche Corporelle Neroli (150ml)',
        price: 50,
        category: 'Body Mist',
        image: '/src/assets/images/perfume_bergamot_flacon_1792865211919.jpg',
      },
    ],
    reviews: [
      {
        id: 'rev-8',
        author: 'Claire Dufresne',
        location: 'Nice, France',
        rating: 5,
        date: 'September 14, 2026',
        title: 'Sunlight bottled in crystal',
        comment:
          'Crisp, refreshing, yet surprisingly tenacious for a citrus neroli. Perfect for summer days on the coast.',
        verifiedBuyer: true,
      },
    ],
  },

  // 8. French Warm Gourmand: Tonka & Vanille Ambrée
  {
    id: 'tonka-vanille-amber',
    name: 'Tonka & Vanille Ambrée',
    subtitle: 'Wild Bourbon Vanilla, Roasted Tonka & Cured Blonde Tobacco',
    origin: 'French Atelier',
    originLabel: 'Palais-Royal · Paris',
    price: 285,
    volumePrices: {
      '30ml': 195,
      '50ml': 285,
      '100ml': 390,
    },
    concentration: 'Extrait de Parfum',
    concentrationPct: 28,
    family: 'Gourmand',
    gender: 'Unisex',
    brand: 'Maison Aurelia Paris',
    image: '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
    hoverImage: '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
    galleryImages: [
      '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
      '/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg',
    ],
    description:
      'An adult, smoky study in dark Madagascar vanilla bean pods macerated in vintage cognac barrels, infused with roasted tonka beans, blonde tobacco leaf, and rich benzoin tears. Cozy, sensual, and edible.',
    heritageStory:
      'Vanilla pods are hand-split and aged in century-old Cognac oak casks for nine months in the Charente region of France, resulting in a dark boozy depth without cloying sweetness.',
    perfumer: 'Éléonore Dupuis',
    notes: {
      top: ['Aged Cognac', 'Cinnamon Bark', 'Wild Mirabelle Plum'],
      heart: ['Madagascar Bourbon Vanilla', 'Roasted Tonka Bean', 'Tobacco Leaf'],
      base: ['Benzoin Siam', 'Golden Amber', 'Giac Wood'],
    },
    longevity: '14–16 Hours',
    sillage: 'Enveloping Aura',
    seasons: ['Autumn', 'Winter', 'Intimate Nights'],
    badge: 'Award Winner',
    hasRareIngredients: true,
    rareIngredients: ['Wild Madagascar Bourbon Vanilla Pods', 'Benzoin Siam Tears'],
    sustainablyHarvested: true,
    rating: 4.96,
    reviewsCount: 175,
    inStock: true,
    stockCount: 16,
    frequentlyBoughtWith: [
      {
        id: 'bundle-vanilla-oil',
        name: 'Huile Nourrissante Vanille Bourbon (50ml)',
        price: 60,
        category: 'Elixir',
        image: '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
      },
    ],
    reviews: [
      {
        id: 'rev-9',
        author: 'Sophie Laurent',
        location: 'Bordeaux, France',
        rating: 5,
        date: 'October 16, 2026',
        title: 'Dark, intoxicating vanilla with cognac warmth',
        comment:
          'Nothing like synthetic drugstore vanilla. This is intoxicating, deep, and beautifully blended with roasted tonka.',
        verifiedBuyer: true,
      },
    ],
  },
];

export const DISCOVERY_SAMPLES = [
  { id: 'sample-oud-imperial', name: 'Oud Impérial Al-Malaki (2ml Vial)', origin: 'Arabian Royal', family: 'Oud' },
  { id: 'sample-aurore-doree', name: 'Aurore Dorée Extrait (2ml Vial)', origin: 'French Atelier', family: 'Amber' },
  { id: 'sample-santal-mystique', name: 'Santal Mystique (2ml Vial)', origin: 'French Atelier', family: 'Woody' },
  { id: 'sample-velvet-rose', name: 'Velvet Rose Noire (2ml Vial)', origin: 'French Atelier', family: 'Floral' },
  { id: 'sample-sultani-amber', name: 'Sultani Amber Al-Zafaran (2ml Vial)', origin: 'Arabian Royal', family: 'Amber' },
  { id: 'sample-cuir-orient', name: "Cuir d'Orient Al-Aswad (2ml Vial)", origin: 'Arabian Royal', family: 'Leather' },
];

export const VERIFIED_BUYER_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Princess Reema Al-Saud',
    city: 'Riyadh, Saudi Arabia',
    perfume: 'Oud Impérial Al-Malaki',
    quote: 'The blending of royal Cambodian Dehn Al Oud with Grasse extraction methods has created perfection.',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Antoine de Saint-Germain',
    city: 'Paris 8e, France',
    perfume: 'Aurore Dorée Extrait',
    quote: 'Aurelia represents the absolute zenith of French haute parfumerie. The orris butter sillage is breathtaking.',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Sheikha Maryam Al-Maktoum',
    city: 'Dubai, UAE',
    perfume: 'Sultani Amber Al-Zafaran',
    quote: 'Arrived in the signature blush coffret with personalized engraving. The warm saffron sillage is extraordinary.',
    rating: 5,
  },
];
