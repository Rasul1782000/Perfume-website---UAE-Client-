import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Star,
  Check,
  ChevronDown,
  Clock,
  Wind,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ArrowRight,
  Share2,
  Gift,
  Leaf,
} from 'lucide-react';
import { PerfumeItem, BundleItem } from '../data/perfumes';

interface ProductDetailPageProps {
  perfume: PerfumeItem;
  onBack: () => void;
  onAddToCart: (perfume: PerfumeItem, volume: '30ml' | '50ml' | '100ml', engraving: string) => void;
  onAddBundleToCart: (items: { name: string; price: number; volume?: string }[]) => void;
  onToggleWishlist: (perfume: PerfumeItem) => void;
  isWishlisted: boolean;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  perfume,
  onBack,
  onAddToCart,
  onAddBundleToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  // Volume state
  const [selectedVolume, setSelectedVolume] = useState<'30ml' | '50ml' | '100ml'>('50ml');
  const [selectedImage, setSelectedImage] = useState(perfume.image);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Engraving state
  const [isEngravingEnabled, setIsEngravingEnabled] = useState(false);
  const [engravingText, setEngravingText] = useState('');

  // Accordion drawer states
  const [openAccordion, setOpenAccordion] = useState<string>('pyramid');

  // Amazon-style "Frequently Bought Together" bundle selection
  const [bundleSelected, setBundleSelected] = useState<{ [key: string]: boolean }>({
    main: true,
    ...(perfume.frequentlyBoughtWith?.reduce((acc, item) => ({ ...acc, [item.id]: true }), {}) || {}),
  });

  // Quantity
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const currentPrice = perfume.volumePrices[selectedVolume];

  // Image zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleBuy = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(perfume, selectedVolume, isEngravingEnabled ? engravingText : '');
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  // Bundle calculations
  const bundleItems = perfume.frequentlyBoughtWith || [];
  const isMainSelected = bundleSelected['main'];
  const totalBundlePrice =
    (isMainSelected ? currentPrice : 0) +
    bundleItems.reduce((sum, item) => (bundleSelected[item.id] ? sum + item.price : sum), 0);

