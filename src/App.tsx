import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  Check,
  ArrowRight,
  Eye,
  Smartphone,
  Star,
  ShieldCheck,
  Droplet,
  Heart,
  ChevronDown,
  Truck,
  RotateCcw,
  Flame,
  Globe,
  Plus,
} from 'lucide-react';
import {
  PERFUMES_LIST,
  PerfumeItem,
  ScentFamily,
  ScentOrigin,
  DISCOVERY_SAMPLES,
} from './data/perfumes';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FragranceFamiliesGrid } from './components/FragranceFamiliesGrid';
import { DealsCountdown } from './components/DealsCountdown';
import { CatalogPLP } from './components/CatalogPLP';
import { ProductDetailPage } from './components/ProductDetailPage';
import { QuickViewModal } from './components/QuickViewModal';
import { SlideOutCart, CartItem } from './components/SlideOutCart';
import { FullCartPage } from './components/FullCartPage';
import { CheckoutFlow, CompletedOrder } from './components/CheckoutFlow';
import { OrderSuccessView } from './components/OrderSuccessView';
import { UserAccountModal } from './components/UserAccountModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ReviewsCarousel } from './components/ReviewsCarousel';
import { ScentFinderQuiz } from './components/ScentFinderQuiz';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { ReferoFrame, DeviceModel, DeviceFinish } from './components/ReferoFrame';
import { MobileBoutiqueApp } from './components/MobileBoutiqueApp';

type ActiveView =
  | 'home'
  | 'catalog'
  | 'pdp'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'quiz'
  | 'mobile_frame';

