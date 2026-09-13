import React, { useState } from 'react';
import { HOLISTIC_PILLARS } from '../../data/pillars';
import { TOPICS_WE_TEACH } from '../../data/topics';
import { DAC_14_TASKS } from '../../data/dacTasks';
import { Language, PageId } from '../../types';
import { TRANSLATIONS } from '../../data/i18n';
import { CTASection } from '../layout/CTASection';
import { Sparkles, Briefcase, Activity, HeartHandshake, CheckCircle2, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

interface WhatWeDoViewProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const WhatWeDoView: React.FC<WhatWeDoViewProps> = ({ lang, onNavigate, onOpenRegister }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="w-5 h-5" />,
    Briefcase: <Briefcase className="w-5 h-5" />,
    Activity: <Activity className="w-5 h-5" />,
    HeartHandshake: <HeartHandshake className="w-5 h-5" />,
  };

  const filteredPillars = activeFilter === 'all'
    ? HOLISTIC_PILLARS
    : HOLISTIC_PILLARS.filter((p) => p.id === activeFilter);

  return (
    <div className="bg-[#FAF8F5] text-[#0C1B2A] min-h-screen">
      {/* Header */}
      <section className="bg-[#0C1B2A] text-white py-20 border-b border-[#E59A1E]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628] text-xs font-bold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>Comprehensive Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FAF8F5] tracking-tight font-display">
            What We Do
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Four interconnected dimensions of development designed to take youth from intention to excellence:
            Spiritual, Financial, Physical, and Mental.
          </p>
        </div>
      </section>

      {/* Interactive Pillar Filter Controls */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-[72px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-2">
              Filter by Dimension:
            </span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                activeFilter === 'all'
                  ? 'bg-[#0C1B2A] text-white border-[#E59A1E]'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              All 4 Pillars
            </button>
            {HOLISTIC_PILLARS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveFilter(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border flex items-center gap-2 ${
                  activeFilter === p.id
                    ? 'bg-[#0C1B2A] text-white border-[#E59A1E]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{p.titleEn}</span>
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center text-xs text-slate-500 gap-1.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#E59A1E]" />
            <span>Mapped to 14-Habit DAC</span>
          </div>
        </div>
      </section>

      {/* Detailed Pillars Breakdown */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {filteredPillars.map((pillar, idx) => (
          <div
            key={pillar.id}
            className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Details (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0C1B2A] text-[#F3A628] flex items-center justify-center shrink-0">
                    {iconMap[pillar.icon]}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B8780E]">
                      Dimension 0{idx + 1}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0C1B2A] font-display">
                      {lang === 'en' ? pillar.titleEn : pillar.titleHi}
                    </h2>
                  </div>
                </div>

                <p className="text-slate-700 text-base leading-relaxed">
                  {lang === 'en' ? pillar.descriptionEn : pillar.descriptionHi}
                </p>

                {/* Specific Hands-on Activities */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#0C1B2A] uppercase tracking-wider">
                    Core Curricular Activities & Programs:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(lang === 'en' ? pillar.keyActivitiesEn : pillar.keyActivitiesHi).map((act, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#E59A1E] shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: DAC and Topics Synergy (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0C1B2A] to-[#162E4A] text-white rounded-2xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-[#F3A628] uppercase tracking-wider">
                    Daily Discipline Synergy
                  </span>
                  <span className="text-[11px] text-slate-300">DAC Linkage</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  How this dimension is practiced every single day through the 14-habit Daily Activity Card:
                </p>

                <div className="space-y-2">
                  {DAC_14_TASKS.filter((t) => {
                    if (pillar.id === 'spiritual') return t.category === 'Spiritual';
                    if (pillar.id === 'financial') return t.category === 'Intellectual';
                    if (pillar.id === 'physical') return t.category === 'Physical';
                    return t.category === 'Conduct & Service';
                  })
                    .slice(0, 3)
                    .map((task) => (
                      <div
                        key={task.number}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-200">
                          #{task.number} {task.taskEn}
                        </span>
                        <span className="text-[11px] text-[#F3A628]">{task.noteTargetEn}</span>
                      </div>
                    ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={onOpenRegister}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] transition-all text-center"
                  >
                    Enroll in this Dimension
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Practical Lab Topics Grid Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0C1B2A] font-display">
              Real Topics Currently Taught
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct practical classes delivered by experienced professionals and industry mentors:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPICS_WE_TEACH.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E59A1E]/15 text-[#B8780E]">
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#0C1B2A] font-display">
                    {t.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    {t.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Band */}
      <CTASection lang={lang} onOpenRegister={onOpenRegister} />
    </div>
  );
};