  const handleAddBundle = () => {
    const itemsToAdd = [];
    if (isMainSelected) {
      itemsToAdd.push({ name: `${perfume.name} (${selectedVolume})`, price: currentPrice });
    }
    bundleItems.forEach((item) => {
      if (bundleSelected[item.id]) {
        itemsToAdd.push({ name: item.name, price: item.price });
      }
    });
    if (itemsToAdd.length > 0) {
      onAddBundleToCart(itemsToAdd);
    }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-body text-slate-500">
        <button onClick={onBack} className="hover:text-rose-700 transition-colors">
          Home
        </button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-rose-700 transition-colors">
          Collections
        </button>
        <span>/</span>
        <span className="text-rose-600 font-medium">
          {perfume.origin === 'Arabian Royal' ? 'Arabian Royal Oud' : 'French Haute Parfumerie'}
        </span>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{perfume.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery (Left) & Purchasing Module (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Interactive Photo Gallery with Zoom Lens */}
        <div className="lg:col-span-6 space-y-4 sticky top-28">
          <div
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative aspect-square w-full rounded-3xl overflow-hidden bg-rose-50/40 border border-pink-200 shadow-xl shadow-rose-100/60 cursor-crosshair group"
          >
            <img
              src={selectedImage}
              alt={perfume.name}
              className={`w-full h-full object-cover transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-xs font-semibold shadow-xs ${
                  perfume.origin === 'Arabian Royal'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-rose-100 text-rose-900 border border-pink-300'
                }`}
              >
                {perfume.originLabel}
              </span>
              {perfume.badge && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 text-rose-700 border border-pink-200 font-semibold shadow-xs">
                  {perfume.badge}
                </span>
              )}
              {perfume.hasRareIngredients && perfume.sustainablyHarvested && (
                <span className="text-[9.5px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-xs flex items-center gap-1.5">
                  <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Sustainably Harvested</span>
                </span>
              )}
            </div>

            {/* Hover Zoom Prompt */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-[10px] font-mono text-slate-700 px-3 py-1 rounded-lg border border-pink-200 opacity-80 group-hover:opacity-100 transition-opacity">
              Hover to Zoom Lens
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {[perfume.image, perfume.hoverImage, ...(perfume.galleryImages || [])]
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-rose-50/50 ${
                    selectedImage === imgUrl
                      ? 'border-rose-500 scale-105 shadow-md shadow-rose-200/50'
                      : 'border-pink-200 hover:border-rose-300'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
          </div>
        </div>

        {/* Right Column: Title, Volume Selector, Engraving, Price & CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
                  {perfume.brand}
                </span>
                {perfume.hasRareIngredients && perfume.sustainablyHarvested && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider shadow-2xs">
                    <Leaf className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    <span>Sustainably Harvested Botanicals</span>
                  </span>
                )}
              </div>
              <button
                onClick={() => onToggleWishlist(perfume)}
                className="p-2 rounded-full border border-pink-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all flex items-center gap-1.5 text-xs font-body"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span className="hidden sm:inline-block">
                  {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </span>
              </button>
            </div>

            <h1 className="text-4xl md:text-5xl font-heading text-rose-800 leading-tight">
              {perfume.name}
            </h1>

            {perfume.arabicName && (
              <span className="text-2xl font-arabic text-amber-900 font-normal block leading-loose" dir="rtl">
                {perfume.arabicName}
              </span>
            )}

            <p className="text-sm text-slate-600 font-body leading-relaxed">{perfume.subtitle}</p>

            {/* Rare Ingredients Origin Banner */}
            {perfume.hasRareIngredients && perfume.rareIngredients && perfume.rareIngredients.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-900 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold">Artisanal Reserve Harvest:</span>
                <span>{perfume.rareIngredients.join(' · ')}</span>
              </div>
            )}

            {/* Ratings & Proof */}
            <div className="flex items-center gap-4 text-xs font-body pt-1">
              <div className="flex items-center gap-1 text-rose-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-rose-500 text-rose-500" />
                ))}
                <span className="font-bold ml-1 text-slate-800">{perfume.rating}</span>
              </div>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-medium">({perfume.reviewsCount} verified reviews)</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-700 font-mono font-semibold">In Stock · Ready for Dispatch</span>
            </div>
          </div>