export default function App() {
  // Navigation & View Routing
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [activeNav, setActiveNav] = useState<string>('all');
  const [selectedPerfume, setSelectedPerfume] = useState<PerfumeItem | null>(PERFUMES_LIST[0]);
  const [quickViewPerfume, setQuickViewPerfume] = useState<PerfumeItem | null>(null);

  // PLP Filter & Sort State
  const [selectedOrigin, setSelectedOrigin] = useState<'All' | ScentOrigin>('All');
  const [selectedFamily, setSelectedFamily] = useState<'All' | ScentFamily>('All');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Unisex' | 'Women' | 'Men'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'reviews'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Cart & Drawers State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-oud',
      perfumeId: 'oud-imperial-royal',
      name: 'Oud Impérial Al-Malaki',
      volume: '50ml',
      price: 360,
      quantity: 1,
      image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      engraving: 'S.M.',
      origin: 'Arabian Royal Oud',
    },
    {
      id: 'cart-init-rose',
      perfumeId: 'rose-de-mai',
      name: 'Rose de Mai Impériale',
      volume: '50ml',
      price: 290,
      quantity: 1,
      image: '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
      origin: 'French Atelier',
    },
  ]);
  const [isSlideCartOpen, setIsSlideCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'aurore-doree',
    'ambre-royal',
    'santal-mystique',
  ]);

  // Promotions & Packaging
  const [promoCode, setPromoCode] = useState('AURELIA15');
  const [promoApplied, setPromoApplied] = useState(true);
  const [selectedSamples, setSelectedSamples] = useState<string[]>([
    'sample-oud-cambodi',
    'sample-rose-grasse',
  ]);
  const [isGiftWrapped, setIsGiftWrapped] = useState(true);

  // Order History & Success State
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>([
    {
      orderId: 'AUR-782419-FR',
      date: 'Oct 18, 2026',
      items: [
        {
          id: 'prev-1',
          perfumeId: 'santal-mystique',
          name: 'Santal Mystique Extrait',
          volume: '50ml',
          price: 260,
          quantity: 1,
          image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
          engraving: 'G.L.',
        },
      ],
      subtotal: 260,
      discount: 39,
      shippingFee: 0,
      total: 221,
      shippingAddress: {
        fullName: 'Lady Genevieve Laurent',
        email: 'genevieve.laurent@aureliaparfum.com',
        phone: '+33 6 42 19 88 00',
        addressLine1: '16 Rue de la Paix',
        addressLine2: 'Appartement 4B',
        city: 'Paris',
        country: 'France',
        postalCode: '75002',
      },
      deliveryOption: {
        id: 'standard',
        name: 'Complimentary Worldwide Courier',
        description: 'Climate-controlled insured shipping',
        estimatedTime: 'Delivered',
        price: 0,
      },
      paymentMethod: {
        type: 'card',
        last4: '7892',
        brand: 'Visa',
      },
      giftWrapped: true,
      selectedSamples: ['Cambodian Agarwood Raw Extrait', 'Centifolia Rose de Grasse'],
    },
  ]);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<CompletedOrder | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'wishlist' | 'error', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Refero Mobile Frame Controls
  const [device, setDevice] = useState<DeviceModel>('iphone');
  const [finish, setFinish] = useState<DeviceFinish>('titanium');
  const [showFrame, setShowFrame] = useState(true);
  const [zoom, setZoom] = useState(0.92);

  // Calculations
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const discountAmount = promoApplied ? Math.round(cartSubtotal * 0.15) : 0;
  const shippingFee = cartSubtotal >= 150 || cartItems.length === 0 ? 0 : 15;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Cart Operations
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
        origin: perfume.origin === 'Arabian Royal' ? 'Arabian Oud' : 'French Atelier',
      };
      setCartItems((prev) => [newItem, ...prev]);
    }

    addToast(
      'success',
      `Added ${perfume.name} to Bag`,
      `${volume} flacon (${perfume.concentration}) reserved for checkout.`
    );
    setIsSlideCartOpen(true);
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
    const item = cartItems.find((i) => i.id === id);
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      addToast('info', 'Item Removed', `${item.name} (${item.volume}) was removed from your bag.`);
    }
  };

  // Wishlist Toggle
  const handleToggleWishlist = (perfume: PerfumeItem) => {
    const isSaved = wishlistIds.includes(perfume.id);
    if (isSaved) {
      setWishlistIds((prev) => prev.filter((id) => id !== perfume.id));
      addToast('info', 'Removed from Wishlist', `${perfume.name} removed from your saved list.`);
    } else {
      setWishlistIds((prev) => [...prev, perfume.id]);
      addToast('wishlist', 'Saved to Wishlist', `${perfume.name} added to your private collection.`);
    }
  };

  const isWishlisted = (id: string) => wishlistIds.includes(id);

  // Bundle Add from PDP
  const handleAddBundleToCart = (items: { name: string; price: number; volume?: string }[]) => {
    items.forEach((item) => {
      const perf = PERFUMES_LIST.find((p) => item.name.includes(p.name)) || PERFUMES_LIST[0];
      handleAddToCart(perf, (item.volume as any) || '50ml');
    });
    addToast('success', 'Bespoke Pair Added to Bag', `${items.length} items added with VIP bundle privilege.`);
  };

  // Category & Navigation Filter Routing
  const handleNavigateCategory = (category: {
    origin?: ScentOrigin;
    family?: ScentFamily;
    isDeals?: boolean;
  }) => {
    if (category.origin) {
      setSelectedOrigin(category.origin);
      setActiveNav(category.origin === 'French Atelier' ? 'french' : 'arabic');
    } else {
      setSelectedOrigin('All');
    }

    if (category.family) {
      setSelectedFamily(category.family);
    } else {
      setSelectedFamily('All');
    }

    if (category.isDeals) {
      setActiveNav('deals');
      setActiveView('catalog');
      setSelectedOrigin('All');
      setSelectedFamily('All');
      setSortBy('price_asc');
    } else {
      setActiveView('catalog');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPerfume = (perfume: PerfumeItem) => {
    setSelectedPerfume(perfume);
    setActiveView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedOrigin('All');
    setSelectedFamily('All');
    setSelectedGender('All');
    setMaxPrice(500);
    setMinRating(0);
    setSortBy('featured');
    setInStockOnly(false);
  };

  // Checkout Handlers
  const handleStartCheckout = () => {
    setIsSlideCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (order: CompletedOrder) => {
    setLastCompletedOrder(order);
    setOrderHistory((prev) => [order, ...prev]);
    setCartItems([]);
    setActiveView('order-success');
    addToast('success', 'Order Confirmed!', `Order #${order.orderId} is being prepared in Grasse & Dubai.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered perfumes for PLP
  const filteredPerfumes = PERFUMES_LIST.filter((p) => {
    const matchesOrigin = selectedOrigin === 'All' || p.origin === selectedOrigin;
    const matchesFamily = selectedFamily === 'All' || p.family === selectedFamily;
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender || p.gender === 'Unisex';
    const matchesPrice = p.price <= maxPrice;
    const matchesRating = p.rating >= minRating;
    const matchesStock = !inStockOnly || p.inStock;
    return matchesOrigin && matchesFamily && matchesGender && matchesPrice && matchesRating && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
    return 0; // featured
  });

  const dealsPerfumes = PERFUMES_LIST.filter((p) => p.dealOfTheDay);
  const trendingPerfumes = PERFUMES_LIST.slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-body selection:bg-rose-200 selection:text-rose-900">
      {/* 1. Global Header with Smart Search & Autocomplete */}
      <Header
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsSlideCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onSelectPerfume={handleSelectPerfume}
        onNavigateCategory={handleNavigateCategory}
        onNavigateHome={() => {
          setActiveView('home');
          setActiveNav('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenQuiz={() => {
          setActiveView('quiz');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMobileFrame={() => {
          setActiveView('mobile_frame');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeNav={activeNav}
      />

      {/* 2. Primary Route Content */}
      <div className="flex-1">
        {/* VIEW 1: HOME PAGE (Sephora/Amazon Style) */}
        {activeView === 'home' && (
          <main className="space-y-4">
            {/* Hero Carousel */}
            <HeroBanner
              onExploreCollection={() => {
                setActiveView('catalog');
                setSelectedOrigin('All');
                setActiveNav('all');
              }}
              onExploreFrench={() => {
                handleNavigateCategory({ origin: 'French Atelier' });
              }}
              onExploreArabic={() => {
                handleNavigateCategory({ origin: 'Arabian Royal' });
              }}
              onOpenQuiz={() => {
                setActiveView('quiz');
              }}
              onSelectPerfume={handleSelectPerfume}
              featuredPerfumes={PERFUMES_LIST}
            />

            {/* Sephora-Style Fragrance Family Visual Shelf */}
            <FragranceFamiliesGrid
              onSelectFilter={({ origin, family }) => {
                handleNavigateCategory({ origin, family });
              }}
            />

            {/* Amazon-Style "Deals of the Day" with Live Countdown Timer */}
            <DealsCountdown
              deals={dealsPerfumes}
              onSelectPerfume={handleSelectPerfume}
              onAddToCart={(perfume) => handleAddToCart(perfume, '50ml')}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isWishlisted}
            />

            {/* Curated Shelf: Trending & Bestsellers Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-pink-100 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold mb-1">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span>Curated Palaces of Scent</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-heading text-rose-800">
                    Trending French & Arabian Extraits
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setActiveView('catalog');
                    setSelectedOrigin('All');
                  }}
                  className="text-xs font-body uppercase font-bold text-rose-700 hover:text-pink-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <span>Explore Complete Catalog ({PERFUMES_LIST.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingPerfumes.map((perfume) => (
                  <div
                    key={perfume.id}
                    className="bg-white border border-pink-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-400 transition-all flex flex-col justify-between group"
                  >
                    {/* Image with hover swap */}
                    <div
                      onClick={() => handleSelectPerfume(perfume)}
                      className="relative aspect-4/3 bg-gradient-to-b from-[#fff5f8] to-pink-50/30 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {perfume.badge && (
                        <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider bg-white/95 text-rose-700 px-2.5 py-0.5 rounded-full border border-pink-200 font-bold shadow-xs">
                          {perfume.badge}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(perfume);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-600 border border-pink-200 transition-all shadow-xs"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isWishlisted(perfume.id) ? 'fill-rose-600 text-rose-600' : 'text-slate-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                          <span className="text-rose-600 font-semibold">{perfume.origin === 'Arabian Royal' ? 'Arabian Oud' : 'French Atelier'}</span>
                          <span>·</span>
                          <span>{perfume.concentrationPct}% Pure Oil</span>
                        </div>
                        <h3
                          onClick={() => handleSelectPerfume(perfume)}
                          className="font-heading text-2xl text-rose-800 hover:text-pink-600 transition-colors cursor-pointer mt-1"
                        >
                          {perfume.name}
                        </h3>
                        <p className="text-xs text-slate-600 font-body line-clamp-2 mt-1">
                          {perfume.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-pink-100 flex items-center justify-between">
                        <div>
                          <span className="font-heading text-2xl font-bold text-rose-800 tabular-nums">
                            ${perfume.price}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono ml-1">/ 50ml</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setQuickViewPerfume(perfume)}
                            className="p-2 rounded-xl border border-pink-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors"
                            title="Quick View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAddToCart(perfume, '50ml')}
                            className="px-3 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-xs font-body font-bold uppercase tracking-wider transition-all shadow-md shadow-rose-200 active:scale-95 flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Social Proof: Verified Buyer Reviews Carousel */}
            <ReviewsCarousel />

            {/* Atelier Craftsmanship & Heritage Section */}
            <section className="bg-gradient-to-b from-[#fffbfc] via-rose-50/20 to-white border-t border-pink-100 py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-rose-600 font-bold">
                    Dual Heritage · Palais-Royal & Dubai
                  </span>
                  <h2 className="text-4xl md:text-5xl font-heading text-rose-800">
                    Two Continents, One Uncompromising Standard
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 font-body leading-relaxed">
                    AURELIA unites the delicate centuries-old maceration of Grasse floristry with the majestic, smokey depth of Arabian wild agarwoods.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-white rounded-3xl border border-pink-200 shadow-sm space-y-3 text-center hover:border-rose-300 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-pink-200 mx-auto flex items-center justify-center text-rose-600 font-heading text-3xl font-bold">
                      01
                    </div>
                    <h3 className="font-heading text-2xl text-rose-800">Grasse Botanical Terroir</h3>
                    <p className="text-xs text-slate-600 font-body leading-relaxed">
                      Centifolia May roses and white jasmines are plucked by hand before dawn, yielding the highest floral oil purity in the Mediterranean basin.
                    </p>
                  </div>

                  <div className="p-8 bg-white rounded-3xl border border-pink-200 shadow-sm space-y-3 text-center hover:border-rose-300 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-pink-200 mx-auto flex items-center justify-center text-rose-600 font-heading text-3xl font-bold">
                      02
                    </div>
                    <h3 className="font-heading text-2xl text-rose-800">18-Year Cured Cambodian Oud</h3>
                    <p className="text-xs text-slate-600 font-body leading-relaxed">
                      Sustainably harvested aged heartwood distilled in copper alembics, delivering an intoxicating balsamic sillage revered in the royal majlis.
                    </p>
                  </div>

                  <div className="p-8 bg-white rounded-3xl border border-pink-200 shadow-sm space-y-3 text-center hover:border-rose-300 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-pink-200 mx-auto flex items-center justify-center text-rose-600 font-heading text-3xl font-bold">
                      03
                    </div>
                    <h3 className="font-heading text-2xl text-rose-800">2 Free Testing Vials Included</h3>
                    <p className="text-xs text-slate-600 font-body leading-relaxed">
                      Every order includes matching 2ml discovery vials. Spray on your skin first; if the harmony is not sublime, return the unopened full flacon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        )}

        {/* VIEW 2: PRODUCT LISTING PAGE (PLP) */}
        {activeView === 'catalog' && (
          <CatalogPLP
            perfumes={filteredPerfumes}
            selectedOrigin={selectedOrigin}
            setSelectedOrigin={setSelectedOrigin}
            selectedFamily={selectedFamily}
            setSelectedFamily={setSelectedFamily}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
            sortBy={sortBy}
            setSortBy={setSortBy}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onResetFilters={handleResetFilters}
            onSelectPerfume={handleSelectPerfume}
            onQuickView={(p) => setQuickViewPerfume(p)}
            onAddToCart={(p, vol) => handleAddToCart(p, vol || '50ml')}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted}
          />
        )}

        {/* VIEW 3: PRODUCT DETAIL PAGE (PDP) */}
        {activeView === 'pdp' && selectedPerfume && (
          <ProductDetailPage
            perfume={selectedPerfume}
            onBack={() => setActiveView('catalog')}
            onAddToCart={handleAddToCart}
            onAddBundleToCart={handleAddBundleToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={isWishlisted(selectedPerfume.id)}
          />
        )}

        {/* VIEW 4: FULL SHOPPING CART PAGE */}
        {activeView === 'cart' && (
          <FullCartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToCheckout={handleStartCheckout}
            onContinueShopping={() => setActiveView('catalog')}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            promoApplied={promoApplied}
            setPromoApplied={setPromoApplied}
            selectedSamples={selectedSamples}
            setSelectedSamples={setSelectedSamples}
            isGiftWrapped={isGiftWrapped}
            setIsGiftWrapped={setIsGiftWrapped}
            subtotal={cartSubtotal}
            discount={discountAmount}
            shipping={shippingFee}
            total={cartTotal}
            onAddToCart={(p, v) => handleAddToCart(p, v || '50ml')}
          />
        )}

        {/* VIEW 5: CHECKOUT FLOW */}
        {activeView === 'checkout' && (
          <CheckoutFlow
            items={cartItems}
            subtotal={cartSubtotal}
            discount={discountAmount}
            promoCode={promoCode}
            selectedSamples={selectedSamples}
            isGiftWrapped={isGiftWrapped}
            onBackToCart={() => setActiveView('cart')}
            onOrderCompleted={handleOrderCompleted}
          />
        )}

        {/* VIEW 6: ORDER CONFIRMATION & LIVE TRACKING */}
        {activeView === 'order-success' && lastCompletedOrder && (
          <OrderSuccessView
            order={lastCompletedOrder}
            onContinueShopping={() => setActiveView('catalog')}
            onViewAccount={() => setIsAccountOpen(true)}
          />
        )}

        {/* VIEW 7: BESPOKE SCENT FINDER QUIZ */}
        {activeView === 'quiz' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <button
              onClick={() => setActiveView('home')}
              className="mb-6 text-xs font-body font-semibold uppercase tracking-wider text-rose-700 hover:text-pink-600 flex items-center gap-1.5 transition-colors"
            >
              ← Return to Boutique
            </button>
            <ScentFinderQuiz
              onSelectPerfume={handleSelectPerfume}
              onAddToCart={(p) => handleAddToCart(p, '50ml')}
            />
          </div>
        )}

        {/* VIEW 8: REFERO MOBILE FRAME SHOWCASE */}
        {activeView === 'mobile_frame' && (
          <div className="flex flex-col bg-gradient-to-b from-[#fffbfc] to-rose-50/40 min-h-[calc(100vh-120px)]">
            <div className="px-6 py-3 bg-white border-b border-pink-100 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">
                  Mobile Device Simulator:
                </span>
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
              </div>

              <button
                onClick={() => setActiveView('home')}
                className="text-xs font-semibold text-rose-700 hover:text-pink-600 uppercase tracking-wider"
              >
                ← Return to Web Store
              </button>
            </div>

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
                  onSelectPerfume={handleSelectPerfume}
                  onAddToCart={(p) => handleAddToCart(p, '50ml')}
                  cartCount={cartCount}
                  onOpenCart={() => setIsSlideCartOpen(true)}
                />
              </ReferoFrame>
            </div>
          </div>
        )}
      </div>

      {/* 3. Global Slide-Out Cart */}
      <SlideOutCart
        isOpen={isSlideCartOpen}
        onClose={() => setIsSlideCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleStartCheckout}
        onViewFullCart={() => {
          setIsSlideCartOpen(false);
          setActiveView('cart');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        promoApplied={promoApplied}
        setPromoApplied={setPromoApplied}
        selectedSamples={selectedSamples}
        setSelectedSamples={setSelectedSamples}
        isGiftWrapped={isGiftWrapped}
        setIsGiftWrapped={setIsGiftWrapped}
        subtotal={cartSubtotal}
        discount={discountAmount}
        shipping={shippingFee}
        total={cartTotal}
      />

      {/* 4. Global Wishlist Slide-Over Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        onRemoveFromWishlist={(id) => {
          setWishlistIds((prev) => prev.filter((i) => i !== id));
        }}
        onAddToCart={(p, v) => handleAddToCart(p, v || '50ml')}
        onSelectPerfume={handleSelectPerfume}
      />

      {/* 5. Global User Account Modal */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orderHistory={orderHistory}
        wishlistIds={wishlistIds}
        onSelectPerfume={handleSelectPerfume}
        onAddToCart={(p) => handleAddToCart(p, '50ml')}
      />

      {/* 6. Quick View Pop-Up Modal */}
      <QuickViewModal
        perfume={quickViewPerfume}
        onClose={() => setQuickViewPerfume(null)}
        onAddToCart={(p, v) => handleAddToCart(p, v)}
        onViewFullPDP={(p) => {
          setQuickViewPerfume(null);
          handleSelectPerfume(p);
        }}
      />

      {/* 7. Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* 8. Sephora/Amazon Inspired Global Footer */}
      <footer className="border-t border-pink-100 bg-white text-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="text-3xl font-brand font-semibold text-rose-800 tracking-[0.2em]">AURELIA</span>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                Maison de Haute Parfumerie & Royal Arabian Oud Extraits. Bottled under the Palais-Royal colonnade, Paris, and Qasr Al-Aroma, Dubai.
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-rose-600 font-semibold pt-1">
                <span>Paris</span>
                <span>·</span>
                <span>Grasse</span>
                <span>·</span>
                <span>Dubai</span>
                <span>·</span>
                <span>Muscat</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-sm font-heading font-bold text-rose-800 uppercase tracking-wider">
                French Haute Parfumerie
              </h4>
              <ul className="text-xs space-y-1.5 text-slate-600 font-body">
                <li><button onClick={() => handleNavigateCategory({ origin: 'French Atelier' })} className="hover:text-rose-700">Rose de Mai Impériale</button></li>
                <li><button onClick={() => handleNavigateCategory({ origin: 'French Atelier' })} className="hover:text-rose-700">Aurore Dorée Extrait</button></li>
                <li><button onClick={() => handleNavigateCategory({ origin: 'French Atelier' })} className="hover:text-rose-700">Santal Mystique Grasse</button></li>
                <li><button onClick={() => handleNavigateCategory({ origin: 'French Atelier' })} className="hover:text-rose-700">Neroli Blanc de Riviera</button></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-sm font-heading font-bold text-rose-800 uppercase tracking-wider">
                Royal Arabian Oud & Attar
              </h4>
              <ul className="text-xs space-y-1.5 text-slate-600 font-body">
                <li><button onClick={() => handleNavigateCategory({ origin: 'Arabian Royal' })} className="hover:text-rose-700">Oud Impérial Al-Malaki</button></li>
                <li><button onClick={() => handleNavigateCategory({ origin: 'Arabian Royal' })} className="hover:text-rose-700">Ambre Royal Al-Andalus</button></li>
                <li><button onClick={() => handleNavigateCategory({ origin: 'Arabian Royal' })} className="hover:text-rose-700">Taif Rose Distillations</button></li>
                <li><button onClick={() => handleNavigateCategory({ origin: 'Arabian Royal' })} className="hover:text-rose-700">Hojari Frankincense Extraits</button></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-sm font-heading font-bold text-rose-800 uppercase tracking-wider">
                Boutique Services
              </h4>
              <ul className="text-xs space-y-1.5 text-slate-600 font-body">
                <li><button onClick={() => setIsAccountOpen(true)} className="hover:text-rose-700">VIP Cercle d'Or Tier</button></li>
                <li><button onClick={() => setIsSlideCartOpen(true)} className="hover:text-rose-700">Complimentary 2ml Testing Vials</button></li>
                <li><button onClick={() => setActiveView('quiz')} className="hover:text-rose-700">Bespoke Olfactory Quiz</button></li>
                <li><span className="text-slate-500">Concierge: contact@aureliaparfum.com</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-body">
            <p>© 2026 AURELIA Parfumerie Internationale. All rights reserved.</p>
            <div className="flex items-center gap-6 font-mono text-[11px]">
              <span>Complimentary Worldwide Courier</span>
              <span>·</span>
              <span>100% Authentic Botanical Extracts</span>
              <span>·</span>
              <span>Complimentary Flacon Engraving</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
