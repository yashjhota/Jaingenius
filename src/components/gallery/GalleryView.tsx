import React, { useState } from 'react';
import { useCMS } from '../../services/cmsStore';
import { GalleryItem, Language, PageId } from '../../types';
import {
  Sparkles,
  Image,
  Video,
  Calendar,
  MapPin,
  X,
  Filter,
  Camera,
  Settings,
  Edit3,
  Trash2,
  Plus,
} from 'lucide-react';
import { CTASection } from '../layout/CTASection';

interface GalleryViewProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
  onOpenEditGallery?: (item: GalleryItem) => void;
  onOpenAddGallery?: () => void;
  onShowToast?: (msg: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  lang,
  onNavigate,
  onOpenRegister,
  onOpenEditGallery,
  onOpenAddGallery,
  onShowToast,
}) => {
  const { gallery, isAuthenticated, isLiveEditMode, moveToTrash } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Youth Session', 'Discourse', 'Workshop', 'Shivir'];

  const filteredItems = gallery
    .filter((item) => !item.isDeleted)
    .filter((item) => (selectedCategory === 'All' ? true : item.category === selectedCategory));

  return (
    <div className="bg-[#FAF8F5] text-[#0C1B2A] min-h-screen">
      {/* Header */}
      <section className="bg-[#0C1B2A] text-white py-20 border-b border-[#E59A1E]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628] text-xs font-bold uppercase tracking-widest">
            <Camera className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>Community Moments</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FAF8F5] tracking-tight font-display">
            Photo & Assembly Gallery
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Moments of devotion, fellowship, rigorous study, and collective growth captured across our
            Bangalore assemblies and residential youth shivirs.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-4 sm:py-6 bg-white border-b border-slate-200 sticky top-[60px] sm:top-[72px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none touch-pan-x pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0C1B2A] text-white border-[#E59A1E]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 justify-end sm:justify-auto">
            {isLiveEditMode && isAuthenticated && (
              <button
                onClick={onOpenAddGallery}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E59A1E] hover:bg-[#F3A628] text-[#0C1B2A] text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Photo</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-[#B8780E] text-xs font-semibold shrink-0 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Manage</span>
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Admin Live Action Ribbon */}
              {isLiveEditMode && isAuthenticated && (
                <div className="bg-[#0C1B2A] text-white px-3 py-1.5 flex items-center justify-between text-[11px] border-b border-[#E59A1E]/30 z-20">
                  <span className="text-[#F3A628] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E59A1E]" />
                    <span>Live Photo</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditGallery?.(item);
                      }}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-[#E59A1E] hover:text-[#0C1B2A] text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await moveToTrash('gallery', item.id);
                        onShowToast?.(`Photo "${item.title}" moved to Trash.`);
                      }}
                      className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-0.5"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Trash</span>
                    </button>
                  </div>
                </div>
              )}
              {/* Media Card Preview */}
              <div className="relative aspect-video bg-gradient-to-br from-[#0C1B2A] to-[#162E4A] overflow-hidden">
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="p-6 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-[#E59A1E]/20 text-[#F3A628] text-[11px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {item.year}
                      </span>
                    </div>

                    <div className="text-white space-y-1">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-widest">
                        Archive Documentation
                      </span>
                      <p className="text-sm font-bold font-display line-clamp-2 text-[#FAF8F5] group-hover:text-[#F3A628] transition-colors">
                        {item.title}
                      </p>
                    </div>
                  </div>
                )}

                {item.url && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#0C1B2A]/80 backdrop-blur-xs text-[#F3A628] text-[10px] font-bold uppercase tracking-wider border border-white/10">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-semibold text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                        {item.year}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white line-clamp-1 font-display">
                      {item.title}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E59A1E]" />
                    {item.event || 'Pathshala Hall, Chickpet'}
                  </span>
                  <span className="text-[#B8780E] font-semibold">View Record →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox / Detail Modal */}
      {activeMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#081320]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative w-full max-w-2xl bg-[#0C1B2A] border border-[#E59A1E]/40 rounded-3xl overflow-hidden shadow-2xl text-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#081320]">
              <div className="text-xs">
                <span className="text-[#F3A628] font-bold uppercase">{activeMedia.category}</span>
                <span className="text-slate-400 mx-2">•</span>
                <span>Assembly Year {activeMedia.year}</span>
              </div>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeMedia.url && (
              <div className="aspect-video bg-black max-h-80 overflow-hidden flex items-center justify-center">
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="p-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#E59A1E]/20 text-[#F3A628] text-xs font-bold uppercase tracking-wider inline-block">
                {activeMedia.category} Assembly Record
              </span>
              <h3 className="text-2xl font-bold text-[#FAF8F5] font-display">
                {activeMedia.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeMedia.caption}
              </p>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E59A1E]" />
                  {activeMedia.event || 'Pathshala Hall, Chickpet Jain Temple'}
                </span>

                <button
                  onClick={() => {
                    setActiveMedia(null);
                    onOpenRegister();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E59A1E] text-[#0C1B2A] font-bold hover:bg-[#F5B738] transition-colors"
                >
                  Attend Next Assembly
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <CTASection lang={lang} onOpenRegister={onOpenRegister} />
    </div>
  );
};
