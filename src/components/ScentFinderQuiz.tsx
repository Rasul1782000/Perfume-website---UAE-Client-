import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, Check, ShoppingBag, Eye } from 'lucide-react';
import { PERFUMES_LIST, PerfumeItem } from '../data/perfumes';
import { QuizProfile } from '../utils/scentMatch';

interface ScentFinderQuizProps {
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onAddToCart: (perfume: PerfumeItem) => void;
  onQuizComplete?: (profile: QuizProfile, recommendedPerfume: PerfumeItem) => void;
  onResetQuiz?: () => void;
}

export const ScentFinderQuiz: React.FC<ScentFinderQuizProps> = ({
  onSelectPerfume,
  onAddToCart,
  onQuizComplete,
  onResetQuiz,
}) => {
  const [step, setStep] = useState<number>(1);
  const [aura, setAura] = useState<string>('intimate');
  const [season, setSeason] = useState<string>('autumn');
  const [world, setWorld] = useState<string>('woody');
  const [recommendation, setRecommendation] = useState<PerfumeItem | null>(null);

  const handleFinish = (selectedWorld: string) => {
    setWorld(selectedWorld);
    // Determine best match
    let match = PERFUMES_LIST[0]; // default Santal
    if (selectedWorld === 'woody') {
      match = PERFUMES_LIST.find((p) => p.id === 'santal-mystique') || PERFUMES_LIST[0];
    } else if (selectedWorld === 'floral') {
      match = PERFUMES_LIST.find((p) => p.id === 'velvet-rose-noire') || PERFUMES_LIST[1];
    } else if (selectedWorld === 'citrus') {
      match = PERFUMES_LIST.find((p) => p.id === 'citrus-neroli-blanc') || PERFUMES_LIST[2];
    } else if (selectedWorld === 'gourmand') {
      match = PERFUMES_LIST.find((p) => p.id === 'tonka-vanille-amber') || PERFUMES_LIST[3];
    } else {
      match = PERFUMES_LIST.find((p) => p.id === 'oud-imperial-royal') || PERFUMES_LIST[4];
    }
    setRecommendation(match);
    setStep(4);

    if (onQuizComplete) {
      onQuizComplete(
        {
          world: selectedWorld,
          aura,
          season,
          recommendedId: match.id,
        },
        match
      );
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setRecommendation(null);
    if (onResetQuiz) {
      onResetQuiz();
    }
  };

  return (
    <div className="p-6 md:p-8 bg-gradient-to-b from-[#fff5f8] via-[#fff9fa] to-white border border-pink-200 rounded-3xl text-slate-800 shadow-md">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span className="text-rose-600 font-body uppercase tracking-widest flex items-center gap-1.5 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Olfactory Signature Consultation
          </span>
          {step <= 3 && <span className="text-slate-500 font-mono">Step {step} of 3</span>}
        </div>

        {/* Question 1: Aura & Sillage */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-3xl font-heading text-rose-700">How do you desire your fragrance to be perceived?</h3>
            <p className="text-xs text-slate-600 font-body">
              The projection (sillage) defines the aura you leave in a room.
            </p>

            <div className="grid grid-cols-1 gap-2.5 pt-2 font-body">
              {[
                {
                  id: 'intimate',
                  title: 'A Second Skin (Intimate Sillage)',
                  desc: 'Soft, creamy, whispered. Apparent only to those in close embrace.',
                },
                {
                  id: 'moderate',
                  title: 'Magnetic Trail (Balanced Sillage)',
                  desc: 'Noticeable as you pass by, elegant and memorable without overwhelming.',
                },
                {
                  id: 'enveloping',
                  title: 'Commanding Presence (Grand Sillage)',
                  desc: 'Rich, potent extrait that commands attention and lingers throughout the evening.',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setAura(opt.id);
                    setStep(2);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    aura === opt.id
                      ? 'border-rose-400 bg-rose-50 text-slate-800 font-bold shadow-xs'
                      : 'border-pink-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50/50 shadow-xs'
                  }`}
                >
                  <div className="font-heading text-2xl font-normal text-rose-700">{opt.title}</div>
                  <div className="text-xs text-slate-600 mt-1 font-body">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2: Season & Atmosphere */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-3xl font-heading text-rose-700">Which atmosphere calls to your senses?</h3>
            <p className="text-xs text-slate-600 font-body">Temperature and humidity deeply influence evaporation dynamics.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-body">
              {[
                {
                  id: 'mediterranean',
                  title: 'Mediterranean Sun & Sea',
                  desc: 'Sun-drenched citrus groves, neroli blossoms, sea salt breeze.',
                },
                {
                  id: 'parisian_night',
                  title: 'Parisian Nocturne',
                  desc: 'Candlelit salon, velvety red roses, aged cognac, smoked woods.',
                },
                {
                  id: 'library',
                  title: 'Sanctuary of Old Books',
                  desc: 'Smooth sandalwood, powdery iris, parchment, dry cardamom.',
                },
                {
                  id: 'oriental_palace',
                  title: 'Amber Court at Twilight',
                  desc: 'Rare Cambodian oud, warm vanilla pods, roasted tonka bean.',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSeason(opt.id);
                    setStep(3);
                  }}
                  className="p-4 rounded-2xl text-left border border-pink-200 bg-white hover:border-rose-400 hover:bg-rose-50/50 shadow-xs transition-all"
                >
                  <div className="font-heading text-xl font-normal text-rose-700">{opt.title}</div>
                  <div className="text-xs text-slate-600 mt-1 font-body">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3: Primary Olfactory Family */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-3xl font-heading text-rose-700">Select your primary note affinity</h3>
            <p className="text-xs text-slate-600 font-body">The dominant raw material in your ideal formulation.</p>

            <div className="grid grid-cols-1 gap-2 pt-2 font-body">
              {[
                { id: 'woody', label: 'Woody & Meditative (Mysore Sandalwood, Orris, Papyrus)' },
                { id: 'floral', label: 'Dark Opulent Florals (Damask Rose, Grasse Centifolia, Oud)' },
                { id: 'citrus', label: 'Luminous Fresh Citrus (Calabrian Bergamot, Neroli Blossom)' },
                { id: 'gourmand', label: 'Warm Amber Gourmand (Bourbon Vanilla, Tonka, Cognac)' },
                { id: 'amber', label: 'Solar Haute Amber (Tuscan Iris Butter, Honey, Mimosa)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleFinish(opt.id)}
                  className="p-3.5 rounded-2xl text-left border border-pink-200 bg-white hover:border-rose-400 hover:bg-rose-50/50 text-sm font-body text-slate-800 shadow-xs transition-all flex justify-between items-center"
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-4 h-4 text-rose-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Reveal Bespoke Recommendation */}
        {step === 4 && recommendation && (
          <div className="space-y-5 animate-in fade-in text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-rose-600 font-semibold">
              Your Prescribed Olfactory Match
            </span>
            <h3 className="text-4xl font-heading text-rose-700">{recommendation.name}</h3>
            <p className="text-xs text-slate-600 italic font-body max-w-md mx-auto">
              "{recommendation.description}"
            </p>

            <div className="relative max-w-sm mx-auto aspect-4/3 rounded-2xl overflow-hidden border border-pink-200 shadow-xl shadow-rose-100/60">
              <img
                src={recommendation.image}
                alt={recommendation.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 p-2.5 bg-white/95 backdrop-blur-md rounded-xl text-xs flex justify-between text-slate-800 border border-pink-200 shadow-sm">
                <span className="font-mono text-slate-600 font-medium">{recommendation.family} · {recommendation.concentration}</span>
                <span className="font-heading font-bold text-rose-700 text-base">${recommendation.price}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => onSelectPerfume(recommendation)}
                className="px-5 py-2.5 bg-white hover:bg-rose-50 border border-pink-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Eye className="w-4 h-4 text-rose-500" />
                <span>Examine Flacon Details</span>
              </button>
              <button
                onClick={() => onAddToCart(recommendation)}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-200/50 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add 50ml Flacon to Bag — ${recommendation.price}</span>
              </button>
            </div>

            <button
              onClick={resetQuiz}
              className="text-xs text-slate-500 hover:text-rose-700 flex items-center gap-1 mx-auto mt-2 transition-colors font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Olfactory Consultation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
