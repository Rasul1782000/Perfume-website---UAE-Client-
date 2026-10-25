import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Truck,
  Sparkles,
  Lock,
  MapPin,
  Clock,
  ChevronRight,
  Building,
  User,
  Mail,
  Phone,
  Gift,
  CircleDot,
} from 'lucide-react';
import { CartItem } from './SlideOutCart';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface DeliveryOption {
  id: 'standard' | 'express' | 'white-glove';
  name: string;
  description: string;
  estimatedTime: string;
  price: number;
}

export interface CompletedOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
  deliveryOption: DeliveryOption;
  paymentMethod: {
    type: 'card' | 'apple-pay' | 'google-pay' | 'paypal' | 'bnpl';
    last4?: string;
    brand?: string;
    bnplProvider?: string;
  };
  giftWrapped: boolean;
  selectedSamples: string[];
}

interface CheckoutFlowProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode: string;
  selectedSamples: string[];
  isGiftWrapped: boolean;
  onBackToCart: () => void;
  onOrderCompleted: (order: CompletedOrder) => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  items,
  subtotal,
  discount,
  promoCode,
  selectedSamples,
  isGiftWrapped,
  onBackToCart,
  onOrderCompleted,
}) => {
  // Steps: 1: Shipping Address, 2: Delivery Speed, 3: Payment
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Address
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Lady Genevieve Laurent',
    email: 'genevieve.laurent@aureliaparfum.com',
    phone: '+33 6 42 19 88 00',
    addressLine1: '16 Rue de la Paix',
    addressLine2: 'Appartement 4B',
    city: 'Paris',
    country: 'France',
    postalCode: '75002',
  });

  const savedAddresses: { label: string; addr: ShippingAddress }[] = [
    {
      label: 'Paris Residence (Place Vendôme)',
      addr: {
        fullName: 'Lady Genevieve Laurent',
        email: 'genevieve.laurent@aureliaparfum.com',
        phone: '+33 6 42 19 88 00',
        addressLine1: '16 Rue de la Paix',
        addressLine2: 'Appartement 4B',
        city: 'Paris',
        country: 'France',
        postalCode: '75002',
      },
    },
    {
      label: 'Dubai Villa (Palm Jumeirah)',
      addr: {
        fullName: 'Genevieve Laurent',
        email: 'genevieve.laurent@aureliaparfum.com',
        phone: '+971 50 123 4567',
        addressLine1: 'Frond N, Villa 18',
        addressLine2: 'Palm Jumeirah',
        city: 'Dubai',
        country: 'United Arab Emirates',
        postalCode: '00000',
      },
    },
    {
      label: 'London Townhouse (Mayfair)',
      addr: {
        fullName: 'Genevieve Laurent',
        email: 'genevieve.laurent@aureliaparfum.com',
        phone: '+44 20 7946 0912',
        addressLine1: '24 Mount Street',
        addressLine2: 'Mayfair',
        city: 'London',
        country: 'United Kingdom',
        postalCode: 'W1K 2RA',
      },
    },
  ];

  // Step 2: Delivery Speeds
  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'standard',
      name: 'Complimentary Worldwide Courier',
      description: 'Climate-controlled insured shipping via DHL Express Global',
      estimatedTime: '2–4 Business Days',
      price: subtotal >= 150 ? 0 : 15,
    },
    {
      id: 'express',
      name: 'Air Express Priority Courier',
      description: 'Expedited transport direct from Grasse or Dubai Atelier hub',
      estimatedTime: '1–2 Business Days',
      price: 25,
    },
    {
      id: 'white-glove',
      name: 'Maison White-Glove Concierge (Paris & Dubai Only)',
      description: 'Hand-delivered in velvet Aurelia presentation case with chilled vials',
      estimatedTime: 'Same-Day Evening Concierge',
      price: 45,
    },
  ];

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>(deliveryOptions[0]);

  // Step 3: Payment
  const [paymentTab, setPaymentTab] = useState<'card' | 'express' | 'bnpl'>('card');
  const [cardNumber, setCardNumber] = useState('4532 8910 2341 7892');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('384');
  const [cardName, setCardName] = useState('GENEVIEVE LAURENT');
  const [bnplProvider, setBnplProvider] = useState<'Tabby' | 'Tamara' | 'Klarna'>('Tabby');
  const [isProcessing, setIsProcessing] = useState(false);

  // Live card format helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const parts = val.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const shippingFee = selectedDelivery.price;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleCompleteOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order: CompletedOrder = {
        orderId: `AUR-${Math.floor(100000 + Math.random() * 900000)}-FR`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        items,
        subtotal,
        discount,
        shippingFee,
        total: grandTotal,
        shippingAddress: address,
        deliveryOption: selectedDelivery,
        paymentMethod: {
          type: paymentTab === 'card' ? 'card' : paymentTab === 'express' ? 'apple-pay' : 'bnpl',
          last4: paymentTab === 'card' ? cardNumber.replace(/\s/g, '').slice(-4) : '8821',
          brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
          bnplProvider: paymentTab === 'bnpl' ? bnplProvider : undefined,
        },
        giftWrapped: isGiftWrapped,
        selectedSamples,
      };
      setIsProcessing(false);
      onOrderCompleted(order);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header / Back */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-4">
        <button
          onClick={onBackToCart}
          className="text-xs font-body font-semibold uppercase tracking-wider text-rose-700 hover:text-pink-600 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Bag</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Lock className="w-3.5 h-3.5 text-rose-600" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {/* Checkout Progress Stepper (Amazon/Sephora Style) */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-pink-100 z-0" />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 z-0 transition-all duration-300"
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
          />

          {/* Step 1 Pill */}
          <button
            onClick={() => setCurrentStep(1)}
            className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-hidden"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                currentStep >= 1
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                  : 'bg-white border border-pink-200 text-slate-400'
              }`}
            >
              {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
            </div>
            <span
              className={`text-[11px] font-body mt-1.5 uppercase tracking-wider ${
                currentStep === 1 ? 'font-bold text-rose-800' : 'text-slate-500'
              }`}
            >
              Shipping Address
            </span>
          </button>

          {/* Step 2 Pill */}
          <button
            onClick={() => setCurrentStep(2)}
            className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-hidden"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                currentStep >= 2
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                  : 'bg-white border border-pink-200 text-slate-400'
              }`}
            >
              {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
            </div>
            <span
              className={`text-[11px] font-body mt-1.5 uppercase tracking-wider ${
                currentStep === 2 ? 'font-bold text-rose-800' : 'text-slate-500'
              }`}
            >
              Delivery Speed
            </span>
          </button>

          {/* Step 3 Pill */}
          <button
            onClick={() => setCurrentStep(3)}
            className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-hidden"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                currentStep === 3
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                  : 'bg-white border border-pink-200 text-slate-400'
              }`}
            >
              3
            </div>
            <span
              className={`text-[11px] font-body mt-1.5 uppercase tracking-wider ${
                currentStep === 3 ? 'font-bold text-rose-800' : 'text-slate-500'
              }`}
            >
              Payment & Review
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Multi-Step Forms */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: SHIPPING ADDRESS */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                <div>
                  <h2 className="text-3xl font-heading text-rose-800 font-normal">
                    Step 1: Destination & Shipping Address
                  </h2>
                  <p className="text-xs text-slate-600 font-body">
                    Choose a saved luxury residence or enter a bespoke international destination.
                  </p>
                </div>
                <MapPin className="w-6 h-6 text-rose-500" />
              </div>

              {/* Saved Address Pills for 1-Click Fill */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Saved Residencies (1-Click Selection)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {savedAddresses.map((sa, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAddress(sa.addr)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        address.city === sa.addr.city
                          ? 'bg-rose-50/80 border-rose-400 shadow-xs ring-1 ring-rose-300'
                          : 'bg-[#fffbfc] border-pink-200 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-rose-800 font-body block truncate">
                        {sa.label}
                      </span>
                      <p className="text-[11px] text-slate-500 font-body truncate mt-1">
                        {sa.addr.addressLine1}, {sa.addr.city}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                    Full Name / Title
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-body focus:border-rose-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                    Contact Email (For Live Tracking)
                  </label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-body focus:border-rose-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                    Street Address & Suite / Villa Number
                  </label>
                  <input
                    type="text"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-body focus:border-rose-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                    Apartment / Suite / Palais (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.addressLine2 || ''}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-body focus:border-rose-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-body focus:border-rose-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                    Country
                  </label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-body focus:border-rose-500 focus:outline-hidden"
                  >
                    <option value="France">France</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Qatar">Qatar</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                    Postal Code / ZIP
                  </label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-body focus:border-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase flex items-center gap-2 shadow-md shadow-rose-200"
                >
                  <span>Continue to Delivery Speed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY SPEED */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                <div>
                  <h2 className="text-3xl font-heading text-rose-800 font-normal">
                    Step 2: Choose Delivery Speed & Carrier
                  </h2>
                  <p className="text-xs text-slate-600 font-body">
                    All flacons travel in insulated, shock-absorbent climate packaging to preserve rare botanical macerations.
                  </p>
                </div>
                <Truck className="w-6 h-6 text-rose-500" />
              </div>

              <div className="space-y-3">
                {deliveryOptions.map((opt) => {
                  const isSelected = selectedDelivery.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedDelivery(opt)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                          : 'bg-[#fffbfc] border-pink-200 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-rose-600 text-white' : 'border border-pink-300 bg-white'
                          }`}
                        >
                          {isSelected && <CircleDot className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800 font-body">{opt.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
                              {opt.estimatedTime}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-body">{opt.description}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-heading text-2xl font-bold text-rose-800">
                          {opt.price === 0 ? 'Free' : `$${opt.price}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-pink-200 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-body font-semibold uppercase tracking-wider transition-colors"
                >
                  ← Back to Address
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase flex items-center gap-2 shadow-md shadow-rose-200"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT OPTIONS */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl border border-pink-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                <div>
                  <h2 className="text-3xl font-heading text-rose-800 font-normal">
                    Step 3: Secure Payment & Final Review
                  </h2>
                  <p className="text-xs text-slate-600 font-body">
                    Select your preferred payment method. Encrypted with bank-grade security.
                  </p>
                </div>
                <CreditCard className="w-6 h-6 text-rose-500" />
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-rose-50/70 rounded-2xl border border-pink-200">
                <button
                  type="button"
                  onClick={() => setPaymentTab('card')}
                  className={`py-2.5 rounded-xl text-xs font-body font-semibold uppercase tracking-wider transition-all ${
                    paymentTab === 'card'
                      ? 'bg-white text-rose-700 shadow-sm border border-pink-200 font-bold'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  Credit / Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('express')}
                  className={`py-2.5 rounded-xl text-xs font-body font-semibold uppercase tracking-wider transition-all ${
                    paymentTab === 'express'
                      ? 'bg-white text-rose-700 shadow-sm border border-pink-200 font-bold'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  1-Click Express
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('bnpl')}
                  className={`py-2.5 rounded-xl text-xs font-body font-semibold uppercase tracking-wider transition-all ${
                    paymentTab === 'bnpl'
                      ? 'bg-white text-rose-700 shadow-sm border border-pink-200 font-bold'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  Buy Now Pay Later (BNPL)
                </button>
              </div>

              {/* TAB A: CREDIT / DEBIT CARD */}
              {paymentTab === 'card' && (
                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-gradient-to-r from-rose-900 via-rose-800 to-pink-900 rounded-2xl text-white shadow-lg space-y-4 max-w-md mx-auto">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono tracking-widest text-pink-200 uppercase">Maison Aurelia Card</span>
                      <span className="font-bold tracking-wider text-sm font-mono">VISA / MC</span>
                    </div>
                    <div className="text-xl font-mono tracking-widest py-2 text-pink-50">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-pink-200">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider opacity-70">Cardholder</span>
                        <span className="font-semibold">{cardName || 'YOUR NAME'}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider opacity-70">Expires</span>
                        <span className="font-semibold">{cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                        Card Number (16 Digits)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 •••• •••• ••••"
                        className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono tracking-wider focus:border-rose-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        placeholder="GENEVIEVE LAURENT"
                        className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-body uppercase focus:border-rose-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:border-rose-500 focus:outline-hidden text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono uppercase text-slate-600 font-semibold block">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-[#fffbfc] border border-pink-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:border-rose-500 focus:outline-hidden text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB B: 1-CLICK EXPRESS CHECKOUT */}
              {paymentTab === 'express' && (
                <div className="space-y-4 py-4 text-center">
                  <p className="text-xs text-slate-600 font-body">
                    Complete your order instantly with biometric authorization:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                    <button
                      type="button"
                      onClick={handleCompleteOrder}
                      className="p-3.5 bg-black hover:bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      <span> Apple Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteOrder}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-sm transition-all active:scale-95"
                    >
                      <span>G Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteOrder}
                      className="p-3.5 bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-md transition-all active:scale-95"
                    >
                      <span>PayPal</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB C: BUY NOW PAY LATER */}
              {paymentTab === 'bnpl' && (
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-slate-600 font-body">
                    Split your purchase into 4 interest-free installments. Available across GCC & Europe:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Tabby', 'Tamara', 'Klarna'] as const).map((prov) => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setBnplProvider(prov)}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          bnplProvider === prov
                            ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300 font-bold text-rose-800 shadow-sm'
                            : 'bg-[#fffbfc] border-pink-200 text-slate-700 hover:border-rose-300'
                        }`}
                      >
                        <span className="font-heading text-xl block">{prov}</span>
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                          4 payments of ${(grandTotal / 4).toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-rose-50/60 rounded-2xl border border-pink-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-rose-800 block">How {bnplProvider} Works:</span>
                    <p className="text-[11px] text-slate-600">
                      1. Pay 25% today (${(grandTotal / 4).toFixed(2)}). Your flacons ship immediately.
                    </p>
                    <p className="text-[11px] text-slate-600">
                      2. The remaining 3 installments will be charged automatically every 30 days. No interest, no hidden fees.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 flex items-center justify-between border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-pink-200 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-body font-semibold uppercase tracking-wider transition-colors"
                >
                  ← Back to Delivery
                </button>
                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  className="px-10 py-4 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl text-xs font-body tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-rose-200 disabled:opacity-50 active:scale-95"
                >
                  {isProcessing ? (
                    <span>Securing Reservation & Authorizing...</span>
                  ) : (
                    <>
                      <span>Complete Order & Authorize (${grandTotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Floating Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-pink-200 p-6 space-y-6 shadow-sm sticky top-24">
            <h3 className="font-heading text-2xl text-rose-800 border-b border-pink-100 pb-3 flex justify-between items-center">
              <span>Order Summary</span>
              <span className="text-xs font-mono text-rose-600 font-bold">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
              </span>
            </h3>

            {/* Item Thumbnails List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs font-body">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-rose-50 border border-pink-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading text-base text-rose-800 truncate">{item.name}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.volume} × {item.quantity}
                    </span>
                    {item.engraving && (
                      <span className="block text-[10px] text-rose-600 italic truncate">
                        "{item.engraving}"
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Discovery Samples Included */}
            {selectedSamples.length > 0 && (
              <div className="p-3 bg-rose-50/50 rounded-2xl border border-pink-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-rose-800 flex items-center gap-1 font-mono uppercase">
                  <Sparkles className="w-3 h-3 text-rose-600" />
                  Free 2ml Discovery Vials Included:
                </span>
                <span className="text-slate-700 block font-body">
                  {selectedSamples.join(', ')}
                </span>
              </div>
            )}

            {isGiftWrapped && (
              <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-pink-200 font-medium">
                <Gift className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Complimentary Signature Blush Coffret Included</span>
              </div>
            )}

            {/* Breakdown */}
            <div className="space-y-2 text-xs font-body border-t border-pink-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800 tabular-nums">${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>VIP Discount ({promoCode || '15%'})</span>
                  <span className="tabular-nums">-${discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Selected Delivery</span>
                <span className="font-medium text-slate-800 tabular-nums">
                  {shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT / Import Tariffs</span>
                <span className="text-emerald-700 font-semibold">Pre-Cleared</span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-pink-100">
                <span className="font-heading text-2xl text-rose-800">Total Due</span>
                <span className="font-heading text-3xl font-bold text-rose-800 tabular-nums">
                  ${grandTotal}
                </span>
              </div>
            </div>

            {/* Reassurance */}
            <div className="p-3.5 bg-[#fff7f9] rounded-2xl border border-pink-200 text-[11px] text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>The Aurelia Guarantee</span>
              </div>
              <p className="font-body text-[10px] leading-relaxed">
                Test the 2ml discovery vials first. If the harmony is not perfect, return the unopened full flacon within 30 days for a complete refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
