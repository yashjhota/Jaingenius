import React from 'react';
import { TOPICS_WE_TEACH } from '../../data/topics';
import { Language, TopicItem } from '../../types';
import { Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface TopicsCarouselProps {
  lang: Language;
}

export const TopicsCarousel: React.FC<TopicsCarouselProps> = ({ lang }) => {
  // Duplicate array 3 times for seamless infinite continuous scroll loop
  const seamlessTopics = [...TOPICS_WE_TEACH, ...TOPICS_WE_TEACH, ...TOPICS_WE_TEACH];

  const getStatusBadge = (status: TopicItem['status']) => {
    switch (status) {
      case 'Ongoing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            <span>Ongoing</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-700 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Completed</span>
          </span>
        );
      case 'Coming Soon':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E59A1E]/15 text-[#B8780E] border border-[#E59A1E]/40 font-semibold">
            <Clock className="w-3 h-3 text-[#E59A1E]" />
            <span>Coming Soon</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-16 bg-[#FAF8F5] border-y border-[#E59A1E]/20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E59A1E]/15 text-[#B8780E] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>Practical Curriculums</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C1B2A] tracking-tight font-display">
            {lang === 'en' ? 'Topics We Teach' : 'हम क्या सिखाते हैं'}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            {lang === 'en'
              ? 'Continuous hands-on skill modules designed to make youth financially capable and professionally self-reliant.'
              : 'व्यावहारिक कौशल जो युवाओं को आर्थिक व व्यावसायिक रूप से आत्मनिर्भर और दक्ष बनाते हैं।'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-[#E59A1E]" />
          <span>Hover / tap card to pause scroll</span>
        </div>
      </div>

      {/* Continuously looping infinite ticker container */}
      <div className="relative w-full overflow-hidden mask-fade-edges">
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10 pointer-events-none" />

        <div className="animate-infinite-scroll py-2">
          {seamlessTopics.map((topic, idx) => (
            <div
              key={`${topic.id}-${idx}`}
              className="w-[280px] sm:w-[320px] shrink-0 mx-3 p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#E59A1E]/60 transition-all duration-200 select-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {topic.category}
                  </span>
                  {getStatusBadge(topic.status)}
                </div>

                <h3 className="text-lg font-bold text-[#0C1B2A] font-display">
                  {lang === 'en' ? topic.title : topic.titleHi}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                  {topic.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Jain Genius Faculty</span>
                <span className="text-[#E59A1E] font-semibold">Practical Lab</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
