import React, { useState } from 'react';
import { HOLISTIC_PILLARS } from '../../data/pillars';
import { Language, PageId } from '../../types';
import { Sparkles, Briefcase, Activity, HeartHandshake, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface PillarsSectionProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({ lang, onNavigate }) => {
  const [selectedPillarId, setSelectedPillarId] = useState(HOLISTIC_PILLARS[0].id);

  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-5 h-5" />,
    Briefcase: <Briefcase className="w-5 h-5" />,
    Activity: <Activity className="w-5 h-5" />,
    HeartHandshake: <HeartHandshake className="w-5 h-5" />,
  };

  const activePillar = HOLISTIC_PILLARS.find((p) => p.id === selectedPillarId) || HOLISTIC_PILLARS[0];

  return (
    <section id="holistic-development" className="py-20 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E59A1E]/15 text-[#B8780E] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>Foundational Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0C1B2A] tracking-tight font-display">
            {lang === 'en' ? 'Four Pillars of Holistic Growth' : 'समग्र विकास के चार मुख्य स्तंभ'}
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            {lang === 'en'
              ? 'True personal evolution requires an integrated synthesis. Jain Genius nurtures youth across four interconnected dimensions, transforming intention into enduring character.'
              : 'व्यक्ति का वास्तविक उत्थान एकांगी नहीं हो सकता। जैन जीनियस चार परस्पर जुड़े आयामों में युवाओं को पोषित करता है।'}
          </p>
        </div>

        {/* Editorial Split Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Pillar Navigator (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {HOLISTIC_PILLARS.map((pillar, index) => {
              const isSelected = selectedPillarId === pillar.id;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-[#0C1B2A] text-white border-[#E59A1E] shadow-lg translate-x-1'
                      : 'bg-white text-[#0C1B2A] border-slate-200 hover:border-[#E59A1E]/50 hover:bg-slate-50/80'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#E59A1E] text-[#0C1B2A] shadow-md'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {iconMap[pillar.icon]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#F3A628]' : 'text-slate-400'}`}>
                        Pillar 0{index + 1}
                      </span>
                      {isSelected && <ChevronRight className="w-4 h-4 text-[#F3A628]" />}
                    </div>
                    <h3 className="text-base font-bold font-display mt-0.5 truncate">
                      {lang === 'en' ? pillar.titleEn : pillar.titleHi}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {pillar.subtitleEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Editorial Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[440px]">
            {/* Soft decorative accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#E59A1E]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0C1B2A] text-[#F3A628] flex items-center justify-center">
                    {iconMap[activePillar.icon]}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#0C1B2A] font-display">
                      {lang === 'en' ? activePillar.titleEn : activePillar.titleHi}
                    </h4>
                    <span className="text-xs font-semibold text-[#B8780E]">
                      {activePillar.subtitleEn}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {lang === 'en' ? activePillar.descriptionEn : activePillar.descriptionHi}
              </p>

              {/* Supporting activities */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-[#0C1B2A] uppercase tracking-wider block">
                  Core Guided Activities & Disciplines:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(lang === 'en' ? activePillar.keyActivitiesEn : activePillar.keyActivitiesHi).map(
                    (act, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#E59A1E] shrink-0 mt-0.5" />
                        <span className="leading-snug">{act}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Read more & What We Do Navigation link */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between mt-6">
              <span className="text-xs text-slate-500 font-medium">
                Integrated into the Daily Activity Card (DAC) system
              </span>

              <button
                onClick={() => {
                  onNavigate('what-we-do');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C1B2A] hover:text-[#B8780E] transition-colors group"
              >
                <span>Explore Full Holistic Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
