import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Gift,
  Sparkles,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Tag,
} from 'lucide-react';
import { CartItem } from './SlideOutCart';
import { DISCOVERY_SAMPLES, PERFUMES_LIST, PerfumeItem } from '../data/perfumes';

interface FullCartPageProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoApplied: boolean;
  setPromoApplied: (val: boolean) => void;
  selectedSamples: string[];
  setSelectedSamples: (samples: string[]) => void;
  isGiftWrapped: boolean;
  setIsGiftWrapped: (wrapped: boolean) => void;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  onAddToCart: (perfume: PerfumeItem, volume?: '30ml' | '50ml' | '100ml') => void;
}

export const FullCartPage: React.FC<FullCartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  promoCode,
  setPromoCode,
  promoApplied,
  setPromoApplied,
  selectedSamples,
  setSelectedSamples,
  isGiftWrapped,
  setIsGiftWrapped,
  subtotal,
  discount,
  shipping,
  total,
  onAddToCart,
}) => {
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoError, setPromoError] = useState('');
  const freeShippingThreshold = 150;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'AURELIA15' || clean === 'OUD20' || clean === 'PARIS10') {
      setPromoCode(clean);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Use "AURELIA15" for 15% VIP discount.');
    }
  };

  const toggleSample = (sampleId: string) => {
    if (selectedSamples.includes(sampleId)) {
      setSelectedSamples(selectedSamples.filter((id) => id !== sampleId));
    } else {
      if (selectedSamples.length < 2) {
        setSelectedSamples([...selectedSamples, sampleId]);
      } else {
        setSelectedSamples([selectedSamples[1], sampleId]);
      }
    }
  };

  // Cross-sell recommendations not already in bag
  const recommendedPerfumes = PERFUMES_LIST.filter(
    (p) => !items.some((item) => item.perfumeId === p.id)
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onContinueShopping}
          className="text-xs font-body font-semibold uppercase tracking-wider text-rose-700 hover:text-pink-600 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping Catalog</span>
        </button>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Bag Reference: AUR-CART-2026
        </span>
      </div>

      <div className="border-b border-pink-100 pb-4">
        <h1 className="text-4xl md:text-5xl font-heading text-rose-800 font-normal">
          Your Haute Parfumerie Bag
        </h1>
        <p className="text-xs text-slate-600 font-body mt-1">
          Review your handcrafted extraits, complimentary Grasse discovery vials, and gift presentation.
        </p>
      </div>

      {/* Free Worldwide Shipping Meter */}
      <div className="p-4 bg-gradient-to-r from-[#fff7f9] via-pink-50/60 to-[#fff7f9] rounded-2xl border border-pink-200">
        <div className="flex justify-between items-center text-xs mb-2">
          {subtotal >= freeShippingThreshold || items.length === 0 ? (
            <span className="text-rose-700 font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-rose-600" />
              Complimentary Worldwide Express Courier Unlocked!
            </span>
          ) : (
            <span className="text-slate-700">
              Add <strong className="text-rose-700">${freeShippingThreshold - subtotal}</strong> more to qualify for Free Worldwide Express Delivery
            </span>
          )}
          <span className="font-mono text-slate-600 text-xs font-semibold">
            ${subtotal} / ${freeShippingThreshold}
          </span>
        </div>
        <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-pink-100 p-8 space-y-4 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-rose-50 border border-pink-200 mx-auto flex items-center justify-center text-rose-600">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-heading text-rose-800">Your bag is currently empty</h2>
          <p className="text-xs text-slate-600 font-body max-w-md mx-auto">
            Discover our flagship French Haute Parfumerie Extraits and Royal Arabian Cambodian Ouds to fill your bespoke flacon collection.
          </p>
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase inline-flex items-center gap-2 shadow-md shadow-rose-200/50"
          >
            <span>Explore Fragrance Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Items Table & Options */}
          <div className="lg:col-span-8 space-y-8">
            {/* Table of Cart Items */}
            <div className="bg-white rounded-3xl border border-pink-200 overflow-hidden shadow-sm divide-y divide-pink-100">
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-[#fff7f9] text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                <span className="col-span-6">Fragrance Flacon</span>
                <span className="col-span-2 text-center">Volume</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Subtotal</span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                  {/* Fragrance Info */}
                  <div className="sm:col-span-6 flex items-center gap-4 w-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-rose-50 border border-pink-200 shrink-0 shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-rose-600 font-semibold block">
                        {item.origin || 'Haute Parfumerie'}
                      </span>
                      <h3 className="text-2xl font-heading text-rose-800 truncate">{item.name}</h3>
                      {item.engraving && (
                        <p className="text-xs text-rose-700 italic font-body mt-0.5">
                          Personalized Engraving: "{item.engraving}"
                        </p>
                      )}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 mt-2 transition-colors font-body"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="sm:col-span-2 text-center w-full sm:w-auto">
                    <span className="inline-block px-3 py-1 bg-rose-50 border border-pink-200 rounded-lg text-xs font-mono font-semibold text-rose-800">
                      {item.volume}
                    </span>
                    <span className="block text-[11px] text-slate-500 font-mono mt-1">
                      ${item.price} each
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="sm:col-span-2 flex justify-center w-full sm:w-auto">
                    <div className="flex items-center gap-2.5 border border-pink-200 rounded-xl bg-[#fffbfc] px-3 py-1 text-xs shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-slate-500 hover:text-rose-700 font-bold p-1"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-slate-800 font-bold text-sm min-w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-slate-500 hover:text-rose-700 font-bold p-1"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-2 text-right w-full sm:w-auto">
                    <span className="font-heading text-2xl font-bold text-rose-800 tabular-nums">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Complimentary Discovery Samples (2 free) */}
            <div className="bg-white rounded-3xl border border-pink-200 p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <h3 className="font-heading text-2xl text-rose-800 font-normal">
                    Complimentary Discovery Vials (2 Included)
                  </h3>
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-pink-200 font-bold">
                  {selectedSamples.length} of 2 Selected
                </span>
              </div>
              <p className="text-xs text-slate-600 font-body">
                Select 2 complimentary 2ml spray extraits to test on your skin before opening your main flacon:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DISCOVERY_SAMPLES.map((sample) => {
                  const isSelected = selectedSamples.includes(sample.id);
                  return (
                    <div
                      key={sample.id}
                      onClick={() => toggleSample(sample.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50/80 border-rose-400 shadow-xs ring-1 ring-rose-300'
                          : 'bg-[#fffbfc] border-pink-200 hover:border-rose-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                              sample.origin === 'Arabian Royal'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {sample.origin === 'Arabian Royal' ? 'Arabic Oud' : 'French'}
                          </span>
                          <span className="text-xs font-bold text-slate-800 font-body">{sample.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-body">Olfactory Family: {sample.family} Accord</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3 transition-colors ${
                          isSelected ? 'bg-rose-600 text-white' : 'border border-pink-300 bg-white text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gift Presentation Packaging Option */}
            <div className="bg-white rounded-3xl border border-pink-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-pink-200 flex items-center justify-center text-rose-600 shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-heading text-rose-800">Signature Blush Coffret Packaging</h4>
                  <p className="text-xs text-slate-600 font-body">
                    Hand-crafted Palais-Royal lacquer keepsake box, French grosgrain ribbon & golden wax seal.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-rose-50 px-4 py-2 rounded-xl border border-pink-200 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition-colors">
                <input
                  type="checkbox"
                  checked={isGiftWrapped}
                  onChange={(e) => setIsGiftWrapped(e.target.checked)}
                  className="rounded border-pink-300 text-rose-600 focus:ring-rose-400 w-4 h-4"
                />
                <span>Include Gift Coffret ($0)</span>
              </label>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-pink-200 p-6 space-y-6 shadow-sm sticky top-24">
              <h3 className="font-heading text-2xl text-rose-800 border-b border-pink-100 pb-3">
                Order Summary
              </h3>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-semibold block">
                  VIP Privilege Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. AURELIA15"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-[#fffbfc] border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 uppercase font-mono tracking-wider focus:border-rose-400 focus:outline-hidden shadow-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-pink-200 text-xs font-bold text-rose-700 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-emerald-700 font-mono font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> 15% VIP Maison Privilege Applied
                  </p>
                )}
                {promoError && <p className="text-[11px] text-red-600 font-body">{promoError}</p>}
              </form>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs font-body border-t border-pink-100 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-slate-800 tabular-nums">${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>VIP Privilege Discount (15%)</span>
                    <span className="tabular-nums">-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Worldwide Express Courier</span>
                  <span className="font-medium text-slate-800">
                    {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                  </span>
                </div>
                {isGiftWrapped && (
                  <div className="flex justify-between text-slate-600">
                    <span>Signature Blush Coffret</span>
                    <span className="text-emerald-700 font-semibold">Complimentary</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Estimated VAT & Duties</span>
                  <span className="text-slate-800 font-medium">Included</span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-pink-100">
                  <span className="font-heading text-2xl text-rose-800">Final Total</span>
                  <span className="font-heading text-3xl font-bold text-rose-800 tabular-nums">
                    ${total}
                  </span>
                </div>
              </div>

              {/* Primary Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl text-xs font-body tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-200/60 transition-all active:scale-[0.98]"
              >
                <span>Proceed to Bespoke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Guarantees */}
              <div className="pt-2 space-y-2 border-t border-pink-100 text-[11px] text-slate-500 font-body">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>100% Authentic Grasse & Dubai Formulations</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Test with included 2ml vials first. 30-day flacon returns.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Insured Express Courier with live tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Amazon-style "Frequently Bought With" Recommendations Carousel */}
      {recommendedPerfumes.length > 0 && (
        <div className="pt-8 border-t border-pink-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-3xl text-rose-800">
              Curated Companions for Your Fragrance Wardrobe
            </h3>
            <span className="text-xs font-mono text-rose-600 font-semibold">Recommended Pairings</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommendedPerfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="bg-white border border-pink-200 rounded-2xl p-4 flex flex-col justify-between group hover:border-rose-400 hover:shadow-md transition-all"
              >
                <div className="flex gap-3">
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-16 h-16 rounded-xl object-cover bg-rose-50 border border-pink-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-rose-600 uppercase font-semibold">
                      {perfume.origin === 'Arabian Royal' ? 'Arabian Oud' : 'French Atelier'}
                    </span>
                    <h4 className="font-heading text-xl text-rose-800 truncate">{perfume.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate font-body">{perfume.subtitle}</p>
                    <span className="font-heading text-base font-bold text-rose-800 mt-1 block">
                      ${perfume.price} <span className="text-[10px] text-slate-400 font-mono">/ 50ml</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(perfume, '50ml')}
                  className="mt-3 w-full py-2 bg-rose-50 hover:bg-rose-100 border border-pink-200 text-rose-700 font-semibold rounded-xl text-xs font-body tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
