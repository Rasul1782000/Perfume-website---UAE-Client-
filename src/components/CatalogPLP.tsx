import React, { useState } from 'react';
import {
  Filter,
  Search,
  Star,
  Eye,
  ShoppingBag,
  Heart,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Check,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { PerfumeItem, ScentFamily, ScentOrigin } from '../data/perfumes';

interface CatalogPLPProps {
  perfumes: PerfumeItem[];
  selectedOrigin: 'All' | ScentOrigin;
  setSelectedOrigin: (origin: 'All' | ScentOrigin) => void;
  selectedFamily: 'All' | ScentFamily;
  setSelectedFamily: (family: 'All' | ScentFamily) => void;
  selectedGender: 'All' | 'Unisex' | 'Women' | 'Men';
  setSelectedGender: (gender: 'All' | 'Unisex' | 'Women' | 'Men') => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'reviews';
  setSortBy: (sort: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'reviews') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  onResetFilters: () => void;
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onQuickView: (perfume: PerfumeItem) => void;
  onAddToCart: (perfume: PerfumeItem, volume?: '30ml' | '50ml' | '100ml') => void;
  onToggleWishlist: (perfume: PerfumeItem) => void;
  isWishlisted: (id: string) => boolean;
}

export const CatalogPLP: React.FC<CatalogPLPProps> = ({
  perfumes,
  selectedOrigin,
  setSelectedOrigin,
  selectedFamily,
  setSelectedFamily,
  selectedGender,
  setSelectedGender,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  inStockOnly,
  setInStockOnly,
  onResetFilters,
  onSelectPerfume,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Active filters count
  const hasActiveFilters =
    selectedOrigin !== 'All' ||
    selectedFamily !== 'All' ||
    selectedGender !== 'All' ||
    maxPrice < 450 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* PLP Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-pink-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold mb-1">
            <span>Haute Parfumerie & Royal Attar Catalog</span>
            <span>·</span>
            <span>Grasse & Dubai</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading text-rose-800">
            Artisanal Extraits & Eaux de Parfum
          </h2>
          <p className="text-xs text-slate-600 font-body mt-1">
            Showing <strong className="text-rose-700 font-semibold">{perfumes.length}</strong> master formulations macerated in vintage casks.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden px-4 py-2 bg-rose-50 border border-pink-200 text-rose-800 rounded-xl text-xs font-body font-semibold flex items-center gap-2 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
            <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-pink-200 rounded-2xl px-3 py-1.5 shadow-xs">
            <span className="text-[11px] font-mono text-slate-500 uppercase">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-700 font-body font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Featured Curations</option>
              <option value="rating">Highest Customer Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Tags Pill Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs font-mono text-slate-500 uppercase">Active Filters:</span>
          {selectedOrigin !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-full text-xs font-body font-medium">
              Origin: {selectedOrigin}
              <button onClick={() => setSelectedOrigin('All')} className="hover:text-rose-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedFamily !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-full text-xs font-body font-medium">
              Family: {selectedFamily}
              <button onClick={() => setSelectedFamily('All')} className="hover:text-rose-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedGender !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-full text-xs font-body font-medium">
              Gender: {selectedGender}
              <button onClick={() => setSelectedGender('All')} className="hover:text-rose-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {maxPrice < 450 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-full text-xs font-body font-medium">
              Max: ${maxPrice}
              <button onClick={() => setMaxPrice(450)} className="hover:text-rose-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-full text-xs font-body font-medium">
              Rating: {minRating}★+
              <button onClick={() => setMinRating(0)} className="hover:text-rose-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-full text-xs font-body font-medium">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-rose-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={onResetFilters}
            className="text-xs font-mono text-rose-600 hover:text-rose-800 underline ml-2 font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Left-Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left-Sidebar Filters (Amazon/Sephora Style) */}
        <aside
          className={`md:col-span-3 bg-white border border-pink-200 rounded-3xl p-5 shadow-xs space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-pink-100">
            <span className="font-heading text-xl text-rose-800 font-medium">Refine Selection</span>
            <button
              onClick={onResetFilters}
              className="text-[11px] font-mono text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* 1. Origin Filter: French vs Arabic */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold block">
              Olfactory Tradition
            </label>
            <div className="space-y-1.5 text-xs font-body">
              {[
                { label: 'All Traditions', value: 'All' },
                { label: 'French Haute Parfumerie (Grasse)', value: 'French Atelier' },
                { label: 'Arabian Royal Oud (Dubai & Muscat)', value: 'Arabian Royal' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedOrigin(opt.value as any)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                    selectedOrigin === opt.value
                      ? 'bg-rose-50 text-rose-800 font-bold border border-rose-200'
                      : 'text-slate-600 hover:bg-pink-50/50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selectedOrigin === opt.value && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Fragrance Family Filter */}
          <div className="space-y-2 pt-2 border-t border-pink-100">
            <label className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold block">
              Fragrance Family
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-body">
              {(['All', 'Oud', 'Floral', 'Woody', 'Amber', 'Citrus', 'Gourmand', 'Leather'] as const).map(
                (fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamily(fam as any)}
                    className={`text-center py-1.5 px-2 rounded-xl transition-all ${
                      selectedFamily === fam
                        ? 'bg-rose-600 text-white font-bold shadow-xs'
                        : 'bg-rose-50/60 hover:bg-rose-100 text-slate-700 border border-pink-200/80'
                    }`}
                  >
                    {fam}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 3. Gender / Persona */}
          <div className="space-y-2 pt-2 border-t border-pink-100">
            <label className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold block">
              Gender & Persona
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-body">
              {(['All', 'Unisex', 'Women', 'Men'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g as any)}
                  className={`text-center py-1.5 px-2 rounded-xl transition-all ${
                    selectedGender === g
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'bg-rose-50/60 hover:bg-rose-100 text-slate-700 border border-pink-200/80'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Price Slider */}
          <div className="space-y-2 pt-2 border-t border-pink-100">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="uppercase text-rose-600 font-semibold">Max Price</span>
              <span className="font-bold text-rose-800 font-heading text-lg">${maxPrice}</span>
            </div>
            <input
              type="range"
              min={180}
              max={450}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-rose-600 bg-pink-100 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>$180</span>
              <span>$450+</span>
            </div>
          </div>

          {/* 5. Rating Filter */}
          <div className="space-y-2 pt-2 border-t border-pink-100 text-xs font-body">
            <label className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold block">
              Customer Rating
            </label>
            <div className="space-y-1">
              {[
                { label: 'All Reviews', rating: 0 },
                { label: '4.9★ & Above (Exceptional)', rating: 4.9 },
                { label: '4.8★ & Above (Highly Acclaimed)', rating: 4.8 },
              ].map((opt) => (
                <button
                  key={opt.rating}
                  onClick={() => setMinRating(opt.rating)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                    minRating === opt.rating
                      ? 'bg-rose-50 text-rose-800 font-bold border border-rose-200'
                      : 'text-slate-600 hover:bg-pink-50/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{opt.label}</span>
                  </span>
                  {minRating === opt.rating && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* 6. In Stock Only */}
          <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-xs font-body">
            <span className="text-slate-700 font-medium">In-Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-pink-300 text-rose-600 focus:ring-rose-400 w-4 h-4"
            />
          </div>
        </aside>

        {/* Right Area: Product Cards Grid (3 Columns) */}
        <div className="md:col-span-9">
          {perfumes.length === 0 ? (
            <div className="py-20 text-center bg-white border border-pink-200 rounded-3xl p-8 space-y-4 shadow-sm">
              <Sparkles className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="font-heading text-3xl text-rose-800">No matching extraits found</h3>
              <p className="text-xs text-slate-500 font-body max-w-sm mx-auto">
                No perfumes currently match your selected filters. Try broadening your criteria or reset filters.
              </p>
              <button
                onClick={onResetFilters}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold font-body uppercase tracking-wider transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {perfumes.map((perfume) => {
                const wish = isWishlisted(perfume.id);
                const isHovered = hoveredCardId === perfume.id;

                return (
                  <div
                    key={perfume.id}
                    onMouseEnter={() => setHoveredCardId(perfume.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    className="bg-white border border-pink-200/90 hover:border-rose-300 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 flex flex-col group relative"
                  >
                    {/* Origin Badge */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-xs font-semibold shadow-xs ${
                          perfume.origin === 'Arabian Royal'
                            ? 'bg-amber-100/90 text-amber-900 border border-amber-300'
                            : 'bg-rose-100/90 text-rose-900 border border-pink-300'
                        }`}
                      >
                        {perfume.origin === 'Arabian Royal' ? 'Arabian Oud' : 'French Atelier'}
                      </span>
                      {perfume.badge && (
                        <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/95 text-rose-700 border border-pink-200 font-semibold shadow-xs">
                          {perfume.badge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button with Heart Micro-Animation */}
                    <button
                      onClick={() => onToggleWishlist(perfume)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 border border-pink-200 shadow-sm transition-all active:scale-125"
                      title="Save to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          wish ? 'fill-rose-600 text-rose-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Card Photo (with image-swap on hover) */}
                    <div
                      onClick={() => onSelectPerfume(perfume)}
                      className="relative aspect-4/3 w-full bg-rose-50/40 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={isHovered ? perfume.hoverImage : perfume.image}
                        alt={perfume.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      />

                      {/* Sephora/Amazon Style "Quick View" Overlay Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(perfume);
                        }}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/95 hover:bg-white text-rose-800 text-xs font-body font-bold tracking-wider uppercase rounded-xl border border-pink-200 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center gap-1.5 shadow-md"
                      >
                        <Eye className="w-3.5 h-3.5 text-rose-500" />
                        <span>Quick View</span>
                      </button>
                    </div>

                    {/* Card Content & Metadata */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Family & Concentration Metadata */}
                        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                          <span className="text-rose-600 font-semibold">{perfume.family}</span>
                          <span className="flex items-center gap-1 text-slate-700">
                            <Star className="w-3 h-3 fill-rose-500 text-rose-500" />
                            <span className="font-bold">{perfume.rating}</span>
                            <span className="text-[10px] text-slate-400">({perfume.reviewsCount})</span>
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => onSelectPerfume(perfume)}
                          className="text-2xl font-heading font-normal text-rose-800 group-hover:text-pink-600 transition-colors cursor-pointer mt-1"
                        >
                          {perfume.name}
                        </h3>

                        {perfume.arabicName && (
                          <span className="text-sm font-arabic text-amber-900 font-normal block leading-tight mt-0.5" dir="rtl">
                            {perfume.arabicName}
                          </span>
                        )}

                        <p className="text-xs text-slate-600 font-body line-clamp-2 mt-1">
                          {perfume.subtitle}
                        </p>
                      </div>

                      {/* Key Note Chips */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-mono text-rose-600 font-semibold">
                          Dominant Notes:
                        </span>
                        <div className="flex flex-wrap gap-1 text-xs">
                          {perfume.notes.heart.slice(0, 3).map((note, idx) => (
                            <span
                              key={idx}
                              className="bg-rose-50/80 border border-pink-200/80 px-2 py-0.5 rounded-lg text-[10px] text-rose-800 font-body"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price & Primary Buy CTA */}
                      <div className="pt-3 border-t border-pink-100 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-heading font-bold text-rose-700 tabular-nums">
                              ${perfume.price}
                            </span>
                            {perfume.originalPrice && (
                              <span className="text-xs text-slate-400 line-through font-mono">
                                ${perfume.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 block">50ml Extrait</span>
                        </div>

                        <button
                          onClick={() => onAddToCart(perfume, '50ml')}
                          className="px-3.5 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-rose-200/50 transition-all active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
