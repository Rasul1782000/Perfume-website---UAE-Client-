import { PerfumeItem } from '../data/perfumes';

export interface QuizProfile {
  world: string; // 'woody' | 'floral' | 'citrus' | 'gourmand' | 'amber'
  aura: string; // 'intimate' | 'moderate' | 'enveloping'
  season: string; // 'spring' | 'summer' | 'autumn' | 'winter'
  recommendedId: string;
}

export interface ScentMatchScore {
  score: number;
  matchType: string;
  reasons: string[];
}

export function calculateScentMatchScore(
  perfume: PerfumeItem,
  profile: QuizProfile | null
): ScentMatchScore | null {
  if (!profile) return null;

  // Direct Algorithmic Recommendation Match (Highest Tier)
  if (perfume.id === profile.recommendedId) {
    return {
      score: 98,
      matchType: 'Signature Match',
      reasons: ['Direct consultation recommendation', 'Harmonizes with desired aura & season'],
    };
  }

  let points = 68; // Baseline affinity for curated artisanal collection
  const reasons: string[] = [];

  const profileWorld = profile.world.toLowerCase();
  const perfFamily = perfume.family.toLowerCase();

  // Olfactory World & Family Compatibility
  if (
    perfFamily === profileWorld ||
    (profileWorld === 'amber' && perfFamily === 'oud') ||
    (profileWorld === 'woody' && perfFamily === 'oud')
  ) {
    points += 18;
    reasons.push(`${perfume.family} olfactory family alignment`);
  } else if (
    (profileWorld === 'floral' && perfume.notes.heart.some((n) => /rose|jasmine|iris|blossom|violet|neroli/i.test(n))) ||
    (profileWorld === 'woody' && perfume.notes.base.some((n) => /cedar|santal|sandalwood|vetiver|patchouli|oud/i.test(n))) ||
    (profileWorld === 'citrus' && perfume.notes.top.some((n) => /bergamot|lemon|mandarin|neroli|orange|grapefruit/i.test(n))) ||
    (profileWorld === 'gourmand' && perfume.notes.base.some((n) => /vanilla|tonka|cacao|praline|honey|amber|benzoin/i.test(n))) ||
    (profileWorld === 'amber' && (perfume.notes.base.some((n) => /amber|musk|frankincense|oud/i.test(n)) || perfume.origin === 'Arabian Royal'))
  ) {
    points += 13;
    reasons.push('Harmonious heart accord');
  }

  // Aura & Projection Alignment
  const aura = profile.aura.toLowerCase();
  const sillage = perfume.sillage.toLowerCase();
  if (aura === 'intimate' && (sillage.includes('intimate') || sillage.includes('skin'))) {
    points += 8;
    reasons.push('Skin-close intimate sillage');
  } else if (aura === 'moderate' && (sillage.includes('moderate') || sillage.includes('refined'))) {
    points += 8;
    reasons.push('Refined salon projection');
  } else if (aura === 'enveloping' && (sillage.includes('enveloping') || sillage.includes('imperial') || sillage.includes('aura'))) {
    points += 8;
    reasons.push('Commanding royal aura');
  } else {
    points += 4;
  }

  // Season Alignment
  const season = profile.season.toLowerCase();
  const matchesSeason = perfume.seasons.some((s) => s.toLowerCase() === season);
  if (matchesSeason) {
    points += 6;
    reasons.push(`${profile.season.charAt(0).toUpperCase() + profile.season.slice(1)} seasonality`);
  } else {
    points += 2;
  }

  // Bound score gracefully between 74% and 94%
  const score = Math.min(94, Math.max(74, points));

  let matchType = 'Harmonious Accord';
  if (score >= 90) {
    matchType = 'High Affinity';
  } else if (score >= 82) {
    matchType = 'Complementary Accord';
  } else {
    matchType = 'Artisanal Pair';
  }

  return {
    score,
    matchType,
    reasons,
  };
}
