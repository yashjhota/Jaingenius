import React, { useState } from 'react';
import { DAC_14_TASKS } from '../../data/dacTasks';
import { SITE_CONFIG } from '../../data/siteConfig';
import { Language, PageId } from '../../types';
import { Sparkles, Calendar, CheckSquare, ExternalLink, ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';

interface DacSectionProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const DacSection: React.FC<DacSectionProps> = ({
  lang,
  onNavigate,
  onOpenRegister,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Spiritual', 'Physical', 'Intellectual', 'Conduct & Service'];

  const filteredTasks = selectedCategory === 'All'
    ? DAC_14_TASKS
    : DAC_14_TASKS.filter((t) => t.category === selectedCategory);

  return (
    <section id="daily-activity-card" className="py-20 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 text-[#B8780E] text-xs font-bold uppercase tracking-widest mb-3">
            <CheckSquare className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>Refine to Superfine System</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0C1B2A] tracking-tight font-display">
            Daily Activity Card (DAC)
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every member is entrusted with a Daily Activity Card: 14 non-negotiable daily habits
            tracked every day of the month (days 1–31). It builds unshakable self-discipline across
            spiritual practice, health, continuous learning, and mindful conduct.
          </p>
        </div>

        {/* Philosophy Intro & Timing Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Rule 01: Dawn Regimen
              </span>
              <h4 className="text-base font-bold text-[#0C1B2A] font-display mt-0.5">
                Target 5:45 AM Awakening
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Early rising followed by Yoga, self-defense, Pooja Darshan, and sacred Chaityavandan.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-700 flex items-center justify-center shrink-0">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Rule 14: Night Regimen
              </span>
              <h4 className="text-base font-bold text-[#0C1B2A] font-display mt-0.5">
                Restful Sleep by 10:30 PM
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Evening Aarti, daily Sukruth reflection, zero negative phone use, and regenerative rest.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0C1B2A] to-[#162E4A] border border-[#E59A1E]/40 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#F3A628] uppercase tracking-wider block">
                Online Task Tracking
              </span>
              <h4 className="text-base font-bold text-[#FAF8F5] font-display mt-0.5">
                Mirrored in Member Portal
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Registered members log in daily to record habit completion, audited by our team.
              </p>
            </div>
            <a
              href={SITE_CONFIG.memberPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F3A628] hover:underline pt-3"
            >
              <span>Launch Deployed Tracker (jaingeniusorg.lovable.app)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#0C1B2A] text-white border-[#E59A1E] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 14 Tasks Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.number}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:border-[#E59A1E]/60 transition-colors flex items-start gap-3.5"
            >
              <span className="w-8 h-8 rounded-xl bg-[#0C1B2A] text-[#F3A628] font-bold text-xs flex items-center justify-center shrink-0">
                {task.number < 10 ? `0${task.number}` : task.number}
              </span>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {task.category}
                </span>
                <h4 className="text-sm font-bold text-[#0C1B2A] font-display mt-0.5 truncate">
                  {lang === 'en' ? task.taskEn : task.taskHi}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  {lang === 'en' ? task.noteTargetEn : task.noteTargetHi}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-[#0C1B2A] font-display">
              Ready to experience "Refine to Superfine"?
            </h4>
            <p className="text-xs text-slate-600">
              Join the movement and receive your physical printed monthly tracker card & online portal credentials.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3 rounded-xl text-xs font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] shadow-sm transition-all"
            >
              Become a Member (Deposit: {SITE_CONFIG.membershipDeposit})
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