          {/* Price Box with Amazon-Style Savings & Taxes */}
          <div className="p-4 bg-[#fff7f9] rounded-2xl border border-pink-200 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-bold text-rose-700 tabular-nums">
                  ${currentPrice}
                </span>
                {perfume.originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-mono">
                    ${perfume.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-body mt-0.5">
                All import duties & taxes included. Complimentary worldwide express courier.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-rose-700 font-bold block">
                {perfume.concentration}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {perfume.concentrationPct}% Oil Concentration
              </span>
            </div>
          </div>

          {/* Volume Selector (Sephora-Style Pill Buttons) */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-rose-700 font-semibold block">
              Select Flacon Volume
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['30ml', '50ml', '100ml'] as const).map((vol) => (
                <button
                  key={vol}
                  onClick={() => setSelectedVolume(vol)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedVolume === vol
                      ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold shadow-xs'
                      : 'border-pink-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50/50'
                  }`}
                >
                  <div className="font-heading text-2xl text-rose-700">{vol}</div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">
                    ${perfume.volumePrices[vol]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Complimentary Personalized Flacon Engraving */}
          <div className="p-4 bg-white rounded-2xl border border-pink-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-body font-semibold text-slate-800">
                  Complimentary Atelier Engraving
                </span>
              </div>
              <input
                type="checkbox"
                checked={isEngravingEnabled}
                onChange={(e) => setIsEngravingEnabled(e.target.checked)}
                className="rounded border-pink-300 text-rose-600 focus:ring-rose-400 w-4 h-4"
              />
            </div>

            {isEngravingEnabled && (
              <div className="space-y-1.5 animate-in fade-in-50">
                <input
                  type="text"
                  maxLength={14}
                  placeholder="Initials or Name (e.g., L.M. or ELEANOR)"
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                  className="w-full bg-[#fffbfc] border border-pink-300 rounded-xl p-2.5 text-xs font-body uppercase tracking-widest text-rose-800 focus:outline-hidden focus:border-rose-500"
                />
                <p className="text-[10px] text-slate-500 font-mono">
                  Hand-etched onto the brushed metal collar in Paris or Dubai.
                </p>
              </div>
            )}
          </div>

          {/* Quantity and Primary Add to Bag CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-pink-200 rounded-xl bg-white px-3 py-2 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-500 hover:text-rose-700 font-bold p-1"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-sm font-semibold text-slate-800 px-3">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-500 hover:text-rose-700 font-bold p-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleBuy}
                className="flex-1 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl text-xs font-body tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-200/60 transition-all active:scale-[0.98]"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add to Shopping Bag — ${currentPrice * quantity}
                    </span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
              <span>✦ 2 Free Discovery Vials Included</span>
              <span>✦ Free 30-Day Unopened Returns</span>
            </div>
          </div>

          {/* Amazon-Style "Frequently Bought Together" Bundle Cross-Sell */}
          {bundleItems.length > 0 && (
            <div className="p-5 bg-gradient-to-r from-[#fff7f9] to-rose-50/50 rounded-3xl border border-pink-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl text-rose-800 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  Frequently Bought Together
                </span>
                <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                  Save 10% Bundle
                </span>
              </div>

              {/* Bundle items visual strip with plus signs */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-pink-200 shrink-0">
                  <img src={perfume.image} alt={perfume.name} className="w-full h-full object-cover" />
                </div>
                {bundleItems.map((bItem, idx) => (
                  <React.Fragment key={bItem.id}>
                    <span className="font-bold text-slate-400 text-lg">+</span>
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-pink-200 shrink-0">
                      <img src={bItem.image} alt={bItem.name} className="w-full h-full object-cover" />
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Checkboxes list */}
              <div className="space-y-2 text-xs font-body">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMainSelected}
                    onChange={(e) => setBundleSelected({ ...bundleSelected, main: e.target.checked })}
                    className="rounded border-pink-300 text-rose-600"
                  />
                  <span>
                    <strong>This Flacon:</strong> {perfume.name} ({selectedVolume}) —{' '}
                    <span className="font-mono text-rose-700 font-bold">${currentPrice}</span>
                  </span>
                </label>

                {bundleItems.map((bItem) => (
                  <label key={bItem.id} className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!bundleSelected[bItem.id]}
                      onChange={(e) =>
                        setBundleSelected({ ...bundleSelected, [bItem.id]: e.target.checked })
                      }
                      className="rounded border-pink-300 text-rose-600"
                    />
                    <span>
                      <strong>Companion:</strong> {bItem.name} —{' '}
                      <span className="font-mono text-rose-700 font-bold">${bItem.price}</span>
                    </span>
                  </label>
                ))}
              </div>

              {/* Bundle CTA */}
              <div className="pt-2 border-t border-pink-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-body block">Bundle Total Price:</span>
                  <span className="font-heading text-2xl font-bold text-rose-800">${totalBundlePrice}</span>
                </div>
                <button
                  onClick={handleAddBundle}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold font-body uppercase tracking-wider transition-colors shadow-xs"
                >
                  Add Selected to Bag
                </button>
              </div>
            </div>
          )}

          {/* Accordion Drawers: Olfactory Pyramid, Heritage, Sillage & Longevity */}
          <div className="space-y-2 pt-2 border-t border-pink-100">
            {/* 1. Visual Olfactory Pyramid */}
            <div className="border border-pink-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleAccordion('pyramid')}
                className="w-full p-4 text-left flex items-center justify-between font-heading text-xl text-rose-800 hover:bg-rose-50/50 transition-colors"
              >
                <span>Olfactory Architecture (Pyramid)</span>
                <ChevronDown
                  className={`w-4 h-4 text-rose-600 transition-transform ${
                    openAccordion === 'pyramid' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'pyramid' && (
                <div className="p-4 pt-0 space-y-3 text-xs font-body border-t border-pink-100">
                  <div className="p-3 bg-rose-50/60 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-rose-700 font-mono text-[11px] font-bold uppercase">
                      <span>Head / Top Notes (First 30 Mins)</span>
                      <span>Volatile Sparkle</span>
                    </div>
                    <p className="text-slate-700 text-xs">{perfume.notes.top.join(' · ')}</p>
                  </div>

                  <div className="p-3 bg-rose-50/60 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-rose-700 font-mono text-[11px] font-bold uppercase">
                      <span>Heart / Cœur Notes (Hours 1–6)</span>
                      <span>Soul of the Flacon</span>
                    </div>
                    <p className="text-slate-700 text-xs">{perfume.notes.heart.join(' · ')}</p>
                  </div>

                  <div className="p-3 bg-rose-50/60 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-rose-700 font-mono text-[11px] font-bold uppercase">
                      <span>Fond / Base Notes (Hours 6–24+)</span>
                      <span>Skin Resonance</span>
                    </div>
                    <p className="text-slate-700 text-xs">{perfume.notes.base.join(' · ')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Longevity & Sillage Meters */}
            <div className="border border-pink-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleAccordion('meters')}
                className="w-full p-4 text-left flex items-center justify-between font-heading text-xl text-rose-800 hover:bg-rose-50/50 transition-colors"
              >
                <span>Performance: Longevity & Sillage</span>
                <ChevronDown
                  className={`w-4 h-4 text-rose-600 transition-transform ${
                    openAccordion === 'meters' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'meters' && (
                <div className="p-4 pt-0 space-y-4 text-xs font-body border-t border-pink-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-rose-50/60 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-rose-700 font-semibold uppercase flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-rose-600" />
                        Skin Longevity
                      </span>
                      <span className="font-heading text-2xl text-rose-800 block">{perfume.longevity}</span>
                      <p className="text-[10px] text-slate-500">Formulated with 28–32% pure perfume oils.</p>
                    </div>

                    <div className="p-3 bg-rose-50/60 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-rose-700 font-semibold uppercase flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-rose-600" />
                        Projection / Sillage
                      </span>
                      <span className="font-heading text-2xl text-rose-800 block">{perfume.sillage}</span>
                      <p className="text-[10px] text-slate-500">Leaves an unforgettable royal sillage trail.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Heritage & Perfumer Story */}
            <div className="border border-pink-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => toggleAccordion('heritage')}
                className="w-full p-4 text-left flex items-center justify-between font-heading text-xl text-rose-800 hover:bg-rose-50/50 transition-colors"
              >
                <span>French & Arabian Heritage Story</span>
                <ChevronDown
                  className={`w-4 h-4 text-rose-600 transition-transform ${
                    openAccordion === 'heritage' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'heritage' && (
                <div className="p-4 pt-0 space-y-3 text-xs font-body leading-relaxed text-slate-700 border-t border-pink-100">
                  <p>{perfume.description}</p>
                  <p className="italic text-slate-600 border-l-2 border-rose-400 pl-3">
                    "{perfume.heritageStory}"
                  </p>
                  <p className="font-mono text-[11px] text-rose-700 font-semibold">
                    Master Nose: {perfume.perfumer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Customer Reviews Section (Amazon/Sephora Style) */}
      <section className="pt-8 border-t border-pink-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-heading text-rose-800">Verified Customer Reviews</h3>
            <p className="text-xs text-slate-600 font-body">
              Real testimonials from clients across Paris, Dubai, New York, and Riyadh.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center p-3 bg-rose-50 rounded-2xl border border-pink-200">
              <span className="font-heading text-3xl font-bold text-rose-800 block">
                {perfume.rating} / 5.0
              </span>
              <div className="flex items-center justify-center gap-0.5 text-rose-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-rose-500" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perfume.reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white rounded-3xl border border-pink-200 space-y-2.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-body font-bold text-sm text-slate-800">{rev.author}</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{rev.location} · {rev.date}</span>
                </div>

                <div className="flex items-center gap-0.5 text-rose-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-rose-500" />
                  ))}
                </div>
              </div>

              <h4 className="font-heading text-xl text-rose-800 font-medium">{rev.title}</h4>
              <p className="text-xs text-slate-600 font-body leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
