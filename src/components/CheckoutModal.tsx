import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Lock, CreditCard, Sparkles, Download } from 'lucide-react';
import { CartItem } from './CartDrawer';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    selectedSamples: string[];
    isGiftWrapped: boolean;
  } | null;
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  orderDetails,
  onOrderCompleted,
}) => {
  if (!isOpen || !orderDetails) return null;

  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [name, setName] = useState('Eleanor Vance');
  const [email, setEmail] = useState('eleanor.vance@luxury.com');
  const [address, setAddress] = useState('740 Park Avenue, Apt 14B');
  const [city, setCity] = useState('New York');
  const [country, setCountry] = useState('United States');
  const [postalCode, setPostalCode] = useState('10021');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'concierge'>('apple_pay');
  const [orderNumber] = useState(`AUR-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmed');
    onOrderCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white border border-pink-200 rounded-3xl shadow-2xl p-6 md:p-8 text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-rose-50 text-slate-500 hover:text-rose-700 border border-pink-200 transition-colors shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="space-y-5">
            <div>
              <span className="text-xs font-mono text-rose-600 font-semibold uppercase tracking-widest block mb-1">
                Atelier Concierge Checkout
              </span>
              <h2 className="text-3xl font-heading text-rose-700">Direct Shipping Dispatch</h2>
              <p className="text-xs text-slate-600 mt-0.5 font-body">
                Every bottle is prepared fresh and inspected at our Paris laboratory.
              </p>
            </div>

            {/* Client Contact Details */}
            <div className="space-y-3 font-body">
              <h3 className="text-sm font-heading text-rose-700 uppercase tracking-wider border-b border-pink-100 pb-1">
                Recipient Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-rose-600 font-semibold block mb-1 font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-pink-200 rounded-xl p-2 text-slate-800 focus:border-rose-400 shadow-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-rose-600 font-semibold block mb-1 font-mono">Email for Tracking</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-pink-200 rounded-xl p-2 text-slate-800 focus:border-rose-400 shadow-xs"
                  />
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <label className="text-[11px] text-rose-600 font-semibold block mb-1 font-mono">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-pink-200 rounded-xl p-2 text-slate-800 focus:border-rose-400 shadow-xs"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1 font-mono">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl p-2 text-slate-800 focus:border-rose-400 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1 font-mono">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl p-2 text-slate-800 focus:border-rose-400 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1 font-mono">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl p-2 text-slate-800 focus:border-rose-400 shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 text-xs">
              <h3 className="font-heading text-base text-rose-700 uppercase tracking-wider border-b border-pink-100 pb-1">
                Payment Option
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-rose-400 bg-rose-50 text-rose-800 font-bold shadow-xs'
                      : 'border-pink-200 bg-white text-slate-700 hover:border-rose-300'
                  }`}
                >
                   Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-rose-400 bg-rose-50 text-rose-800 font-bold shadow-xs'
                      : 'border-pink-200 bg-white text-slate-700 hover:border-rose-300'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('concierge')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    paymentMethod === 'concierge'
                      ? 'border-rose-400 bg-rose-50 text-rose-800 font-bold shadow-xs'
                      : 'border-pink-200 bg-white text-slate-700 hover:border-rose-300'
                  }`}
                >
                  Atelier Invoice
                </button>
              </div>
            </div>

            {/* Order Summary Strip */}
            <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-pink-200 text-xs space-y-1 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Items ({orderDetails.items.length})</span>
                <span className="text-slate-800 font-semibold">${orderDetails.subtotal}</span>
              </div>
              {orderDetails.discount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Maison VIP Discount</span>
                  <span>-${orderDetails.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Expedited Courier</span>
                <span className="text-slate-800 font-semibold">{orderDetails.shipping === 0 ? 'Complimentary' : `$${orderDetails.shipping}`}</span>
              </div>
              <div className="flex justify-between text-rose-700 font-heading text-xl pt-1.5 border-t border-pink-200">
                <span>Total Due</span>
                <span className="text-rose-700 font-bold text-2xl">${orderDetails.total}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-200/50 transition-all active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              <span>Authorize & Place Order — ${orderDetails.total}</span>
            </button>
          </form>
        ) : (
          /* Order Confirmed View */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-300 mx-auto flex items-center justify-center text-rose-600 shadow-md shadow-rose-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase text-rose-600 font-semibold tracking-widest block">
                Order Confirmed
              </span>
              <h2 className="text-4xl font-heading text-rose-700 mt-1">Merci, {name}</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-body">
                Your bespoke flacon order <span className="font-mono text-rose-700 font-bold">#{orderNumber}</span> has been received by our master perfumer in Paris.
              </p>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-2xl border border-pink-200 text-left text-xs space-y-2 max-w-md mx-auto font-body">
              <div className="flex justify-between text-[11px] font-mono text-slate-600">
                <span>Dispatch Origin</span>
                <span className="text-slate-800 font-medium">AURELIA Palais-Royal Atelier, Paris</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-600">
                <span>Estimated Delivery</span>
                <span className="text-rose-700 font-medium">2–4 Business Days (DHL Express)</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-600">
                <span>Complimentary Samples</span>
                <span className="text-rose-700 font-medium">{orderDetails.selectedSamples.length} Included in Coffret</span>
              </div>
              {orderDetails.isGiftWrapped && (
                <div className="text-[11px] font-mono text-rose-700 font-semibold pt-1 border-t border-pink-200">
                  ✦ Signature Blush Lacquer Coffret & Wax Seal applied
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase transition-all shadow-md shadow-rose-200/50"
            >
              Continue Exploring Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
