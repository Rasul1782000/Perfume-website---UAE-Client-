import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Gift,
  Sparkles,
  Check,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { DISCOVERY_SAMPLES } from '../data/perfumes';

export interface CartItem {
  id: string;
  perfumeId: string;
  name: string;
  volume: '30ml' | '50ml' | '100ml';
  price: number;
  quantity: number;
  image: string;
  engraving?: string;
  origin?: string;
}

interface SlideOutCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onViewFullCart: () => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoApplied: boolean;
  setPromoApplied: (applied: boolean) => void;
  selectedSamples: string[];
  setSelectedSamples: (samples: string[]) => void;
  isGiftWrapped: boolean;
  setIsGiftWrapped: (wrapped: boolean) => void;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export const SlideOutCart: React.FC<SlideOutCartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onViewFullCart,
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
}) => {
  if (!isOpen) return null;

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
      setPromoError('Invalid code. Try "AURELIA15" for 15% VIP privilege.');
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white border-l border-pink-200 flex flex-col justify-between text-slate-800 shadow-2xl">
        {/* Top Header */}
        <div className="p-5 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h3 className="font-heading text-3xl font-normal tracking-wide text-rose-800">
              Your Fragrance Bag
            </h3>
            <span className="text-xs font-mono font-semibold text-rose-600">
              ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-rose-50 text-slate-500 hover:text-rose-700 border border-pink-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Worldwide Shipping Progress Bar */}
        <div className="px-5 py-2.5 bg-[#fff7f9] border-b border-pink-100 text-xs">
          <div className="flex justify-between items-center text-[11px] mb-1 font-mono">
            {subtotal >= freeShippingThreshold || items.length === 0 ? (
              <span className="text-rose-700 font-semibold flex items-center gap-1 font-body">
                <Check className="w-3.5 h-3.5 text-rose-600" />
                Complimentary Worldwide Express Courier Unlocked!
              </span>
            ) : (
              <span className="text-slate-700 font-body">
                Add <strong className="text-rose-700 font-body">${freeShippingThreshold - subtotal}</strong> for free courier
              </span>
            )}
            <span className="text-slate-500">
              {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-pink-200 mx-auto flex items-center justify-center text-rose-600">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-body text-slate-800 font-bold text-base">Your fragrance bag is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto font-body">
                Explore our French extraits and Arabian royal ouds to start your olfactory journey.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-rose-50/40 border border-pink-200/80 rounded-2xl flex items-start gap-3 shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-rose-100 shrink-0 border border-pink-200 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-heading font-normal text-rose-800 truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                      Flacon: {item.volume}
                    </div>

                    {item.engraving && (
                      <div className="text-[10px] text-rose-600 font-body italic mt-0.5">
                        Engraved: "{item.engraving}"
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-2.5">
                      <div className="flex items-center gap-2 border border-pink-200 rounded-lg bg-white px-2 py-0.5 text-xs shadow-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="text-slate-500 hover:text-rose-700 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-slate-800 font-semibold text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="text-slate-500 hover:text-rose-700 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-heading text-rose-700 font-bold text-xl tabular-nums">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Complimentary Discovery Samples Picker (French & Arabian Vials) */}
          {items.length > 0 && (
            <div className="p-4 bg-gradient-to-b from-[#fff7f9] to-rose-50/50 rounded-2xl border border-pink-200 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-700 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  Choose 2 Free Discovery Vials (2ml)
                </span>
                <span className="text-[10px] font-mono text-rose-700 font-bold">
                  {selectedSamples.length}/2 selected
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-body">
                Experience additional extraits from Grasse and Dubai archives at home.
              </p>

              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {DISCOVERY_SAMPLES.map((sample) => {
                  const isSelected = selectedSamples.includes(sample.id);
                  return (
                    <button
                      key={sample.id}
                      onClick={() => toggleSample(sample.id)}
                      className={`p-2 rounded-xl text-left text-xs flex justify-between items-center transition-all ${
                        isSelected
                          ? 'bg-rose-100/90 text-rose-800 border border-rose-300 font-semibold shadow-xs'
                          : 'bg-white text-slate-700 hover:text-rose-700 border border-pink-200 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-pink-200">
                          {sample.origin === 'Arabian Royal' ? 'Arabic' : 'French'}
                        </span>
                        <span className="truncate">{sample.name}</span>
                      </div>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-rose-600 shrink-0 stroke-[3]" />
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">+ Add</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Signature Gift Packaging Checkbox */}
          {items.length > 0 && (
            <div className="p-3.5 bg-rose-50/40 rounded-2xl border border-pink-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-rose-600" />
                <div>
                  <span className="text-slate-800 font-semibold">Signature Blush Coffret</span>
                  <p className="text-[10px] text-slate-500">
                    Palais-Royal lacquer presentation box, silk ribbon & wax seal
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isGiftWrapped}
                onChange={(e) => setIsGiftWrapped(e.target.checked)}
                className="rounded border-pink-300 text-rose-600 focus:ring-rose-400 w-4 h-4"
              />
            </div>
          )}

          {/* Promo Code Input */}
          {items.length > 0 && (
            <form onSubmit={handleApplyPromo} className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="VIP Promo Code (e.g. AURELIA15)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-slate-800 uppercase tracking-wider font-mono focus:border-rose-400 shadow-xs"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-pink-200 text-xs font-bold text-rose-700 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="text-[11px] text-emerald-700 font-mono font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> 15% VIP Maison Privilege Discount Applied
                </p>
              )}
              {promoError && <p className="text-[11px] text-red-600 font-body">{promoError}</p>}
            </form>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t border-pink-100 bg-[#fffbfc] space-y-3 shadow-inner">
            <div className="space-y-1.5 text-xs font-body">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-body tabular-nums text-slate-800 font-bold">${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Maison VIP Privilege (15%)</span>
                  <span className="font-body tabular-nums">-${discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Expedited Worldwide Delivery</span>
                <span className="font-body tabular-nums text-slate-800 font-medium">
                  {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-medium text-slate-800 pt-2 border-t border-pink-100">
                <span className="font-heading text-2xl text-rose-800">Total</span>
                <span className="font-heading text-rose-800 tabular-nums text-3xl font-bold">
                  ${total}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl text-xs font-body tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-rose-200/60 transition-all active:scale-[0.98]"
            >
              <span>Proceed to Bespoke Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onViewFullCart();
              }}
              className="w-full text-center text-xs font-body text-slate-500 hover:text-rose-700 underline font-medium"
            >
              View Full Shopping Cart Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
