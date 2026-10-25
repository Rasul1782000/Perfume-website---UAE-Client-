import React, { useState } from 'react';
import { Eye, ArrowRight, Sparkles, X, ChevronRight, Droplet } from 'lucide-react';
import { PERFUMES_LIST, PerfumeItem } from '../data/perfumes';

interface VisualCatalogGalleryProps {
  onSelectPerfume: (perfume: PerfumeItem) => void;
  onExploreCatalog: () => void;
}

interface GalleryLook {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  location: string;
  category: string;
  linkedPerfumeId: string;
  tagline: string;
}

export const VisualCatalogGallery: React.FC<VisualCatalogGalleryProps> = ({
  onSelectPerfume,
  onExploreCatalog,
}) => {
  const [selectedLook, setSelectedLook] = useState<GalleryLook | null>(null);

  const galleryLooks: GalleryLook[] = [
    {
      id: 'look-1',
      image: '/src/assets/images/perfume_grasse_atelier_harvest_1792958212853.jpg',
      title: 'Dawn Harvest in Grasse',
      subtitle: 'Centifolia Rose de Mai plucked at 6 AM over Carrara marble',
      location: 'Domaine de Manon · Grasse, France',
      category: 'Artisanal Floristry',
      linkedPerfumeId: 'velvet-rose-noire',
      tagline: 'Preserving volatile morning dew molecules before the Provençal sun warms the petals.',
    },
    {
      id: 'look-2',
      image: '/src/assets/images/perfume_crystal_flacons_gallery_1792958227158.jpg',
      title: 'The Palais-Royal Triptych',
      subtitle: 'Heavy crystal flacons resting on blush plaster pedestals',
      location: 'Galerie de Valois · Paris 1er',
      category: 'Crystal Architecture',
      linkedPerfumeId: 'aurore-doree',
      tagline: 'Custom mouth-blown French crystal with polished rose-gold engraved collars.',
    },
    {
      id: 'look-3',
      image: '/src/assets/images/perfume_santal_flacon_1792865209822.jpg',
      title: 'Santal & Sacred Woods',
      subtitle: 'Creamy Australian santalum album aged in French oak casks',
      location: 'Ord River & Paris Atelier',
      category: 'Aged Extraits',
      linkedPerfumeId: 'santal-mystique',
      tagline: 'Six months of oak barrel maturation allows natural aromatic resins to fuse seamlessly.',
    },
    {
      id: 'look-4',
      image: '/src/assets/images/perfume_rose_noir_flacon_1792865210916.jpg',
      title: 'Velvet Rose Noire Nocturne',
      subtitle: 'Dark cassis nectar and Grasse centifolia petals',
      location: 'Chiaroscuro Studio · Paris',
      category: 'Pure Extrait (30%)',
      linkedPerfumeId: 'velvet-rose-noire',
      tagline: 'A nocturnal celebration of floral depth, smoked patchouli, and black amber.',
    },
    {
      id: 'look-5',
      image: '/src/assets/images/perfume_vanilla_flacon_1792865211359.jpg',
      title: 'Bourbon Vanilla in Cognac Oak',
      subtitle: 'Madagascar vanilla pods macerated in vintage casks',
      location: 'Charente & Paris Atelier',
      category: 'Gourmand Reserve',
      linkedPerfumeId: 'tonka-vanille-amber',
      tagline: 'Split Madagascar vanilla beans steeped with roasted tonka and cured tobacco leaves.',
    },
    {
      id: 'look-6',
      image: '/src/assets/images/perfume_bergamot_flacon_1792865211919.jpg',
      title: 'Calabrian Citrus & Solar Neroli',
      subtitle: 'Cold-pressed bergamot zest and orange blossom water',
      location: 'Côte d’Azur & Calabria',
      category: 'Solar Luminescence',
      linkedPerfumeId: 'citrus-neroli-blanc',
      tagline: 'Pure Mediterranean effervescence bottled in crystalline flacons.',
    },
  ];

  const handleOpenLinkedPerfume = (perfumeId: string) => {
    const found = PERFUMES_LIST.find((p) => p.id === perfumeId) || PERFUMES_LIST[0];
    onSelectPerfume(found);
    setSelectedLook(null);
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-pink-100">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-pink-100 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-600 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Visual Lookbook & Photographic Catalog
            </span>
            <h2 className="text-4xl md:text-5xl font-heading text-rose-800">
              The Architecture of Haute Parfumerie
            </h2>
            <p className="text-xs md:text-sm text-slate-600 font-body max-w-2xl leading-relaxed">
              Explore our visual anthology of hand-blown French crystal flacons, dawn Grasse harvests, and aged botanical macerations captured in natural light.
            </p>
          </div>

          <button
            onClick={onExploreCatalog}
            className="px-5 py-2.5 rounded-full border border-pink-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors self-start md:self-auto shadow-2xs"
          >
            <span>Explore All 8 Flacons</span>
            <ArrowRight className="w-4 h-4 text-rose-600" />
          </button>
        </div>

        {/* Visual Lookbook Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryLooks.map((look) => (
            <div
              key={look.id}
              onClick={() => setSelectedLook(look)}
              className="group cursor-pointer bg-white border border-pink-100 hover:border-rose-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-500 flex flex-col"
            >
              {/* Photo */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-rose-50/50">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-white font-mono flex items-center gap-1.5 font-medium">
                    <Eye className="w-4 h-4 text-pink-200" />
                    Examine Editorial Image & Scent Notes
                  </span>
                </div>
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider text-rose-700 border border-pink-200 font-bold shadow-xs">
                  {look.category}
                </div>
              </div>

              {/* Metadata */}
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-medium">
                    {look.location}
                  </span>
                  <h3 className="font-heading text-2xl text-rose-800 group-hover:text-pink-600 transition-colors mt-0.5">
                    {look.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-body line-clamp-2 mt-1">
                    {look.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-pink-100/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-rose-700 font-semibold group-hover:underline">
                    View Flacon Specifications →
                  </span>
                  <span className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Resolution Modal Spotlight */}
      {selectedLook && (
        <div
          onClick={() => setSelectedLook(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-pink-200 flex flex-col md:flex-row text-slate-800 max-h-[90vh]"
          >
            <button
              onClick={() => setSelectedLook(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-rose-700 border border-pink-200 transition-colors shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo side */}
            <div className="w-full md:w-3/5 bg-slate-100 overflow-hidden">
              <img
                src={selectedLook.image}
                alt={selectedLook.title}
                className="w-full h-full object-cover max-h-[60vh] md:max-h-full"
              />
            </div>

            {/* Info side */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-rose-600 font-bold block">
                    {selectedLook.location} · {selectedLook.category}
                  </span>
                  <h3 className="font-heading text-3xl md:text-4xl text-rose-800 leading-tight mt-1">
                    {selectedLook.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-body mt-2 leading-relaxed">
                    {selectedLook.subtitle}
                  </p>
                </div>

                <div className="p-4 bg-rose-50/60 rounded-2xl border border-pink-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-rose-800 font-semibold">
                    <Droplet className="w-3.5 h-3.5 text-rose-600" />
                    <span>Maison Formulation Note</span>
                  </div>
                  <p className="text-xs text-slate-700 font-body leading-relaxed">
                    {selectedLook.tagline}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-pink-100 space-y-2">
                <button
                  onClick={() => handleOpenLinkedPerfume(selectedLook.linkedPerfumeId)}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-700 hover:to-pink-700 text-white font-body font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2"
                >
                  <span>Examine Matching Flacon</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedLook(null)}
                  className="w-full py-2 text-xs font-body text-slate-500 hover:text-slate-700 transition-colors text-center"
                >
                  Close Spotlight
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
