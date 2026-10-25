import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sparkles,
  ChevronDown,
  Flame,
  Globe,
  Truck,
  ArrowRight,
  ShieldCheck,
  X,
  Smartphone,
} from 'lucide-react';
import { PERFUMES_LIST, PerfumeItem, ScentFamily, ScentOrigin } from '../data/perfumes';

interface HeaderProps {
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onNavigateCategory: (category: { origin?: ScentOrigin; family?: ScentFamily; isDeals?: boolean }) => void;
  onNavigateHome: () => void;
  onOpenQuiz: () => void;
  onOpenMobileFrame: () => void;
  activeNav: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartSubtotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onSelectPerfume,
  onNavigateCategory,
  onNavigateHome,
  onOpenQuiz,
  onOpenMobileFrame,
  activeNav,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered auto-complete suggestions
  const searchResults = PERFUMES_LIST.filter((perfume) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'French' && perfume.origin === 'French Atelier') ||
      (selectedCategory === 'Arabic' && perfume.origin === 'Arabian Royal') ||
      (selectedCategory === 'Extrait' && perfume.concentration === 'Extrait de Parfum') ||
      (selectedCategory === 'Unisex' && perfume.gender === 'Unisex');

    if (!searchQuery.trim()) return matchesCategory;

    const q = searchQuery.toLowerCase();
    const matchesQuery =
      perfume.name.toLowerCase().includes(q) ||
      (perfume.arabicName && perfume.arabicName.includes(q)) ||
      perfume.subtitle.toLowerCase().includes(q) ||
      perfume.family.toLowerCase().includes(q) ||
      perfume.originLabel.toLowerCase().includes(q) ||
      perfume.notes.top.some((n) => n.toLowerCase().includes(q)) ||
      perfume.notes.heart.some((n) => n.toLowerCase().includes(q)) ||
      perfume.notes.base.some((n) => n.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  }).slice(0, 5);

  const popularSearches = [
    'Cambodian Oud',
    'Grasse Centifolia Rose',
    'Taif Rose',
    'Mysore Sandalwood',
    'Bourbon Vanilla',
    'Kashmiri Saffron',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs shadow-pink-100/40">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-700 via-pink-600 to-rose-700 text-white text-[11px] py-1.5 px-4 font-body tracking-wider uppercase flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-4 text-pink-100">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-pink-200" />
            Complimentary Worldwide Express Courier over $150
          </span>
          <span>·</span>
          <span>2 Free Discovery Vials (French & Arabian) with Every Flacon</span>
        </div>

        <div className="mx-auto sm:mx-0 flex items-center gap-3">
          <span className="font-semibold text-white">
            VIP Privilege: Use code <strong className="underline decoration-pink-300 font-mono">AURELIA15</strong> for 15% off
          </span>
          <span className="hidden md:inline-block">·</span>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-pink-200">
            <Globe className="w-3 h-3" /> Paris · Grasse · Dubai · Muscat
          </span>
        </div>
      </div>

      {/* 2. Main Header Bar (Amazon/Sephora Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateHome}
            className="text-left group focus:outline-hidden"
          >
            <span className="text-3xl md:text-4xl font-brand font-semibold tracking-[0.2em] text-rose-800 uppercase group-hover:text-pink-600 transition-colors block">
              AURELIA
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-rose-600 uppercase block -mt-0.5 font-semibold">
              Haute Parfumerie · Paris & Dubai
            </span>
          </button>
        </div>

        {/* Amazon/Sephora Style Smart Search Bar with Category Dropdown & Autocomplete */}
        <div ref={searchContainerRef} className="flex-1 max-w-2xl relative hidden md:block">
          <div className="flex items-center rounded-2xl border border-pink-200 bg-[#fffbfc] focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-200 shadow-xs transition-all overflow-hidden">
            {/* Category Filter Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-rose-50/80 border-r border-pink-200 text-xs font-body font-medium text-slate-700 px-3 py-2.5 focus:outline-hidden hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <option value="All">All Fragrances</option>
              <option value="French">French Haute Parfumerie</option>
              <option value="Arabic">Arabian Royal Oud & Attar</option>
              <option value="Extrait">Pure Extraits (30%+)</option>
              <option value="Unisex">Unisex Formulations</option>
            </select>

            {/* Input field */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder="Search raw notes (Cambodian oud, Grasse rose, iris, saffron, vanilla)..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full bg-transparent px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden font-body"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 mr-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Submit Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white transition-all flex items-center justify-center shrink-0"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown Preview */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-pink-200 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in-50 duration-200">
              {/* Popular quick searches */}
              {!searchQuery && (
                <div className="space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-rose-600 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    Trending Olfactory Notes & Accords
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          setIsSearchOpen(true);
                        }}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-pink-200 rounded-lg text-xs font-body transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Instant Search Results */}
              {searchResults.length > 0 ? (
                <div className="space-y-2 mt-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    Matching Flacons & Extraits ({searchResults.length})
                  </div>
                  <div className="divide-y divide-pink-100">
                    {searchResults.map((perfume) => (
                      <div
                        key={perfume.id}
                        onClick={() => {
                          onSelectPerfume(perfume);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="py-2.5 flex items-center gap-3 hover:bg-rose-50/60 rounded-xl px-2 transition-colors cursor-pointer group"
                      >
                        <img
                          src={perfume.image}
                          alt={perfume.name}
                          className="w-11 h-11 object-cover rounded-lg border border-pink-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-lg font-normal text-rose-700 group-hover:text-pink-600 truncate">
                              {perfume.name}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.2 rounded-full uppercase ${
                                perfume.origin === 'Arabian Royal'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {perfume.origin === 'Arabian Royal' ? 'Arabian Oud' : 'French Atelier'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate font-body">{perfume.subtitle}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-heading text-base font-bold text-rose-700">${perfume.price}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">50ml</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery ? (
                <div className="py-6 text-center text-xs text-slate-500 font-body">
                  No matching fragrances found for "{searchQuery}". Try searching for "Oud", "Rose", "Sandalwood", or "Amber".
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* User Interactive Actions: Wishlist, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Wishlist Button with micro-badge */}
          <button
            onClick={onOpenWishlist}
            className="p-2.5 rounded-xl border border-pink-200 bg-[#fffbfc] hover:bg-rose-50 text-slate-700 hover:text-rose-700 transition-all relative shadow-xs flex items-center gap-1.5 group"
            title="Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                wishlistCount > 0 ? 'text-rose-600 fill-rose-600' : 'text-rose-500'
              }`}
            />
            <span className="hidden lg:inline-block text-xs font-body font-medium">Saved</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold font-mono flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account Button */}
          <button
            onClick={onOpenAccount}
            className="p-2.5 rounded-xl border border-pink-200 bg-[#fffbfc] hover:bg-rose-50 text-slate-700 hover:text-rose-700 transition-all shadow-xs flex items-center gap-1.5"
            title="Account & Orders"
          >
            <User className="w-4 h-4 text-rose-600" />
            <span className="hidden lg:inline-block text-xs font-body font-medium">Account</span>
          </button>

          {/* Shopping Bag Button with Live Subtotal */}
          <button
            onClick={onOpenCart}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-200/50 transition-all flex items-center gap-2 active:scale-95"
            title="View Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-white text-rose-700 text-[9px] font-bold font-mono flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-[10px] uppercase font-mono block leading-none opacity-90">Bag</span>
              <span className="text-xs font-bold leading-tight tabular-nums">${cartSubtotal}</span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Sticky Mega Menu Navigation Bar */}
      <nav className="border-t border-pink-100 bg-white/95 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-6 py-2.5 text-xs font-body tracking-wider uppercase whitespace-nowrap">
          <button
            onClick={() => onNavigateCategory({})}
            className={`transition-colors font-medium hover:text-rose-600 pb-0.5 ${
              activeNav === 'all' ? 'text-rose-700 font-bold border-b-2 border-rose-500' : 'text-slate-600'
            }`}
          >
            All Collections
          </button>

          <button
            onClick={() => onNavigateCategory({ origin: 'French Atelier' })}
            className={`transition-colors font-medium hover:text-rose-600 pb-0.5 flex items-center gap-1.5 ${
              activeNav === 'french' ? 'text-rose-700 font-bold border-b-2 border-rose-500' : 'text-slate-600'
            }`}
          >
            <span>French Haute Parfumerie</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-pink-200">
              Grasse
            </span>
          </button>

          <button
            onClick={() => onNavigateCategory({ origin: 'Arabian Royal' })}
            className={`transition-colors font-medium hover:text-rose-600 pb-0.5 flex items-center gap-1.5 ${
              activeNav === 'arabic' ? 'text-rose-700 font-bold border-b-2 border-rose-500' : 'text-slate-600'
            }`}
          >
            <span>Arabian Oud & Attar</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Royal
            </span>
          </button>

          <button
            onClick={() => onNavigateCategory({ family: 'Floral' })}
            className="transition-colors font-medium text-slate-600 hover:text-rose-600"
          >
            Women's Floral
          </button>

          <button
            onClick={() => onNavigateCategory({ family: 'Leather' })}
            className="transition-colors font-medium text-slate-600 hover:text-rose-600"
          >
            Men's Woody & Leather
          </button>

          <button
            onClick={() => onNavigateCategory({ family: 'Oud' })}
            className="transition-colors font-medium text-slate-600 hover:text-rose-600"
          >
            Unisex Royal Ouds
          </button>

          <button
            onClick={() => onNavigateCategory({ isDeals: true })}
            className={`transition-colors font-medium hover:text-rose-600 pb-0.5 flex items-center gap-1 text-rose-700 ${
              activeNav === 'deals' ? 'font-bold border-b-2 border-rose-500' : ''
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600 animate-pulse" />
            <span>Deals of the Day</span>
          </button>

          <button
            onClick={onOpenQuiz}
            className="transition-colors font-medium text-slate-600 hover:text-rose-600 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Scent Consultation Quiz</span>
          </button>

          <button
            onClick={onOpenMobileFrame}
            className="transition-colors font-medium text-slate-600 hover:text-rose-600 flex items-center gap-1 ml-auto"
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-500" />
            <span>Refero Mobile View</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
