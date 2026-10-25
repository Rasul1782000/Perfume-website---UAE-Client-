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
  RotateCcw,
  Sliders,
  Leaf,
} from 'lucide-react';
import { PERFUMES_LIST, PerfumeItem, ScentFamily } from '../data/perfumes';
import { CartItem } from './CartDrawer';
import { ScentFinderQuiz } from './ScentFinderQuiz';
import { calculateScentMatchScore, QuizProfile, ScentMatchScore } from '../utils/scentMatch';

interface MobileBoutiqueAppProps {
  onSelectPerfume: (p: PerfumeItem) => void;
  onAddToCart: (p: PerfumeItem) => void;
  cartCount: number;
  onOpenCart: () => void;
  quizProfile?: QuizProfile | null;
  onUpdateQuizProfile?: (profile: QuizProfile | null) => void;
}

export const MobileBoutiqueApp: React.FC<MobileBoutiqueAppProps> = ({
  onSelectPerfume,
  onAddToCart,
  cartCount,
  onOpenCart,
  quizProfile,
  onUpdateQuizProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'quiz' | 'atelier'>('store');
  const [selectedFamily, setSelectedFamily] = useState<'All' | ScentFamily>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Maintain local profile fallback or synced profile
  const [internalProfile, setInternalProfile] = useState<QuizProfile | null>(() => {
    return quizProfile !== undefined
      ? quizProfile
      : {
          world: 'woody',
          aura: 'intimate',
          season: 'autumn',
          recommendedId: 'santal-mystique',
        };
  });

  const activeProfile = quizProfile !== undefined ? quizProfile : internalProfile;

  const handleQuizComplete = (profile: QuizProfile, recommended: PerfumeItem) => {
    setInternalProfile(profile);
    if (onUpdateQuizProfile) {
      onUpdateQuizProfile(profile);
    }
  };

  const handleResetQuiz = () => {
    setInternalProfile(null);
    if (onUpdateQuizProfile) {
      onUpdateQuizProfile(null);
    }
  };

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
          <h1 className="text-xl font-brand font-semibold tracking-[0.18em] text-rose-800 uppercase">AURELIA</h1>
          <p className="text-[9px] text-rose-600 font-mono tracking-widest uppercase font-semibold">Haute Parfumerie · Paris & Dubai</p>
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

            {/* Scent Quiz Result / Profile Header Banner */}
            {activeProfile ? (
              <div className="p-2.5 bg-gradient-to-r from-rose-50 via-[#fff7f9] to-pink-50/70 border border-pink-200/90 rounded-2xl text-xs flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-pink-100" />
                  </div>
                  <div className="leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-rose-900 uppercase tracking-wide">
                        Scent Profile Active
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-200/70 text-rose-800 text-[8.5px] font-mono font-bold capitalize">
                        {activeProfile.world} · {activeProfile.aura}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-slate-500 font-body mt-0.5">
                      Match scores are calculated based on your consultation answers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="text-[9.5px] font-mono font-bold text-rose-700 hover:text-rose-900 px-2 py-1 rounded-lg hover:bg-rose-100/60 transition-colors"
                  >
                    Retake
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setActiveTab('quiz')}
                className="p-2.5 bg-gradient-to-r from-rose-50/60 to-white border border-dashed border-pink-300 rounded-2xl text-xs flex items-center justify-between cursor-pointer hover:border-rose-400 transition-colors shadow-2xs group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-3 h-3 text-rose-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-800 block">
                      Take 30-sec Scent Consultation
                    </span>
                    <span className="text-[9px] text-slate-500 font-body">
                      Unlock personalized Scent Match Scores on all flacons
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-600 shrink-0">Start →</span>
              </div>
            )}

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
              {filteredPerfumes.map((perfume) => {
                const matchInfo = calculateScentMatchScore(perfume, activeProfile);

                return (
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

                      {/* Origin/Featured & Sustainability Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                        {perfume.badge && (
                          <span className="text-[9px] font-mono tracking-wider uppercase bg-white/95 text-rose-700 px-2.5 py-0.5 rounded-full border border-pink-200 backdrop-blur-xs font-semibold shadow-xs">
                            {perfume.badge}
                          </span>
                        )}
                        {perfume.hasRareIngredients && perfume.sustainablyHarvested && (
                          <span className="text-[8px] font-mono tracking-wider uppercase bg-emerald-50/95 text-emerald-800 border border-emerald-200/90 px-2 py-0.5 rounded-full backdrop-blur-xs font-bold shadow-xs flex items-center gap-1">
                            <Leaf className="w-2 h-2 text-emerald-600 shrink-0" />
                            <span>Sustainably Harvested</span>
                          </span>
                        )}
                      </div>

                      {/* Scent Match Score Badge on Card Image */}
                      {matchInfo ? (
                        <div
                          className={`absolute top-2.5 right-2.5 text-[9px] font-mono tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-md font-bold shadow-xs flex items-center gap-1 transition-all ${
                            matchInfo.score >= 95
                              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border border-rose-400 ring-2 ring-rose-200/50'
                              : matchInfo.score >= 88
                              ? 'bg-white/95 text-rose-700 border border-pink-300'
                              : 'bg-white/90 text-slate-700 border border-pink-200'
                          }`}
                          title={`Scent Match: ${matchInfo.score}% (${matchInfo.matchType})`}
                        >
                          <Sparkles
                            className={`w-2.5 h-2.5 ${
                              matchInfo.score >= 95 ? 'text-pink-200 animate-pulse' : 'text-rose-500'
                            }`}
                          />
                          <span>{matchInfo.score}% Match</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab('quiz');
                          }}
                          className="absolute top-2.5 right-2.5 text-[8.5px] font-mono bg-white/95 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-pink-200 backdrop-blur-xs font-semibold shadow-xs flex items-center gap-1 transition-colors"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-rose-500" />
                          <span>Get Match %</span>
                        </button>
                      )}

                      {/* Price Tag */}
                      <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-rose-700 font-heading font-bold text-base border border-pink-200 shadow-xs">
                        ${perfume.price} <span className="text-[9px] font-mono font-normal text-slate-500">/ 50ml</span>
                      </div>
                    </div>

                    {/* Card Metadata */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2.5">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-rose-600 font-semibold uppercase tracking-wider">
                            {perfume.origin === 'Arabian Royal' ? 'Arabian Royal Oud' : 'French Atelier'}
                          </span>
                          <span className="text-slate-500 font-medium">
                            {perfume.concentration} ({perfume.concentrationPct}%)
                          </span>
                        </div>

                        {/* Sustainably Harvested metadata badge for rare ingredients */}
                        {perfume.hasRareIngredients && perfume.sustainablyHarvested && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="inline-flex items-center gap-1 text-[8.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-bold uppercase tracking-wider shadow-2xs">
                              <Leaf className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                              <span>Sustainably Harvested</span>
                            </span>
                            {perfume.rareIngredients && perfume.rareIngredients.length > 0 && (
                              <span className="text-[8.5px] font-mono text-emerald-700/80 truncate max-w-[150px]">
                                · {perfume.rareIngredients[0]}
                              </span>
                            )}
                          </div>
                        )}

                        <h4 className="font-heading text-2xl font-normal text-rose-800 mt-1 leading-snug">
                          {perfume.name}
                        </h4>
                        {perfume.arabicName && (
                          <span className="text-sm font-arabic text-amber-900 block mt-0.5" dir="rtl">
                            {perfume.arabicName}
                          </span>
                        )}
                        <p className="text-[11px] text-slate-600 font-body line-clamp-1 mt-0.5">{perfume.subtitle}</p>
                      </div>

                      {/* Scent Profile Summary Section with Scent Match Score Integration */}
                      <div className="bg-gradient-to-r from-[#fff7f9] to-[#fff2f6] p-2.5 rounded-xl border border-pink-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-[10px] font-mono uppercase font-bold text-rose-900 tracking-wider">
                              Scent Profile
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {matchInfo && (
                              <span
                                className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs ${
                                  matchInfo.score >= 95
                                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white'
                                    : 'bg-rose-50 text-rose-800 border border-pink-200'
                                }`}
                              >
                                <Sparkles
                                  className={`w-2 h-2 ${matchInfo.score >= 95 ? 'text-pink-200' : 'text-rose-500'}`}
                                />
                                <span>{matchInfo.score}% Match</span>
                              </span>
                            )}
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-100/90 text-rose-800 font-bold border border-rose-200">
                              Dominant: {perfume.family}
                            </span>
                          </div>
                        </div>

                        {/* Match harmony rationale when quiz results exist */}
                        {matchInfo && (
                          <div className="flex items-center justify-between text-[8.5px] font-mono bg-white/90 px-2 py-1 rounded-md border border-pink-100 text-slate-600">
                            <span className="text-rose-700 font-bold">{matchInfo.matchType}</span>
                            <span className="truncate ml-1 text-slate-500">{matchInfo.reasons[0]}</span>
                          </div>
                        )}

                        {/* Dominant Notes Across the Olfactory Pyramid */}
                        <div className="grid grid-cols-3 gap-1.5 text-[9px]">
                          <div className="bg-white/95 p-1.5 rounded-lg border border-pink-100 flex flex-col justify-between shadow-2xs">
                            <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                              Top Accord
                            </span>
                            <span className="font-bold text-slate-800 truncate mt-0.5">
                              {perfume.notes.top[0] || 'Citrus'}
                            </span>
                          </div>
                          <div className="bg-white/95 p-1.5 rounded-lg border border-pink-100 flex flex-col justify-between shadow-2xs">
                            <span className="text-[8px] font-mono uppercase tracking-wider text-rose-600 font-bold">
                              Heart Accord
                            </span>
                            <span className="font-bold text-rose-900 truncate mt-0.5">
                              {perfume.notes.heart[0] || 'Floral'}
                            </span>
                          </div>
                          <div className="bg-white/95 p-1.5 rounded-lg border border-pink-100 flex flex-col justify-between shadow-2xs">
                            <span className="text-[8px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                              Base Accord
                            </span>
                            <span className="font-bold text-slate-800 truncate mt-0.5">
                              {perfume.notes.base[0] || 'Woody'}
                            </span>
                          </div>
                        </div>

                        {/* Dominant Accords Chips */}
                        <div className="flex items-center justify-between pt-0.5 text-[10px]">
                          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                            <span className="text-[9px] text-slate-500 font-mono shrink-0">Accords:</span>
                            {[...perfume.notes.heart.slice(0, 2), ...perfume.notes.base.slice(0, 1)].map((acc, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-white text-rose-800 border border-pink-200 text-[9px] font-medium whitespace-nowrap shadow-2xs"
                              >
                                {acc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons & Performance */}
                      <div className="pt-2 border-t border-pink-100 flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 font-mono">Longevity: {perfume.longevity}</span>
                          <span className="text-[9px] text-rose-600 font-mono truncate">{perfume.sillage}</span>
                        </div>
                        <button
                          onClick={(e) => handleQuickAdd(perfume, e)}
                          className="px-3 py-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all shadow-xs active:scale-95 shrink-0"
                        >
                          {recentlyAddedId === perfume.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono text-slate-500 font-medium">Bespoke Olfactory Diagnostic</span>
              {activeProfile && (
                <button
                  onClick={() => setActiveTab('store')}
                  className="text-[10px] font-mono font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                >
                  <span>View Match Scores</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
            <ScentFinderQuiz
              onSelectPerfume={onSelectPerfume}
              onAddToCart={onAddToCart}
              onQuizComplete={(profile, perf) => handleQuizComplete(profile, perf)}
              onResetQuiz={handleResetQuiz}
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
