import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  Heart,
  Droplet,
  Compass,
  User,
  Star,
  Check,
} from 'lucide-react';
import { PERFUMES_LIST, PerfumeItem, ScentFamily } from '../data/perfumes';
import { CartItem } from './CartDrawer';
import { ScentFinderQuiz } from './ScentFinderQuiz';

interface MobileBoutiqueAppProps {
  onSelectPerfume: (p: PerfumeItem) => void;
  onAddToCart: (p: PerfumeItem) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const MobileBoutiqueApp: React.FC<MobileBoutiqueAppProps> = ({
  onSelectPerfume,
  onAddToCart,
  cartCount,
  onOpenCart,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'quiz' | 'atelier'>('store');
  const [selectedFamily, setSelectedFamily] = useState<'All' | ScentFamily>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const filteredPerfumes = PERFUMES_LIST.filter((p) => {
    const matchesFamily = selectedFamily === 'All' || p.family === selectedFamily;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.top.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.notes.heart.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.notes.base.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFamily && matchesSearch;
  });

  const handleQuickAdd = (p: PerfumeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p);
    setRecentlyAddedId(p.id);
    setTimeout(() => setRecentlyAddedId(null), 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fffbfc] text-slate-800 select-none overflow-hidden font-body">
      {/* Top Mobile App Bar */}
      <div className="px-4 py-2.5 bg-white/95 backdrop-blur-md border-b border-pink-100 flex items-center justify-between shrink-0 shadow-xs">
        <div>
          <h1 className="text-xl font-heading tracking-wider text-rose-700 uppercase">AURELIA</h1>
          <p className="text-[9px] text-rose-600 font-mono tracking-widest uppercase font-semibold">Haute Parfumerie · Paris</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Bag button with badge */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-full bg-rose-50 border border-pink-200 text-rose-700 hover:text-rose-800 transition-colors shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-rose-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold flex items-center justify-center font-mono shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
        {activeTab === 'store' && (
          <>
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-rose-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notes (sandalwood, rose, vanilla)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-pink-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-400 shadow-xs font-body"
              />
            </div>

            {/* Scent Family Horizontal Carousel */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['All', 'Woody', 'Floral', 'Citrus', 'Amber', 'Gourmand', 'Leather'] as const).map((fam) => (
                <button
                  key={fam}
                  onClick={() => setSelectedFamily(fam as any)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    selectedFamily === fam
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 hover:text-rose-700 border border-pink-200 shadow-xs'
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>

            {/* Editorial Mini Banner */}
            <div className="p-3 bg-gradient-to-r from-rose-100/70 via-pink-50 to-[#fff5f8] border border-pink-200 rounded-2xl text-xs space-y-1 shadow-xs">
              <span className="text-[9px] font-mono uppercase tracking-widest text-rose-600 block font-semibold">
                Palais-Royal Collection
              </span>
              <h3 className="font-heading text-xl font-normal text-rose-800">Rare Artisanal Extraits de Parfum</h3>
              <p className="text-[11px] text-slate-700 font-body leading-relaxed">
                Hand-formulated in Grasse with sustainably harvested botanicals and 20–32% pure oil concentration.
              </p>
            </div>

            {/* Perfume List Cards */}
            <div className="space-y-3">
              {filteredPerfumes.map((perfume) => (
                <div
                  key={perfume.id}
                  onClick={() => onSelectPerfume(perfume)}
                  className="bg-white border border-pink-100 hover:border-rose-300 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group shadow-xs flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative aspect-4/3 w-full bg-rose-50/40 overflow-hidden">
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {perfume.badge && (
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-mono tracking-wider uppercase bg-white/95 text-rose-700 px-2.5 py-0.5 rounded-full border border-pink-200 backdrop-blur-xs font-semibold shadow-xs">
                        {perfume.badge}
                      </span>
                    )}
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-rose-700 font-heading font-bold text-base border border-pink-200 shadow-xs">
                      ${perfume.price} <span className="text-[9px] font-mono font-normal text-slate-500">/ 50ml</span>
                    </div>
                  </div>

                  {/* Card Metadata */}
                  <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-600 font-semibold uppercase tracking-wider">
                        <span>{perfume.family}</span>
                        <span>·</span>
                        <span className="text-slate-600">{perfume.concentration}</span>
                      </div>
                      <h4 className="font-heading text-2xl font-normal text-rose-700 mt-0.5">{perfume.name}</h4>
                      <p className="text-[11px] text-slate-600 font-body italic truncate">{perfume.subtitle}</p>
                    </div>

                    {/* Note tags */}
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {perfume.notes.heart.slice(0, 3).map((note, idx) => (
                        <span key={idx} className="bg-rose-50/80 px-2 py-0.5 rounded text-rose-800 font-body border border-pink-200/80">
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-pink-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">Longevity: {perfume.longevity}</span>
                      <button
                        onClick={(e) => handleQuickAdd(perfume, e)}
                        className="px-3 py-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all shadow-xs active:scale-95"
                      >
                        {recentlyAddedId === perfume.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <ScentFinderQuiz
              onSelectPerfume={onSelectPerfume}
              onAddToCart={onAddToCart}
            />
          </div>
        )}

        {/* Atelier Story Tab */}
        {activeTab === 'atelier' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-pink-100 space-y-2 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-rose-600 font-semibold tracking-widest">
                Our Heritage & Grasse Atelier
              </span>
              <h3 className="font-heading text-2xl text-rose-700">The Art of Extraction</h3>
              <p className="text-slate-700 leading-relaxed font-body text-xs">
                Founded under the arcades of the Palais-Royal, Maison AURELIA formulates perfumes with zero synthetic dilution. Every harvest is aged in oak barrels for six months to allow natural molecules to harmoniously fuse.
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-pink-100 space-y-2 shadow-xs">
              <h4 className="font-heading text-xl text-rose-700">The Maison Guarantee</h4>
              <ul className="space-y-1.5 text-slate-700 text-[11px] font-body">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>2 complimentary 2ml discovery vials with every flacon</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Complimentary personalized metal collar engraving</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Free expedited delivery worldwide on orders over $250</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <div className="h-14 bg-white/95 backdrop-blur-md border-t border-pink-100 px-4 grid grid-cols-3 items-center shrink-0 font-body shadow-xs">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'store' ? 'text-rose-700 font-bold' : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <Droplet className="w-4 h-4 text-rose-500" />
          <span className="text-[10px] mt-1 font-body tracking-wider">Flacons</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'quiz' ? 'text-rose-700 font-bold' : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span className="text-[10px] mt-1 font-body tracking-wider">Scent Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('atelier')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            activeTab === 'atelier' ? 'text-rose-700 font-bold' : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <Compass className="w-4 h-4 text-rose-500" />
          <span className="text-[10px] mt-1 font-body tracking-wider">Atelier</span>
        </button>
      </div>
    </div>
  );
};
