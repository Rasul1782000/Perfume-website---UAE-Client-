import React, { useState } from 'react';
import { X, Sparkles, ShoppingBag, Eye, Star, Check, Leaf } from 'lucide-react';
import { PerfumeItem } from '../data/perfumes';

interface QuickViewModalProps {
  perfume: PerfumeItem | null;
  onClose: () => void;
  onAddToCart: (perfume: PerfumeItem, volume: '30ml' | '50ml' | '100ml') => void;
  onViewFullPDP: (perfume: PerfumeItem) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
  onViewFullPDP,
}) => {
  if (!perfume) return null;

  const [selectedVolume, setSelectedVolume] = useState<'30ml' | '50ml' | '100ml'>('50ml');
  const [addedNotice, setAddedNotice] = useState(false);

  const price = perfume.volumePrices[selectedVolume];

  const handleAdd = () => {
    onAddToCart(perfume, selectedVolume);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border border-pink-200 rounded-3xl shadow-2xl flex flex-col md:flex-row text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-slate-500 hover:text-rose-700 border border-pink-200 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image side */}
        <div className="w-full md:w-1/2 p-6 bg-gradient-to-b from-[#fff5f8] to-pink-50/40 flex items-center justify-center border-b md:border-b-0 md:border-r border-pink-100">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-pink-200">
            <img src={perfume.image} alt={perfume.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-white/95 text-rose-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-pink-200 font-semibold shadow-xs">
              {perfume.originLabel}
            </div>
          </div>
        </div>

        {/* Content side */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-rose-600 font-semibold block">
                  {perfume.family} · {perfume.concentration}
                </span>
                {perfume.hasRareIngredients && perfume.sustainablyHarvested && (
                  <span className="inline-flex items-center gap-1 text-[8.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider shadow-2xs">
                    <Leaf className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    <span>Sustainably Harvested</span>
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-heading text-rose-800 leading-tight mt-0.5">{perfume.name}</h2>
              {perfume.arabicName && (
                <span className="text-sm font-body text-amber-800 font-medium">{perfume.arabicName}</span>
              )}
              <p className="text-xs text-slate-600 font-body mt-1 line-clamp-2">{perfume.subtitle}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-1 border-t border-pink-100">
              <span className="font-heading text-3xl font-bold text-rose-700 tabular-nums">${price}</span>
              <span className="text-xs text-slate-500 font-body">Free worldwide express shipping</span>
            </div>

            {/* Volume Picker */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-semibold block">
                Flacon Volume:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['30ml', '50ml', '100ml'] as const).map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setSelectedVolume(vol)}
                    className={`py-2 px-2 rounded-xl border text-center transition-all ${
                      selectedVolume === vol
                        ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold shadow-xs'
                        : 'border-pink-200 bg-white text-slate-700 hover:border-rose-300'
                    }`}
                  >
                    <div className="font-heading text-lg text-rose-700">{vol}</div>
                    <div className="text-[10px] font-mono text-slate-500">${perfume.volumePrices[vol]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accords */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-rose-600 font-semibold">Key Notes:</span>
              <p className="text-xs text-slate-700 font-body">{perfume.notes.heart.join(' · ')}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-3 border-t border-pink-100">
            <button
              onClick={handleAdd}
              className="w-full py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-rose-200/50 transition-all active:scale-95"
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {selectedVolume} to Bag — ${price}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onViewFullPDP(perfume);
              }}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs font-body tracking-wider uppercase transition-colors"
            >
              View Full Olfactory Page & Reviews →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
