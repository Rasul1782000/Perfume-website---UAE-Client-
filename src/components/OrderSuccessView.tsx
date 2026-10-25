import React from 'react';
import {
  CheckCircle2,
  Printer,
  Package,
  Truck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { CompletedOrder } from './CheckoutFlow';

interface OrderSuccessViewProps {
  order: CompletedOrder;
  onContinueShopping: () => void;
  onViewAccount: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  onContinueShopping,
  onViewAccount,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const trackingSteps = [
    { title: 'Order Confirmed', time: 'Today, Just Now', status: 'completed' },
    { title: 'Artisan Maceration & Packaging', time: 'In Progress (Atelier Grasse)', status: 'active' },
    { title: 'Dispatched via Express Courier', time: 'Estimated Tomorrow, 09:00', status: 'upcoming' },
    { title: 'Out for Delivery', time: 'Pending Arrival', status: 'upcoming' },
    { title: 'Delivered to Residence', time: 'Estimated 2–3 Days', status: 'upcoming' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Success Hero Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-300 mx-auto flex items-center justify-center text-rose-600 shadow-lg shadow-rose-100 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-600 font-bold">
            Maison Aurelia · Paris & Dubai
          </span>
          <h1 className="text-4xl md:text-6xl font-heading text-rose-800 font-normal mt-1">
            Félicitations! Your Scent Is Reserved.
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-body max-w-xl mx-auto mt-2">
            Thank you, {order.shippingAddress.fullName}. Your artisanal flacons are being hand-inspected, engraved, and sealed with our golden wax crest.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-white hover:bg-rose-50 border border-pink-200 text-rose-700 rounded-xl text-xs font-body font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-rose-600" />
            <span>Print Official Invoice</span>
          </button>
          <button
            onClick={onViewAccount}
            className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-pink-200 text-rose-700 rounded-xl text-xs font-body font-semibold uppercase tracking-wider transition-colors"
          >
            <span>View in Account History</span>
          </button>
        </div>
      </div>

      {/* Live Order Tracking Meter (Amazon/Sephora Style) */}
      <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Live Courier Tracking</span>
            <h3 className="font-heading text-2xl text-rose-800 font-normal">
              Tracking Number: <strong className="font-mono text-rose-600 font-semibold">AUR-EXP-89240-DHL</strong>
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Courier Dispatch Active</span>
          </div>
        </div>

        {/* Progress Bar & Steps */}
        <div className="relative pt-4 pb-2">
          <div className="hidden md:block absolute top-10 left-6 right-6 h-1 bg-pink-100 -z-0" />
          <div
            className="hidden md:block absolute top-10 left-6 h-1 bg-gradient-to-r from-rose-500 to-pink-500 -z-0"
            style={{ width: '25%' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {trackingSteps.map((step, idx) => (
              <div key={idx} className="flex md:flex-col items-start md:items-center gap-3 md:text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold z-10 transition-all ${
                    step.status === 'completed'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                      : step.status === 'active'
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white ring-4 ring-rose-200 animate-pulse'
                      : 'bg-white border-2 border-pink-200 text-slate-400'
                  }`}
                >
                  {step.status === 'completed' ? (
                    '✓'
                  ) : step.status === 'active' ? (
                    <Package className="w-4 h-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-body leading-tight">
                    {step.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Order Receipt & Breakdown */}
      <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 shadow-sm printable-receipt">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-pink-100 pb-4">
          <div>
            <h3 className="font-heading text-3xl text-rose-800">Maison Order Receipt</h3>
            <span className="text-xs font-mono text-slate-500">Order ID: #{order.orderId}</span>
          </div>
          <div className="text-sm font-mono text-slate-600 sm:text-right">
            <span>Date: {order.date}</span>
            <span className="block text-[11px] text-rose-600 font-semibold">Payment: Pre-Authorized</span>
          </div>
        </div>

        {/* Addresses & Courier Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-body border-b border-pink-100 pb-6">
          <div className="space-y-1">
            <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block">
              Shipping Destination
            </span>
            <p className="font-bold text-slate-800">{order.shippingAddress.fullName}</p>
            <p className="text-slate-600">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p className="text-slate-600">{order.shippingAddress.addressLine2}</p>
            )}
            <p className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p className="text-slate-600">{order.shippingAddress.country}</p>
            <p className="text-slate-500 font-mono pt-1">{order.shippingAddress.phone}</p>
          </div>

          <div className="space-y-1">
            <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block">
              Delivery Method & Payment
            </span>
            <p className="font-bold text-slate-800">{order.deliveryOption.name}</p>
            <p className="text-slate-600">{order.deliveryOption.estimatedTime}</p>
            <div className="pt-2 text-slate-700">
              <span className="font-semibold">Payment: </span>
              {order.paymentMethod.type === 'card' ? (
                <span>
                  {order.paymentMethod.brand} Ending in •••• {order.paymentMethod.last4}
                </span>
              ) : order.paymentMethod.type === 'apple-pay' ? (
                <span>Apple Pay Biometric</span>
              ) : (
                <span>{order.paymentMethod.bnplProvider} (4 Installments)</span>
              )}
            </div>
            {order.giftWrapped && (
              <p className="text-rose-600 font-semibold pt-1">
                ✓ Includes Signature Blush Lacquer Coffret & Silk Ribbon
              </p>
            )}
          </div>
        </div>

        {/* Flacons Purchased */}
        <div className="space-y-3">
          <span className="font-mono uppercase text-[10px] text-slate-400 font-bold block">
            Purchased Fragrance Formulations
          </span>
          <div className="divide-y divide-pink-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs font-body">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-pink-200 bg-rose-50 shrink-0"
                  />
                  <div>
                    <h4 className="font-heading text-xl text-rose-800">{item.name}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.volume} × {item.quantity}
                    </span>
                    {item.engraving && (
                      <span className="block text-[10px] text-rose-600 italic">
                        Engraved Crest: "{item.engraving}"
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-heading text-xl font-bold text-rose-800 tabular-nums">
                  ${item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Complimentary Discovery Samples Included */}
        {order.selectedSamples && order.selectedSamples.length > 0 && (
          <div className="p-4 bg-rose-50/50 rounded-2xl border border-pink-200 text-xs">
            <span className="font-mono uppercase text-[10px] text-rose-700 font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              Complimentary 2ml Extraits in Package:
            </span>
            <p className="text-slate-700 font-body">
              {order.selectedSamples.join(' · ')}
            </p>
          </div>
        )}

        {/* Totals Breakdown */}
        <div className="border-t border-pink-100 pt-4 space-y-1.5 text-xs font-body max-w-xs ml-auto">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-bold text-slate-800 tabular-nums">${order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-rose-600 font-semibold">
              <span>VIP Privilege Discount</span>
              <span className="tabular-nums">-${order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Delivery Courier</span>
            <span className="font-bold text-slate-800 tabular-nums">
              {order.shippingFee === 0 ? 'Complimentary' : `$${order.shippingFee}`}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-pink-100">
            <span className="font-heading text-2xl text-rose-800">Total Paid</span>
            <span className="font-heading text-3xl font-bold text-rose-800 tabular-nums">
              ${order.total}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom CTA to Continue Shopping */}
      <div className="text-center pt-4">
        <button
          onClick={onContinueShopping}
          className="px-8 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl text-xs font-body tracking-wider uppercase inline-flex items-center gap-2 shadow-lg shadow-rose-200 transition-all active:scale-95"
        >
          <span>Continue Exploring Haute Parfumerie</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
