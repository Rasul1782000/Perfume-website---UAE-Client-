import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ScentFamily, ScentOrigin } from '../data/perfumes';

interface FragranceFamiliesGridProps {
  onSelectFilter: (filter: { origin?: ScentOrigin; family?: ScentFamily }) => void;
}

export const FragranceFamiliesGrid: React.FC<FragranceFamiliesGridProps> = ({ onSelectFilter }) => {
  const families = [
    {
      title: 'Arabian Royal Oud',
      subtitle: 'Wild Cambodian Agarwood & Smoked Resins',
      origin: 'Arabian Royal' as ScentOrigin,
      family: 'Oud' as ScentFamily,
      image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      badge: 'Heritage Classic',
    },
    {
      title: 'French Floral (Rose de Mai)',
      subtitle: 'Grasse Centifolia Rose & French Jasmine',
      origin: 'French Atelier' as ScentOrigin,
      family: 'Floral' as ScentFamily,
      image: '/src/assets/images/perfume_grasse_atelier_harvest_1792958212853.jpg',
      badge: 'Grasse Harvest',
    },
    {
      title: 'Solar Tuscan Amber',
      subtitle: 'Florentine Orris Butter & Wild Honey',
      origin: 'French Atelier' as ScentOrigin,
      family: 'Amber' as ScentFamily,
      image: '/src/assets/images/perfume_crystal_flacons_gallery_1792958227158.jpg',
      badge: 'Imperial Reserve',
    },
    {
      title: 'Grasse Woody & Sandalwood',
      subtitle: 'Mysore Sandalwood & French Oak Casks',
      origin: 'French Atelier' as ScentOrigin,
      family: 'Woody' as ScentFamily,
      image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      badge: 'Sensual & Pure',
    },
    {
      title: 'Riviera Citrus & Neroli',
      subtitle: 'Calabrian Bergamot & Orange Blossom',
      origin: 'French Atelier' as ScentOrigin,
      family: 'Citrus' as ScentFamily,
      image: '/src/assets/images/perfume_bergamot_flacon_1792865211919.jpg',
      badge: 'Sunlit Freshness',
    },
    {
      title: 'Bourbon Vanilla Gourmand',
      subtitle: 'Vintage Cognac Oak & Roasted Tonka',
      origin: 'French Atelier' as ScentOrigin,
      family: 'Gourmand' as ScentFamily,
      image: '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
      badge: 'Intoxicating Depth',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-pink-100">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold block mb-1">
            Olfactory Classifications
          </span>
          <h2 className="text-3xl md:text-4xl font-heading text-rose-800">
            Shop by Fragrance Family & Heritage
          </h2>
          <p className="text-xs text-slate-600 font-body">
            Explore legendary extraits categorised by origin traditions and dominant botanicals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {families.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelectFilter({ origin: item.origin, family: item.family })}
            className="group bg-white border border-pink-200/90 rounded-2xl p-3 shadow-xs hover:shadow-lg hover:border-rose-400 hover:shadow-rose-100/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-rose-50/50 mb-3 relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono uppercase bg-white/95 text-rose-700 px-2 py-0.5 rounded-full border border-pink-200 font-semibold shadow-xs">
                {item.badge}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-lg font-normal text-rose-800 group-hover:text-pink-600 transition-colors leading-tight">
                {item.title}
              </h3>
              <p className="text-[10px] text-slate-500 font-body line-clamp-1">{item.subtitle}</p>
            </div>

            <div className="pt-2 text-rose-600 flex items-center gap-1 text-[11px] font-medium font-body mt-1">
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
