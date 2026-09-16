import React from 'react';
import { SITE_CONFIG } from '../../data/siteConfig';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/i18n';
import { useCMS } from '../../services/cmsStore';
import { Users, GraduationCap, Calendar, Sparkles, TrendingUp } from 'lucide-react';

interface LiveMetricsProps {
  lang: Language;
}

export const LiveMetrics: React.FC<LiveMetricsProps> = ({ lang }) => {
  const { settings } = useCMS();
  const t = TRANSLATIONS[lang];
  const count = settings.activeTraineesCount || SITE_CONFIG.currentTraineesCount;

  return (
    <section className="py-12 bg-[#0C1B2A] text-white border-y border-[#E59A1E]/30 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E59A1E]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Highlighted Primary Metric Banner */}
          <div className="w-full lg:w-7/12 bg-gradient-to-r from-[#112438] to-[#162E4A] border-2 border-[#E59A1E]/50 rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 shadow-xl">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#E59A1E]/20 border border-[#E59A1E] flex items-center justify-center shrink-0 text-[#F3A628]">
              <Users className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E59A1E]/20 text-[#F3A628] text-[11px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#E59A1E] animate-pulse" />
                <span>Live Active Cohort</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#FAF8F5] tracking-tight font-display">
                {count}{' '}
                <span className="text-xl sm:text-2xl font-sans font-normal text-slate-300">
                  {lang === 'en' ? 'members currently' : 'सदस्य वर्तमान में'}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#F3A628]">
                {lang === 'en' ? 'undergoing intensive training' : 'गहन प्रशिक्षण प्राप्त कर रहे हैं'}
              </p>
              <p className="text-xs text-slate-400 max-w-md pt-0.5">
                {t.activeTraineesSub}
              </p>
            </div>
          </div>

          {/* Secondary Verified Stats */}
          <div className="w-full lg:w-5/12 grid grid-cols-2 gap-3 sm:gap-4">
            {/* Programmes Run */}
            <div className="bg-[#081320] border border-white/10 hover:border-[#E59A1E]/40 rounded-2xl p-3.5 sm:p-5 text-center transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-[#E59A1E]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] font-display">
                {SITE_CONFIG.programsCount}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                {t.programsCountLabel}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Banking, GST, AI, Yoga & Tracks
              </div>
            </div>

            {/* Events Held */}
            <div className="bg-[#081320] border border-white/10 hover:border-[#E59A1E]/40 rounded-2xl p-3.5 sm:p-5 text-center transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-[#E59A1E]">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] font-display">
                {SITE_CONFIG.eventsCount}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-1">
                {t.eventsHeldLabel}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Chickpet Temple & Bangalore Assemblies
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
