import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { PERFUMES_LIST, PerfumeItem } from '../data/perfumes';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onRemoveFromWishlist: (id: string) => void;
  onAddToCart: (perfume: PerfumeItem, volume?: '30ml' | '50ml' | '100ml') => void;
  onSelectPerfume: (perfume: PerfumeItem) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectPerfume,
}) => {
  if (!isOpen) return null;

  const wishlistedPerfumes = PERFUMES_LIST.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white border-l border-pink-200 flex flex-col justify-between text-slate-800 shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h3 className="font-heading text-3xl font-normal tracking-wide text-rose-800">
              Saved Fragrances
            </h3>
            <span className="text-xs font-mono font-semibold text-rose-600">
              ({wishlistIds.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-rose-50 text-slate-500 hover:text-rose-700 border border-pink-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistedPerfumes.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-pink-200 mx-auto flex items-center justify-center text-rose-600">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-2xl text-rose-800">No fragrances saved yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto font-body">
                Explore our French extraits and Arabian royal ouds and click the heart icon to save your desired scents.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistedPerfumes.map((perfume) => (
                <div
                  key={perfume.id}
                  className="p-3.5 bg-rose-50/40 border border-pink-200 rounded-2xl flex items-start gap-3 shadow-xs"
                >
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-16 h-16 rounded-xl object-cover bg-rose-100 shrink-0 border border-pink-200 shadow-xs cursor-pointer"
                    onClick={() => {
                      onClose();
                      onSelectPerfume(perfume);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono text-rose-600 uppercase font-semibold block">
                          {perfume.origin === 'Arabian Royal' ? 'Arabian Oud' : 'French Atelier'}
                        </span>
                        <h4
                          onClick={() => {
                            onClose();
                            onSelectPerfume(perfume);
                          }}
                          className="text-xl font-heading font-normal text-rose-800 truncate cursor-pointer hover:text-pink-600"
                        >
                          {perfume.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => onRemoveFromWishlist(perfume.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate font-body mt-0.5">
                      {perfume.subtitle}
                    </p>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-pink-200/60">
                      <span className="font-heading text-rose-700 font-bold text-xl tabular-nums">
                        ${perfume.price} <span className="text-[10px] text-slate-400 font-mono">/ 50ml</span>
                      </span>

                      <button
                        onClick={() => {
                          onAddToCart(perfume, '50ml');
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase flex items-center gap-1 shadow-xs transition-all active:scale-95"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistedPerfumes.length > 0 && (
          <div className="p-5 border-t border-pink-100 bg-[#fffbfc] text-center">
            <button
              onClick={() => {
                wishlistedPerfumes.forEach((p) => onAddToCart(p, '50ml'));
                onClose();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl text-xs font-body tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-all active:scale-95"
            >
              <span>Add All to Bag</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
