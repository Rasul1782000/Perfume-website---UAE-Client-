import React, { useState } from 'react';
import { X, Sparkles, Check, ShoppingBag, ShieldCheck, Droplet, Clock, Wind, Heart } from 'lucide-react';
import { PerfumeItem } from '../data/perfumes';

interface PerfumeDetailModalProps {
  perfume: PerfumeItem | null;
  onClose: () => void;
  onAddToCart: (perfume: PerfumeItem, volume: '30ml' | '50ml' | '100ml', engraving: string) => void;
}

export const PerfumeDetailModal: React.FC<PerfumeDetailModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
}) => {
  if (!perfume) return null;

  const [selectedVolume, setSelectedVolume] = useState<'30ml' | '50ml' | '100ml'>('50ml');
  const [engravingText, setEngravingText] = useState('');
  const [isEngravingEnabled, setIsEngravingEnabled] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'perfumer' | 'rituals'>('notes');

  const currentPrice = perfume.volumePrices[selectedVolume];

  const handleAdd = () => {
    onAddToCart(perfume, selectedVolume, isEngravingEnabled ? engravingText : '');
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-pink-200 rounded-3xl shadow-2xl flex flex-col md:flex-row text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-pink-200 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image Column */}
        <div className="w-full md:w-1/2 relative bg-gradient-to-b from-[#fff5f8] to-pink-50/40 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-pink-100">
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-xl shadow-rose-100/60 border border-pink-200">
            <img
              src={perfume.image}
              alt={perfume.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {perfume.badge && (
              <span className="absolute top-3 left-3 text-[11px] font-mono font-semibold tracking-widest uppercase bg-white/95 text-rose-700 px-3 py-1 rounded-full border border-pink-200 backdrop-blur-xs shadow-xs">
                {perfume.badge}
              </span>
            )}
            <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-xs flex justify-between items-center text-slate-700 border border-pink-200 shadow-sm">
              <span className="font-mono text-[11px] font-medium">{perfume.concentration} ({perfume.concentrationPct}% Oil)</span>
              <span className="text-rose-600 font-body font-semibold">Pure Flacon</span>
            </div>
          </div>
        </div>

        {/* Right: Purchase & Olfactory Architecture Module */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-rose-600 font-semibold tracking-wider uppercase mb-1">
                <span>{perfume.family} Family</span>
                <span>·</span>
                <span>{perfume.concentration}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-normal tracking-wide text-rose-700">{perfume.name}</h2>
              <p className="text-xs text-slate-600 font-body mt-0.5">{perfume.subtitle}</p>
            </div>

            {/* Price display */}
            <div className="flex items-baseline gap-3 pb-3 border-b border-pink-100">
              <span className="text-3xl font-heading font-bold text-rose-700 tabular-nums">${currentPrice}</span>
              <span className="text-xs text-slate-500 font-body">Taxes included · Free expedited delivery</span>
            </div>

            {/* Bottle Volume Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold block">
                Select Flacon Volume
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['30ml', '50ml', '100ml'] as const).map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setSelectedVolume(vol)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      selectedVolume === vol
                        ? 'border-rose-400 bg-rose-50 text-rose-800 font-bold shadow-xs'
                        : 'border-pink-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50/50'
                    }`}
                  >
                    <div className="font-heading text-xl text-rose-700">{vol}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">${perfume.volumePrices[vol]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Engraving Toggle */}
            <div className="p-3 bg-rose-50/50 rounded-2xl border border-pink-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-medium text-slate-800 font-body">Complimentary Atelier Engraving</span>
                </div>
                <input
                  type="checkbox"
                  checked={isEngravingEnabled}
                  onChange={(e) => setIsEngravingEnabled(e.target.checked)}
                  className="rounded border-pink-300 text-rose-600 focus:ring-rose-400"
                />
              </div>

              {isEngravingEnabled && (
                <div className="pt-2">
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="Enter initials or name (max 12 chars)"
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-pink-300 rounded-xl p-2 text-xs font-body uppercase tracking-widest text-rose-800 focus:outline-hidden focus:border-rose-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    Hand-etched onto the brushed metal collar in Paris.
                  </p>
                </div>
              )}
            </div>

            {/* Olfactory Architecture / Perfumer Tabs */}
            <div className="space-y-2 pt-2">
              <div className="flex border-b border-pink-100 text-xs">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-2 px-3 font-medium transition-colors border-b-2 ${
                    activeTab === 'notes' ? 'border-rose-500 text-rose-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Olfactory Pyramid
                </button>
                <button
                  onClick={() => setActiveTab('perfumer')}
                  className={`pb-2 px-3 font-medium transition-colors border-b-2 ${
                    activeTab === 'perfumer' ? 'border-rose-500 text-rose-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  The Perfumer
                </button>
                <button
                  onClick={() => setActiveTab('rituals')}
                  className={`pb-2 px-3 font-medium transition-colors border-b-2 ${
                    activeTab === 'rituals' ? 'border-rose-500 text-rose-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sillage & Longevity
                </button>
              </div>

              {activeTab === 'notes' && (
                <div className="space-y-2.5 text-xs pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-rose-600 font-semibold">Head / Top Notes:</span>
                    <p className="text-slate-700 font-body text-xs mt-0.5">{perfume.notes.top.join(' · ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-rose-600 font-semibold">Heart Notes:</span>
                    <p className="text-slate-700 font-body text-xs mt-0.5">{perfume.notes.heart.join(' · ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-rose-600 font-semibold">Base / Fond:</span>
                    <p className="text-slate-700 font-body text-xs mt-0.5">{perfume.notes.base.join(' · ')}</p>
                  </div>
                </div>
              )}

              {activeTab === 'perfumer' && (
                <div className="pt-2 text-xs space-y-2">
                  <p className="text-slate-700 leading-relaxed font-body italic text-xs">
                    "{perfume.description}"
                  </p>
                  <p className="font-mono text-[11px] text-rose-600 font-semibold">— {perfume.perfumer}</p>
                </div>
              )}

              {activeTab === 'rituals' && (
                <div className="pt-2 text-xs grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-pink-200">
                    <div className="flex items-center gap-1.5 text-rose-600 mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px] uppercase font-semibold">Longevity</span>
                    </div>
                    <span className="font-body font-semibold text-sm text-slate-800">{perfume.longevity}</span>
                  </div>
                  <div className="p-2.5 bg-rose-50/60 rounded-xl border border-pink-200">
                    <div className="flex items-center gap-1.5 text-rose-600 mb-1">
                      <Wind className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px] uppercase font-semibold">Sillage</span>
                    </div>
                    <span className="font-body font-semibold text-sm text-slate-800">{perfume.sillage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 border-t border-pink-100">
            <button
              onClick={handleAdd}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-200/50 transition-all active:scale-[0.98]"
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {selectedVolume} Flacon to Bag — ${currentPrice}</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2 font-mono">
              Includes 2 complimentary 2ml discovery vials at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
