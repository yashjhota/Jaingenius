import React, { useState } from 'react';
import { useCMS } from '../../services/cmsStore';
import { Language, PageId, NewsArticle } from '../../types';
import { Newspaper, Search, Calendar, Clock, ArrowRight, Tag, X, Sparkles, Settings } from 'lucide-react';
import { CTASection } from '../layout/CTASection';
import { SocialFeedSection } from '../home/SocialFeedSection';

interface NewsViewProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ lang, onNavigate, onOpenRegister }) => {
  const { news } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = ['All', 'Philosophy', 'Career', 'Youth Stories', 'Announcements'];

  const filteredArticles = news.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#0C1B2A] min-h-screen">
      {/* Header */}
      <section className="bg-[#0C1B2A] text-white py-20 border-b border-[#E59A1E]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628] text-xs font-bold uppercase tracking-widest">
            <Newspaper className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>Perspectives & Chronicles</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FAF8F5] tracking-tight font-display">
            News, Articles & Updates
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Thought leadership on Jain philosophy for modern careers, cohort milestones, event summaries,
            and organizational announcements.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-4 sm:py-6 bg-white border-b border-slate-200 sticky top-[60px] sm:top-[72px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Categories */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto scrollbar-none touch-pan-x pb-1 md:pb-0">
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

          {/* Search Input & Admin Publish */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-[#B8780E] text-xs font-semibold shrink-0 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Post</span>
            </button>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[#E59A1E]/50 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {art.imageUrl && (
                  <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 mb-2">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E59A1E]/15 text-[#B8780E]">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {art.readTime}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#0C1B2A] font-display group-hover:text-[#B8780E] transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#B8780E]">
                <span>By {art.author}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#081320]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl text-[#0C1B2A]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8780E]">
                {activeArticle.category} • {activeArticle.readTime}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-[#0C1B2A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-4 max-h-[65vh] overflow-y-auto">
              {activeArticle.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                  <img
                    src={activeArticle.imageUrl}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="text-2xl font-bold text-[#0C1B2A] font-display leading-tight">
                {activeArticle.title}
              </h2>
              <div className="text-xs text-slate-500 pb-2 border-b border-slate-100">
                Published on {activeArticle.date} • By {activeArticle.author}
              </div>

              <div className="space-y-4 pt-2 text-sm text-slate-700 leading-relaxed">
                {activeArticle.fullBody.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0C1B2A] text-white text-xs font-bold hover:bg-[#162E4A]"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Social Media Feed */}
      <div className="border-t border-slate-200 bg-slate-50/50">
        <SocialFeedSection
          lang={lang}
          onNavigate={onNavigate}
          showHeaderAction={false}
        />
      </div>

      {/* Bottom CTA Band */}
      <CTASection lang={lang} onOpenRegister={onOpenRegister} />
    </div>
  );
};
