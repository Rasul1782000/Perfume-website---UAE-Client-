import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Quote } from 'lucide-react';

interface ReviewItem {
  id: string;
  author: string;
  location: string;
  title: string;
  comment: string;
  perfumeName: string;
  perfumeOrigin: 'French Atelier' | 'Arabian Royal';
  rating: number;
  date: string;
}

const FEATURED_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Baroness Camille de Montmirail',
    location: 'Paris, France',
    title: 'An ethereal symphony of May Rose and Florentine Orris',
    comment:
      'Rose de Mai Impériale is unlike any modern commercial perfume. The sheer depth of the 30% concentration lasts well over 16 hours on silk. The complimentary 2ml sample allowed me to wear it an entire evening before breaking the flacon seal.',
    perfumeName: 'Rose de Mai Impériale',
    perfumeOrigin: 'French Atelier',
    rating: 5,
    date: 'Verified Buyer · October 2026',
  },
  {
    id: 'rev-2',
    author: 'Sheikh Omar Al-Zahrani',
    location: 'Riyadh, Saudi Arabia',
    title: 'The pure essence of aged Cambodian Dehn Al Oud',
    comment:
      'Oud Impérial Al-Malaki is authentic royal perfumery. The Cambodian agarwood has that deep balsamic animalic warmth without ever turning harsh, harmonizing perfectly with Taif rose and Omani frankincense. Magnificent presentation coffret.',
    perfumeName: 'Oud Impérial Al-Malaki',
    perfumeOrigin: 'Arabian Royal',
    rating: 5,
    date: 'Verified Buyer · October 2026',
  },
  {
    id: 'rev-3',
    author: 'Elena Rostova',
    location: 'Geneva, Switzerland',
    title: 'Creamy sandalwood with mesmerizing sillage',
    comment:
      'Santal Mystique has become my signature. The bespoke bottle engraving of my initials looks breathtaking on my vanity. Fast 2-day insured courier to Switzerland, beautifully chilled packaging.',
    perfumeName: 'Santal Mystique Extrait',
    perfumeOrigin: 'French Atelier',
    rating: 5,
    date: 'Verified Buyer · September 2026',
  },
  {
    id: 'rev-4',
    author: 'Khalid & Fatima Al-Maktoum',
    location: 'Dubai, UAE',
    title: 'Royal Ambergris & Saffron of unmatched luxury',
    comment:
      'Ambre Royal Al-Andalus reminds me of the classical perfumeries of Granada and Dubai. The sillage creates an intoxicating golden aura. The 4 interest-free Tabby payments were seamless.',
    perfumeName: 'Ambre Royal Al-Andalus',
    perfumeOrigin: 'Arabian Royal',
    rating: 5,
    date: 'Verified Buyer · September 2026',
  },
];

export const ReviewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? FEATURED_REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === FEATURED_REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const activeReview = FEATURED_REVIEWS[currentIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-pink-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-rose-600 font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Verified Connoisseur Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading text-rose-800">
            Worn in the Salons of Paris & the Palaces of Arabia
          </h2>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevReview}
            className="p-2.5 rounded-xl border border-pink-200 bg-white hover:bg-rose-50 text-rose-700 transition-colors shadow-xs"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono text-slate-500 font-semibold px-2">
            {currentIndex + 1} / {FEATURED_REVIEWS.length}
          </span>
          <button
            onClick={nextReview}
            className="p-2.5 rounded-xl border border-pink-200 bg-white hover:bg-rose-50 text-rose-700 transition-colors shadow-xs"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Featured Testimonial Card */}
      <div className="bg-gradient-to-r from-[#fff7f9] via-pink-50/40 to-white rounded-3xl border border-pink-200 p-8 md:p-12 shadow-sm relative overflow-hidden">
        <Quote className="w-24 h-24 text-rose-100 absolute -bottom-4 -right-4 pointer-events-none stroke-1" />

        <div className="max-w-3xl space-y-6 relative z-10">
          {/* Star ratings & origin tag */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(activeReview.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
              ))}
            </div>
            <span
              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-semibold ${
                activeReview.perfumeOrigin === 'Arabian Royal'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              {activeReview.perfumeOrigin === 'Arabian Royal' ? 'Arabian Oud Creation' : 'French Haute Parfumerie'}
            </span>
            <span className="text-xs font-body font-bold text-rose-800">
              {activeReview.perfumeName}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-heading text-rose-900 leading-snug">
            "{activeReview.title}"
          </h3>

          <p className="text-sm md:text-base text-slate-700 font-body leading-relaxed">
            {activeReview.comment}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-pink-200/80">
            <div>
              <h4 className="font-heading text-xl text-rose-800">{activeReview.author}</h4>
              <p className="text-xs text-slate-500 font-body">{activeReview.location}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{activeReview.date}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
