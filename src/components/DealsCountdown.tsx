import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingBag, Eye, Heart, Sparkles, Check, Leaf } from 'lucide-react';
import { PerfumeItem } from '../data/perfumes';

interface DealsCountdownProps {
  deals: PerfumeItem[];
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onAddToCart: (perfume: PerfumeItem) => void;
  onToggleWishlist: (perfume: PerfumeItem) => void;
  isWishlisted: (id: string) => boolean;
}

export const DealsCountdown: React.FC<DealsCountdownProps> = ({
  deals,
  onSelectPerfume,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  // Live countdown timer state (e.g. 09h : 42m : 18s)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 }; // reset daily deal
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="bg-gradient-to-r from-[#fff5f8] via-[#fff9fa] to-rose-50/40 border-y border-pink-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Live Countdown Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-pink-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold mb-1">
              <Flame className="w-4 h-4 text-rose-600 fill-rose-600 animate-bounce" />
              <span>Limited Daily Allocation · Palais-Royal & Dubai</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading text-rose-800">
              Deals of the Day: French & Arabian Masterpieces
            </h2>
            <p className="text-xs text-slate-600 font-body">
              Special pricing on rare extraits de parfum, bottled at 28–32% pure oil concentration.
            </p>
          </div>

          {/* Amazon-style Live Countdown Pill */}
          <div className="flex items-center gap-3 bg-white border border-pink-200 rounded-2xl p-2.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-rose-700 text-xs font-mono font-semibold uppercase pl-1">
              <Clock className="w-4 h-4 text-rose-600 animate-spin-slow" />
              <span>Ends In:</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-rose-800">
              <span className="bg-rose-50 border border-pink-200 px-2 py-1 rounded-lg text-rose-700">
                {format2(timeLeft.hours)}h
              </span>
              <span>:</span>
              <span className="bg-rose-50 border border-pink-200 px-2 py-1 rounded-lg text-rose-700">
                {format2(timeLeft.minutes)}m
              </span>
              <span>:</span>
              <span className="bg-rose-50 border border-pink-200 px-2 py-1 rounded-lg text-rose-700">
                {format2(timeLeft.seconds)}s
              </span>
            </div>
          </div>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((perfume) => {
            const savings = perfume.originalPrice ? perfume.originalPrice - perfume.price : 50;
            const discountPct = perfume.originalPrice
              ? Math.round((savings / perfume.originalPrice) * 100)
              : 15;
            const wish = isWishlisted(perfume.id);

            return (
              <div
                key={perfume.id}
                className="bg-white border border-pink-200/90 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 flex flex-col sm:flex-row gap-5 relative group"
              >
                {/* Savings Pill */}
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white" />
                  <span>Save ${savings} (-{discountPct}%)</span>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={() => onToggleWishlist(perfume)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 border border-pink-200 shadow-sm transition-all"
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${wish ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>

                {/* Image side */}
                <div
                  onClick={() => onSelectPerfume(perfume)}
                  className="w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-rose-50/50 relative cursor-pointer shrink-0 border border-pink-100"
                >
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs text-[10px] font-mono text-center py-1 rounded-lg text-slate-700 border border-pink-100 font-semibold">
                    {perfume.origin === 'Arabian Royal' ? 'Arabian Royal Heritage' : 'French Atelier Grasse'}
                  </div>
                </div>

                {/* Content side */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-rose-600 font-bold">{perfume.family}</span>
                      <span className="text-pink-300">·</span>
                      <span className="text-slate-600">{perfume.concentration}</span>
                      <span className="text-pink-300">·</span>
                      <span className="text-slate-600">{perfume.concentrationPct}% Pure Oil</span>
                      {perfume.hasRareIngredients && perfume.sustainablyHarvested && (
                        <span className="inline-flex items-center gap-1 text-[8.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider shadow-2xs">
                          <Leaf className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                          <span>Sustainably Harvested</span>
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => onSelectPerfume(perfume)}
                      className="font-heading text-2xl md:text-3xl font-normal text-rose-800 group-hover:text-pink-600 transition-colors cursor-pointer mt-0.5"
                    >
                      {perfume.name}
                    </h3>

                    <p className="text-xs text-slate-600 font-body line-clamp-2 mt-1">
                      {perfume.subtitle}
                    </p>

                    {/* Stock Urgency Bar */}
                    <div className="mt-2.5 p-2 bg-rose-50/60 rounded-xl border border-pink-200 text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-rose-700 font-semibold">
                        <span>Daily Batch Allocation:</span>
                        <span>{perfume.stockCount} flacons left</span>
                      </div>
                      <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                          style={{ width: `${Math.min(100, (perfume.stockCount / 30) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing and CTAs */}
                  <div className="pt-2 border-t border-pink-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-3xl font-bold text-rose-700 tabular-nums">
                          ${perfume.price}
                        </span>
                        {perfume.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                            ${perfume.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold block">
                        Free Worldwide Express Courier
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectPerfume(perfume)}
                        className="p-2.5 rounded-xl border border-pink-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors shadow-xs"
                        title="View Olfactory Architecture"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onAddToCart(perfume)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-body font-bold text-xs uppercase tracking-wider shadow-md shadow-rose-200/50 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Claim Deal</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
