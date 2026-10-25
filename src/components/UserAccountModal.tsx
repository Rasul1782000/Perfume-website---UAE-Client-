import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  CreditCard,
  Package,
  Heart,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronRight,
  Plus,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { CompletedOrder } from './CheckoutFlow';
import { PERFUMES_LIST, PerfumeItem } from '../data/perfumes';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderHistory: CompletedOrder[];
  wishlistIds: string[];
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onAddToCart: (perfume: PerfumeItem) => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  orderHistory,
  wishlistIds,
  onSelectPerfume,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('profile');

  const wishlistedPerfumes = PERFUMES_LIST.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-pink-200 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-[#fff7f9] to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-center font-heading text-2xl font-bold shadow-md shadow-rose-200">
              GL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-2xl text-rose-800">Lady Genevieve Laurent</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
                  Cercle d'Or VIP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-body">
                genevieve.laurent@aureliaparfum.com · Member since 2024
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-rose-50 text-slate-400 hover:text-rose-700 border border-pink-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-pink-100 bg-[#fffbfc] px-6 text-xs font-body uppercase tracking-wider font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-rose-500 text-rose-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-rose-600'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>VIP Privilege Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-rose-500 text-rose-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-rose-600'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Order History ({orderHistory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-rose-500 text-rose-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-rose-600'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Residences</span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wishlist'
                ? 'border-rose-500 text-rose-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-rose-600'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Flacons ({wishlistIds.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: VIP PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* VIP Tier Banner */}
              <div className="p-6 bg-gradient-to-r from-rose-900 via-rose-800 to-pink-900 rounded-3xl text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-pink-200">
                    <Sparkles className="w-4 h-4 text-pink-300" />
                    <span>Maison Aurelia Cercle d'Or</span>
                  </div>
                  <h4 className="text-3xl font-heading font-normal">Imperial Tier Member</h4>
                  <p className="text-xs text-pink-100 font-body max-w-md">
                    Enjoy lifetime 15% VIP privilege, complimentary engraved flacons, and first access to seasonal rare harvests from Grasse and Taif.
                  </p>
                  <div className="pt-2 flex items-center gap-6 text-xs font-mono">
                    <div>
                      <span className="block text-pink-300 text-[10px] uppercase">Reward Points</span>
                      <span className="font-bold text-lg text-white">2,850 Pts</span>
                    </div>
                    <div>
                      <span className="block text-pink-300 text-[10px] uppercase">Complimentary Samples</span>
                      <span className="font-bold text-lg text-white">Unlimited</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Olfactory Preferences */}
              <div className="p-5 bg-rose-50/50 rounded-2xl border border-pink-200 space-y-3">
                <h4 className="text-lg font-heading text-rose-800">Your Olfactory Blueprint</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 bg-white rounded-xl border border-pink-200 text-rose-800 font-medium">
                    Favorite Note: Cambodian Agarwood
                  </span>
                  <span className="px-3 py-1 bg-white rounded-xl border border-pink-200 text-rose-800 font-medium">
                    Floral Preference: Grasse Centifolia Rose
                  </span>
                  <span className="px-3 py-1 bg-white rounded-xl border border-pink-200 text-rose-800 font-medium">
                    Desired Sillage: Imperial Grand Sillage
                  </span>
                  <span className="px-3 py-1 bg-white rounded-xl border border-pink-200 text-rose-800 font-medium">
                    Concentration: Extrait de Parfum (30%+)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orderHistory.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Package className="w-10 h-10 mx-auto text-rose-300" />
                  <p className="font-body text-sm text-slate-700">No completed orders yet.</p>
                  <p className="text-xs font-body">Your future bespoke flacons will appear here with live tracking.</p>
                </div>
              ) : (
                orderHistory.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 rounded-2xl border border-pink-200 bg-[#fffbfc] space-y-4 shadow-xs"
                  >
                    <div className="flex justify-between items-center border-b border-pink-100 pb-3">
                      <div>
                        <span className="text-xs font-mono text-rose-600 font-bold block">
                          #{order.orderId}
                        </span>
                        <span className="text-[11px] text-slate-500 font-body">{order.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-2xl font-bold text-rose-800">${order.total}</span>
                        <span className="block text-[10px] font-mono text-emerald-700 font-bold uppercase">
                          Dispatched via Express
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-pink-100">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-2 flex items-center justify-between text-xs font-body">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover border border-pink-200"
                            />
                            <div>
                              <span className="font-heading text-base text-rose-800 font-normal">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-slate-500 block font-mono">
                                {item.volume} · Qty {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="font-bold text-slate-700 tabular-nums">${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-between items-center text-xs text-slate-500 font-body">
                      <span>Delivering to: {order.shippingAddress.city}, {order.shippingAddress.country}</span>
                      <span className="font-mono text-rose-600 font-semibold">Tracking: AUR-EXP-89240-DHL</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SAVED RESIDENCES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-rose-300 bg-rose-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-rose-800">Paris Place Vendôme (Primary)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-200 text-rose-800 rounded font-bold">
                      Default
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-body leading-relaxed">
                    16 Rue de la Paix, Apt 4B<br />
                    75002 Paris, France<br />
                    +33 6 42 19 88 00
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-pink-200 bg-[#fffbfc] space-y-2">
                  <span className="text-xs font-bold text-slate-800">Dubai Palm Jumeirah Residence</span>
                  <p className="text-xs text-slate-700 font-body leading-relaxed">
                    Frond N, Villa 18<br />
                    Palm Jumeirah, Dubai, UAE<br />
                    +971 50 123 4567
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SAVED FLACONS / WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {wishlistedPerfumes.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Heart className="w-10 h-10 mx-auto text-rose-300" />
                  <p className="font-body text-sm text-slate-700">No saved flacons yet.</p>
                  <p className="text-xs font-body">Tap the heart icon on any perfume in the catalog to save it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistedPerfumes.map((perfume) => (
                    <div
                      key={perfume.id}
                      className="p-4 rounded-2xl border border-pink-200 bg-white flex items-center gap-3 shadow-xs"
                    >
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="w-14 h-14 rounded-xl object-cover border border-pink-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-mono text-rose-600 uppercase font-semibold">
                          {perfume.origin === 'Arabian Royal' ? 'Arabian Oud' : 'French'}
                        </span>
                        <h4
                          onClick={() => {
                            onClose();
                            onSelectPerfume(perfume);
                          }}
                          className="font-heading text-lg text-rose-800 truncate cursor-pointer hover:text-pink-600"
                        >
                          {perfume.name}
                        </h4>
                        <span className="font-heading text-base font-bold text-rose-800 block">
                          ${perfume.price}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onAddToCart(perfume);
                        }}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-pink-200 transition-colors shrink-0"
                        title="Add to Bag"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
