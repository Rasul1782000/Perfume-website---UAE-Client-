import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, ChevronLeft, ChevronRight, Droplet, Star } from 'lucide-react';
import { PerfumeItem } from '../data/perfumes';

interface HeroBannerProps {
  onExploreCollection: () => void;
  onExploreFrench: () => void;
  onExploreArabic: () => void;
  onOpenQuiz: () => void;
  onSelectPerfume: (perfume: PerfumeItem) => void;
  featuredPerfumes: PerfumeItem[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCollection,
  onExploreFrench,
  onExploreArabic,
  onOpenQuiz,
  onSelectPerfume,
  featuredPerfumes,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: 'French Grand Parfumerie · Grasse & Paris',
      title: 'The Liquid Architecture of French Haute Parfumerie',
      subtitle:
        'Crafted under the vaulted arcades of the Palais-Royal using wild-harvested Centifolia roses, Florentine orris butter, and vintage French oak maceration.',
      ctaText: 'Explore French Atelier',
      ctaAction: onExploreFrench,
      accentLabel: 'Palais-Royal Heritage',
      image: '/src/assets/images/perfume_grasse_atelier_harvest_1792958212853.jpg',
      perfumeHighlight: featuredPerfumes.find((p) => p.id === 'velvet-rose-noire') || featuredPerfumes[0],
    },
    {
      badge: 'Arabian Royal Heritage · Dubai & Muscat',
      title: 'Rare Royal Dehn Al Oud & Smoked Taif Rose',
      subtitle:
        'Formulated with 18-year aged wild Cambodian agarwood, Kashmiri red saffron, and Hojari frankincense tears. Potent, regal, and eternal.',
      ctaText: 'Discover Royal Arabian Oud',
      ctaAction: onExploreArabic,
      accentLabel: 'Arabian Royal Courts',
      image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      perfumeHighlight: featuredPerfumes.find((p) => p.id === 'oud-imperial-royal') || featuredPerfumes[1],
    },
    {
      badge: 'Bespoke Olfactory Architecture',
      title: 'Find Your Signature Extraction Across Two Continents',
      subtitle:
        'Whether your skin resonates with Grasse floral dews or smoky Gulf ambers, take our 3-step consultation to discover your exact flacon match.',
      ctaText: 'Start Olfactory Consultation',
      ctaAction: onOpenQuiz,
      accentLabel: 'Personalized Scent Profiler',
      image: '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
      perfumeHighlight: featuredPerfumes.find((p) => p.id === 'velvet-rose-noire') || featuredPerfumes[2],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full border-b border-pink-100 bg-gradient-to-b from-[#fff5f8] via-[#fff9fa] to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Origin Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-pink-200 text-rose-700 text-xs font-mono font-semibold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-normal tracking-wide text-rose-800 leading-[1.08] text-balance">
              {slide.title}
            </h1>

            <p className="text-sm md:text-base text-slate-700 font-body leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={slide.ctaAction}
                className="px-6 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs tracking-wider uppercase font-body flex items-center gap-2 shadow-lg shadow-rose-200/60 transition-all active:scale-95"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenQuiz}
                className="px-6 py-3.5 bg-white hover:bg-rose-50 border border-pink-200 text-rose-700 hover:text-rose-800 font-bold rounded-xl text-xs tracking-wider uppercase font-body flex items-center gap-2 transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Olfactory Scent Quiz</span>
              </button>
            </div>

            {/* Proof markers: Sephora/Amazon trust points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-pink-100 text-xs text-slate-600 font-body">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>100% Sustainably Harvested</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Complimentary Engraving</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>2 Free Discovery Vials</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>DHL Express Worldwide</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Res Flacon Showcase */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-4/3 sm:aspect-16/11 rounded-3xl overflow-hidden shadow-2xl shadow-rose-200/50 border border-pink-200 group">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/75 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Card Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-pink-200 bg-rose-950/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {slide.accentLabel}
                  </span>
                  <h3 className="font-heading text-2xl font-normal text-white mt-1">
                    {slide.perfumeHighlight.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-pink-200">
                    <span className="font-bold">${slide.perfumeHighlight.price}</span>
                    <span>·</span>
                    <span>{slide.perfumeHighlight.concentration}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPerfume(slide.perfumeHighlight)}
                  className="px-3.5 py-1.5 bg-white/95 hover:bg-white text-rose-800 rounded-xl text-xs font-body font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Examine
                </button>
              </div>
            </div>

            {/* Slide Navigation Dots & Arrows */}
            <div className="flex items-center justify-between w-full max-w-md pt-3">
              <div className="flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx ? 'w-6 bg-rose-600' : 'w-2 bg-pink-200 hover:bg-rose-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="p-1.5 rounded-full bg-white hover:bg-rose-50 border border-pink-200 text-slate-600 hover:text-rose-700 shadow-xs transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="p-1.5 rounded-full bg-white hover:bg-rose-50 border border-pink-200 text-slate-600 hover:text-rose-700 shadow-xs transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
