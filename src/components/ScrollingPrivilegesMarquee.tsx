import React, { useState } from 'react';
import { Truck, Gift, Sparkles, Globe, Percent, Check, Copy } from 'lucide-react';

interface ScrollingPrivilegesMarqueeProps {
  onCopyPromo?: (code: string) => void;
}

export const ScrollingPrivilegesMarquee: React.FC<ScrollingPrivilegesMarqueeProps> = ({
  onCopyPromo,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('AURELIA15');
    setCopied(true);
    if (onCopyPromo) onCopyPromo('AURELIA15');
    setTimeout(() => setCopied(false), 2400);
  };

  const marqueeItems = [
    {
      id: 'item-1',
      icon: <Truck className="w-4 h-4 text-rose-600 shrink-0" />,
      title: 'Complimentary Worldwide Express Courier over $150',
      badge: 'Insured & Temperature-Controlled',
    },
    {
      id: 'divider-1',
      isDivider: true,
    },
    {
      id: 'item-2',
      icon: <Gift className="w-4 h-4 text-rose-600 shrink-0" />,
      title: '2 Free Discovery Vials (French & Arabian) with Every Flacon',
      badge: 'Test Before Opening',
    },
    {
      id: 'divider-2',
      isDivider: true,
    },
    {
      id: 'item-3',
      icon: <Percent className="w-4 h-4 text-rose-600 shrink-0" />,
      title: (
        <span className="flex items-center gap-1.5">
          <span>VIP Privilege: Use code</span>
          <button
            onClick={handleCopyCode}
            className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-mono font-bold text-xs tracking-wider hover:bg-rose-700 transition-colors inline-flex items-center gap-1 shadow-2xs"
            title="Click to copy VIP code"
          >
            <span>AURELIA15</span>
            {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-pink-200" />}
          </button>
          <span>for 15% off</span>
        </span>
      ),
      badge: copied ? 'Code Copied!' : '1-Click Apply',
    },
    {
      id: 'divider-3',
      isDivider: true,
    },
    {
      id: 'item-4',
      icon: <Globe className="w-4 h-4 text-rose-600 shrink-0" />,
      title: 'Paris · Grasse · Dubai · Muscat',
      badge: 'Dual Atelier Heritage',
    },
    {
      id: 'divider-4',
      isDivider: true,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#fff7f9] via-white to-[#fff7f9] border-y border-pink-200/90 py-4 select-none shadow-xs">
      {/* Soft gradient edge fade overlays */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#fff7f9] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#fff7f9] to-transparent z-10" />

      {/* Infinite Horizontal Scrolling Track */}
      <div className="flex animate-marquee-smooth items-center">
        {/* Render sequence twice for seamless loop without jump */}
        {[1, 2].map((seqIdx) => (
          <div key={seqIdx} className="flex items-center shrink-0 space-x-8 pr-8">
            {marqueeItems.map((item) => {
              if (item.isDivider) {
                return (
                  <div key={item.id} className="flex items-center gap-2 text-rose-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80" />
                    <Sparkles className="w-3 h-3 text-rose-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80" />
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/90 border border-pink-200/80 shadow-2xs hover:border-rose-400 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-rose-50 border border-pink-200 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-heading font-medium text-slate-800 tracking-wide whitespace-nowrap">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[9.5px] font-mono uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-pink-200 tracking-wider whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};
