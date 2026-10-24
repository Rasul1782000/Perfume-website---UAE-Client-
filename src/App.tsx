import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  Check,
  ArrowRight,
  Eye,
  Smartphone,
  Compass,
  Star,
  ShieldCheck,
  Droplet,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { PERFUMES_LIST, PerfumeItem, ScentFamily } from './data/perfumes';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { PerfumeDetailModal } from './components/PerfumeDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ScentFinderQuiz } from './components/ScentFinderQuiz';
import { ReferoFrame, DeviceModel, DeviceFinish } from './components/ReferoFrame';
import { MobileBoutiqueApp } from './components/MobileBoutiqueApp';

export default function App() {
  // Navigation & View Mode
  const [activeView, setActiveView] = useState<'storefront' | 'quiz' | 'mobile_frame'>('storefront');

  // Filter & Search
  const [selectedFamily, setSelectedFamily] = useState<'All' | ScentFamily>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');

  // Cart & Modals
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      perfumeId: 'santal-mystique',
      name: 'Santal Mystique',
      volume: '50ml',
      price: 260,
      quantity: 1,
      image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      engraving: 'L.M.',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPerfumeForModal, setSelectedPerfumeForModal] = useState<PerfumeItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);

  // Refero Device Controls
  const [device, setDevice] = useState<DeviceModel>('iphone');
  const [finish, setFinish] = useState<DeviceFinish>('titanium');
  const [showFrame, setShowFrame] = useState(true);
  const [zoom, setZoom] = useState(0.92);

  // Cart operations
  const handleAddToCart = (
    perfume: PerfumeItem,
    volume: '30ml' | '50ml' | '100ml' = '50ml',
    engraving: string = ''
  ) => {
    const unitPrice = perfume.volumePrices[volume];
    const existingIndex = cartItems.findIndex(
      (item) => item.perfumeId === perfume.id && item.volume === volume && item.engraving === engraving
    );

    if (existingIndex > -1) {
      setCartItems((prev) =>
        prev.map((item, idx) => (idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item))
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        perfumeId: perfume.id,
        name: perfume.name,
        volume,
        price: unitPrice,
        quantity: 1,
        image: perfume.image,
        engraving: engraving || undefined,
      };
      setCartItems((prev) => [newItem, ...prev]);
    }

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleStartCheckout = (orderDetails: any) => {
    setIsCartOpen(false);
    setCompletedOrderDetails(orderDetails);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = () => {
    setCartItems([]);
  };

  // Filtered & Sorted Perfumes
  const filteredPerfumes = PERFUMES_LIST.filter((p) => {
    const matchesFamily = selectedFamily === 'All' || p.family === selectedFamily;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.top.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.notes.heart.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.notes.base.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFamily && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  const cartTotalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fffbfc] text-slate-800 flex flex-col font-body selection:bg-rose-200 selection:text-rose-900">
      {/* Top Bar Contract (1 Line Brand Wordmark - 4 Clean Links - 1 Action) */}
      <header className="flex items-center justify-between gap-8 px-6 md:px-10 py-4 border-b border-pink-100 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs shadow-pink-100/40">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('storefront');
          }}
          className="text-2xl md:text-3xl font-heading tracking-[0.18em] text-rose-700 uppercase whitespace-nowrap shrink-0 hover:text-pink-600 transition-colors"
        >
          AURELIA
        </a>

        {/* Zone 2: 4–5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-body tracking-wider uppercase text-slate-600">
          <button
            onClick={() => setActiveView('storefront')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-rose-600 ${
              activeView === 'storefront' ? 'text-rose-700 font-semibold border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Haute Collection
          </button>
          <a
            href="#scent-families"
            onClick={() => setActiveView('storefront')}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-rose-600"
          >
            Olfactory Families
          </a>
          <button
            onClick={() => setActiveView('quiz')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-rose-600 ${
              activeView === 'quiz' ? 'text-rose-700 font-semibold border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            Scent Quiz
          </button>
          <a
            href="#atelier"
            onClick={() => setActiveView('storefront')}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-rose-600"
          >
            Grasse Atelier
          </a>
          <button
            onClick={() => setActiveView('mobile_frame')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-rose-600 flex items-center gap-1.5 ${
              activeView === 'mobile_frame' ? 'text-rose-700 font-semibold border-b-2 border-rose-500 pb-0.5' : ''
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-500" />
            <span>Refero Mobile View</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action (Shopping Bag) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-body tracking-wider uppercase transition-all flex items-center gap-2 shadow-xs active:scale-95 whitespace-nowrap font-semibold"
          >
            <ShoppingBag className="w-4 h-4 text-rose-600" />
            <span>Bag</span>
            <span className="font-mono bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-bold text-[10px]">
              {cartTotalCount}
            </span>
          </button>
        </div>
      </header>

      {/* VIEW: MAIN STOREFRONT */}
      {activeView === 'storefront' && (
        <main className="flex-1 flex flex-col">
          {/* Luxury Hero Banner */}
          <section className="relative w-full border-b border-pink-100 bg-gradient-to-b from-[#fff5f8] via-[#fff9fa] to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Editorial Headline & Copy */}
              <div className="lg:col-span-6 space-y-6 z-10">
                <div className="flex items-center gap-2 text-xs font-mono text-rose-600 tracking-widest uppercase font-semibold">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100/80 border border-rose-200">Palais-Royal · Paris</span>
                  <span aria-hidden="true" className="text-rose-400">·</span>
                  <span>Artisanal Extraits</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-normal tracking-wide text-rose-700 leading-[1.08] text-balance">
                  The Liquid Architecture of Rare Scent.
                </h1>

                <p className="text-sm md:text-base text-slate-700 font-body leading-relaxed max-w-xl">
                  Formulated in our historic Grasse laboratory using wild-harvested botanicals, macerated in vintage barrels, and bottled at 20–32% pure oil concentration.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#collection"
                    className="px-6 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs tracking-wider uppercase font-body flex items-center gap-2 shadow-lg shadow-rose-200/60 transition-all active:scale-95"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setActiveView('quiz')}
                    className="px-6 py-3.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 hover:text-rose-800 rounded-xl text-xs tracking-wider uppercase font-body font-semibold flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span>Find Your Olfactory Match</span>
                  </button>
                </div>

                {/* Proof markers */}
                <div className="flex items-center gap-6 pt-4 text-xs text-slate-600 font-body border-t border-pink-100">
                  <span>100% Sustainably Harvested</span>
                  <span aria-hidden="true" className="text-rose-400">·</span>
                  <span>Complimentary Flacon Engraving</span>
                  <span aria-hidden="true" className="text-rose-400">·</span>
                  <span>2 Free Vials Per Flacon</span>
                </div>
              </div>

              {/* Right Column: Hero High-Res Flacon Visual */}
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="relative w-full max-w-lg aspect-16/11 rounded-2xl overflow-hidden shadow-2xl shadow-rose-200/50 border border-pink-200 group">
                  <img
                    src="/src/assets/images/hero_luxury_perfume_flacon_1792865209285.jpg"
                    alt="Aurore Dorée Haute Parfumerie Flacon"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-pink-200 bg-rose-950/60 px-2 py-0.5 rounded backdrop-blur-xs">
                        Crowning Masterpiece
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl font-normal text-white mt-1">Aurore Dorée Extrait</h3>
                    </div>
                    <button
                      onClick={() => setSelectedPerfumeForModal(PERFUMES_LIST[4])}
                      className="px-3.5 py-1.5 bg-white/90 hover:bg-white text-rose-800 rounded-lg text-xs font-body font-bold uppercase tracking-wider transition-colors shadow-md"
                    >
                      Examine Flacon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Catalog Section */}
          <section id="collection" className="max-w-7xl mx-auto px-6 md:px-10 py-12 space-y-8 w-full">
            {/* Section Header & Search/Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-pink-100">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
                  Haute Parfumerie Catalog
                </span>
                <h2 className="text-3xl md:text-4xl font-heading text-rose-700">Signature Extraits & Eaux de Parfum</h2>
                <p className="text-xs text-slate-600 font-body">
                  Displaying {filteredPerfumes.length} handcrafted formulations.
                </p>
              </div>

              {/* Controls: Search & Sort */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-rose-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search notes (sandalwood, rose, vanilla)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-pink-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-rose-400 shadow-xs w-64 font-body"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:border-rose-400 font-body shadow-xs"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Scent Family Segmented Filter Bar */}
            <div id="scent-families" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {(['All', 'Woody', 'Floral', 'Citrus', 'Amber', 'Gourmand', 'Leather'] as const).map((fam) => (
                <button
                  key={fam}
                  onClick={() => setSelectedFamily(fam as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-body tracking-wider uppercase transition-all whitespace-nowrap ${
                    selectedFamily === fam
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md shadow-rose-200/50'
                      : 'bg-white text-slate-700 hover:text-rose-700 border border-pink-200 hover:border-rose-300 shadow-xs'
                  }`}
                >
                  {fam === 'All' ? 'All Olfactory Families' : fam}
                </button>
              ))}
            </div>

            {/* 3-Column Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPerfumes.map((perfume) => (
                <div
                  key={perfume.id}
                  className="bg-white border border-pink-100 hover:border-rose-300 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 flex flex-col group shadow-sm"
                >
                  {/* Product Card Image */}
                  <div
                    onClick={() => setSelectedPerfumeForModal(perfume)}
                    className="relative aspect-4/3 w-full bg-rose-50/40 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {perfume.badge && (
                      <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest bg-white/95 text-rose-700 px-3 py-1 rounded-full border border-pink-200 backdrop-blur-xs font-semibold shadow-xs">
                        {perfume.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPerfumeForModal(perfume);
                      }}
                      className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 hover:bg-white text-rose-700 text-xs font-body font-semibold tracking-wider uppercase rounded-lg border border-pink-200 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-rose-500" />
                      <span>Examine</span>
                    </button>
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Category & Concentration unboxed metadata */}
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-rose-600 font-semibold">{perfume.family}</span>
                        <span aria-hidden="true" className="text-pink-300">·</span>
                        <span className="text-slate-600">{perfume.concentration}</span>
                        <span aria-hidden="true" className="text-pink-300">·</span>
                        <span className="text-slate-600">{perfume.concentrationPct}% Oil</span>
                      </div>

                      <h3
                        onClick={() => setSelectedPerfumeForModal(perfume)}
                        className="text-2xl md:text-3xl font-heading font-normal text-rose-700 hover:text-pink-600 transition-colors cursor-pointer mt-1"
                      >
                        {perfume.name}
                      </h3>

                      <p className="text-xs text-slate-600 font-body line-clamp-2 mt-1">
                        {perfume.subtitle}
                      </p>
                    </div>

                    {/* Note Chips */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-rose-600 font-semibold">Key Accords:</span>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {perfume.notes.heart.slice(0, 3).map((note, idx) => (
                          <span
                            key={idx}
                            className="bg-rose-50/80 border border-pink-200/80 px-2.5 py-0.5 rounded text-[11px] text-rose-800 font-body"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Primary Buy CTA */}
                    <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-heading font-bold text-rose-700 tabular-nums">${perfume.price}</span>
                        <span className="text-[11px] font-mono text-slate-500 ml-1">/ 50ml</span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(perfume, '50ml')}
                        className="px-4 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-rose-200/50 transition-all active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Scent Matcher Quiz Teaser Banner */}
          <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 w-full">
            <div className="p-8 md:p-12 bg-gradient-to-r from-rose-100/70 via-pink-50 to-[#fff5f8] border border-pink-200 rounded-3xl relative overflow-hidden shadow-sm">
              <div className="max-w-xl space-y-4 relative z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  Bespoke Scent Architecture
                </span>
                <h2 className="text-3xl md:text-5xl font-heading text-rose-800 font-normal leading-tight">
                  Unsure which creation belongs on your skin?
                </h2>
                <p className="text-xs md:text-sm text-slate-700 font-body leading-relaxed">
                  Take our three-step olfactory consultation. Our algorithm analyzes sillage preferences, seasonal chemistry, and key notes to recommend your signature flacon.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveView('quiz')}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs font-body tracking-wider uppercase flex items-center gap-2 transition-all shadow-md shadow-rose-200/60 active:scale-95"
                  >
                    <span>Begin Olfactory Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Grasse Atelier & Craftsmanship Section */}
          <section id="atelier" className="max-w-7xl mx-auto px-6 md:px-10 py-12 border-t border-pink-100 w-full space-y-8 bg-gradient-to-b from-[#fffbfc] to-rose-50/30">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold">
                Atelier de Création · Grasse
              </span>
              <h2 className="text-3xl md:text-4xl font-heading text-rose-700">The Pursuit of Pure Extraction</h2>
              <p className="text-xs md:text-sm text-slate-700 font-body leading-relaxed">
                Every AURELIA flacon is an homage to French grand parfumerie. We reject synthetic shortcuts in favor of long maceration cycles and raw botanical extracts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-white rounded-2xl border border-pink-100 shadow-sm space-y-2 hover:border-pink-200 transition-colors">
                <span className="font-heading text-4xl text-rose-400">01</span>
                <h3 className="font-heading text-xl text-rose-700">Maceration in French Oak</h3>
                <p className="text-xs text-slate-600 font-body leading-relaxed">
                  Perfume concentrates rest for 6 months in aged wooden casks, developing deep woody facets impossible to simulate through modern industrial tanks.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-pink-100 shadow-sm space-y-2 hover:border-pink-200 transition-colors">
                <span className="font-heading text-4xl text-rose-400">02</span>
                <h3 className="font-heading text-xl text-rose-700">Rare Florentine Orris</h3>
                <p className="text-xs text-slate-600 font-body leading-relaxed">
                  Our iris roots are cured for three full years before steam distillation, extracting liquid orris butter valued above its weight in pure gold.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-pink-100 shadow-sm space-y-2 hover:border-pink-200 transition-colors">
                <span className="font-heading text-4xl text-rose-400">03</span>
                <h3 className="font-heading text-xl text-rose-700">Complimentary Discovery Vials</h3>
                <p className="text-xs text-slate-600 font-body leading-relaxed">
                  Every order includes 2 matching 2ml discovery vials. Test the scent on your skin first; if it does not harmonize, return the unopened full flacon for a complete refund.
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW: SCENT FINDER QUIZ */}
      {activeView === 'quiz' && (
        <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
          <div className="mb-6">
            <button
              onClick={() => setActiveView('storefront')}
              className="text-xs font-body uppercase tracking-wider text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
            >
              ← Back to Collection
            </button>
          </div>
          <ScentFinderQuiz
            onSelectPerfume={(perfume) => setSelectedPerfumeForModal(perfume)}
            onAddToCart={(perfume) => handleAddToCart(perfume, '50ml')}
          />
        </main>
      )}

      {/* VIEW: REFERO MOBILE FRAME SHOWCASE */}
      {activeView === 'mobile_frame' && (
        <main className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-[#fffbfc] to-rose-50/40">
          {/* Frame Toolbar */}
          <div className="px-6 py-3 bg-white border-b border-pink-100 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">Device Frame:</span>
              <div className="flex items-center gap-1 p-0.5 bg-rose-50 rounded-xl border border-pink-200">
                <button
                  onClick={() => {
                    setDevice('iphone');
                    setShowFrame(true);
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    device === 'iphone' && showFrame
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  iPhone 16 Pro
                </button>
                <button
                  onClick={() => {
                    setDevice('pixel');
                    setShowFrame(true);
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    device === 'pixel' && showFrame
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  Pixel 9
                </button>
                <button
                  onClick={() => {
                    setDevice('desktop');
                    setShowFrame(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    !showFrame
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  Full Canvas
                </button>
              </div>

              {/* Chassis Finish */}
              {showFrame && (
                <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-pink-200">
                  <button
                    onClick={() => setFinish('titanium')}
                    title="Natural Titanium"
                    className={`w-4 h-4 rounded-full bg-[#8c9099] border-2 transition-all ${
                      finish === 'titanium' ? 'border-rose-500 scale-110' : 'border-transparent'
                    }`}
                  />
                  <button
                    onClick={() => setFinish('obsidian')}
                    title="Obsidian Black"
                    className={`w-4 h-4 rounded-full bg-[#1e2025] border-2 transition-all ${
                      finish === 'obsidian' ? 'border-rose-500 scale-110' : 'border-transparent'
                    }`}
                  />
                  <button
                    onClick={() => setFinish('sand')}
                    title="Desert Sand"
                    className={`w-4 h-4 rounded-full bg-[#d4b99b] border-2 transition-all ${
                      finish === 'sand' ? 'border-rose-500 scale-110' : 'border-transparent'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Zoom Controls */}
            {showFrame && (
              <div className="flex items-center gap-1 p-0.5 bg-rose-50 rounded-xl border border-pink-200 text-[11px]">
                <button
                  onClick={() => setZoom(0.8)}
                  className={`px-2 py-0.5 rounded-lg font-medium ${zoom === 0.8 ? 'bg-rose-500 text-white' : 'text-slate-600'}`}
                >
                  80%
                </button>
                <button
                  onClick={() => setZoom(0.92)}
                  className={`px-2 py-0.5 rounded-lg font-medium ${zoom === 0.92 ? 'bg-rose-500 text-white' : 'text-slate-600'}`}
                >
                  92%
                </button>
                <button
                  onClick={() => setZoom(1.0)}
                  className={`px-2 py-0.5 rounded-lg font-medium ${zoom === 1.0 ? 'bg-rose-500 text-white' : 'text-slate-600'}`}
                >
                  100%
                </button>
              </div>
            )}
          </div>

          {/* Device Centered Container */}
          <div className="flex-1 flex items-center justify-center p-4">
            <ReferoFrame
              device={device}
              onDeviceChange={setDevice}
              finish={finish}
              onFinishChange={setFinish}
              showFrame={showFrame}
              onToggleFrame={() => setShowFrame(!showFrame)}
              zoom={zoom}
              onZoomChange={setZoom}
            >
              <MobileBoutiqueApp
                onSelectPerfume={(perfume) => setSelectedPerfumeForModal(perfume)}
                onAddToCart={(perfume) => handleAddToCart(perfume, '50ml')}
                cartCount={cartTotalCount}
                onOpenCart={() => setIsCartOpen(true)}
              />
            </ReferoFrame>
          </div>
        </main>
      )}

      {/* Global Product Detail Modal */}
      <PerfumeDetailModal
        perfume={selectedPerfumeForModal}
        onClose={() => setSelectedPerfumeForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Global Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleStartCheckout}
      />

      {/* Global Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        orderDetails={completedOrderDetails}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Quiet Luxury Footer */}
      <footer className="px-6 md:px-10 py-6 bg-white border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-body shadow-inner">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-rose-700 uppercase tracking-widest font-heading text-xl">AURELIA</span>
          <span className="text-rose-400">·</span>
          <span>Maison de Haute Parfumerie · 16 Galerie de Valois, Palais-Royal, Paris</span>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-mono text-slate-500">
          <span>Worldwide Courier</span>
          <span>·</span>
          <span>Complimentary Engraving</span>
          <span>·</span>
          <span>2 Vials Included</span>
        </div>
      </footer>
    </div>
  );
}
