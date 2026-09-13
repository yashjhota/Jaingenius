import React from 'react';
import { Logo } from '../common/Logo';
import { SITE_CONFIG } from '../../data/siteConfig';
import { Language, PageId } from '../../types';
import { TRANSLATIONS } from '../../data/i18n';
import { Sparkles, ArrowRight, UserCheck, ExternalLink, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onNavigate, onOpenRegister }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-[#0C1B2A] text-[#FAF8F5] overflow-hidden">
      {/* Background Architectural Patterns & Subtle Gold Glows */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="jainPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 60 30 L 30 60 L 0 30 Z" fill="none" stroke="#E59A1E" strokeWidth="0.75" />
              <circle cx="30" cy="30" r="3" fill="#E59A1E" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#jainPattern)" />
        </svg>
      </div>

      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#E59A1E]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#162E4A] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission, Typography & Direct Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Spiritual Guidance Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#162E4A] border border-[#E59A1E]/30 text-[#F3A628] text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E59A1E]" />
              <span className="truncate max-w-[320px] sm:max-w-none">
                {t.guidedBy}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#FAF8F5] tracking-tight leading-[1.1] font-display">
                Jain Genius <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5B738] via-[#E59A1E] to-[#F3A628]">
                  The Change Makers
                </span>
              </h1>

              {/* Supporting Mission Message */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                {t.heroMission}
              </p>
            </div>

            {/* Key Value Propositions Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 max-w-xl mx-auto lg:mx-0">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <span className="text-[11px] font-bold text-[#F3A628] block uppercase tracking-wider">
                  Target Age
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">Youth (15–30)</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <span className="text-[11px] font-bold text-[#F3A628] block uppercase tracking-wider">
                  Discipline
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">14-Habit DAC</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                <span className="text-[11px] font-bold text-[#F3A628] block uppercase tracking-wider">
                  Placement
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">8 Career Tracks</span>
              </div>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{t.becomeMember}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onNavigate('what-we-do');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all"
              >
                <span>{t.whatWeDo}</span>
              </button>

              <a
                href={SITE_CONFIG.memberPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-sm font-semibold text-[#F3A628] hover:text-white bg-[#162E4A]/60 hover:bg-[#162E4A] border border-[#E59A1E]/30 transition-all"
                title="Direct link to deployed member application"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t.memberLogin}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Trust and Verification Micro-text */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#E59A1E]" />
              <span>Membership Deposit: {SITE_CONFIG.membershipDeposit} • Guided by Jain Values</span>
            </div>
          </div>

          {/* Right Column: High-Craft Emblem Presentation (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer Radiant Shield Card */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#112438] via-[#0E1F30] to-[#081320] border-2 border-[#E59A1E]/40 p-8 sm:p-10 shadow-2xl overflow-hidden flex flex-col items-center text-center">
                {/* Spiritual Star Accents */}
                <div className="absolute top-4 right-4 text-[#E59A1E]/40">✦</div>
                <div className="absolute bottom-4 left-4 text-[#E59A1E]/40">✦</div>

                {/* Main Authentic Jain Genius Emblem */}
                <div className="py-2 transform transition-transform hover:scale-105 duration-300">
                  <Logo size="xl" />
                </div>

                {/* Cultural Mission Box */}
                <div className="mt-8 pt-6 border-t border-white/10 w-full text-left space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#F3A628]">
                    <span>Initiative Framework</span>
                    <span>Age 15–30</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Dedicated to transforming Jain youth into value-driven change-makers through rigorous
                    spiritual anchors, practical economic competence, physical stamina, and mental clarity.
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E59A1E]" />
                      24 Active Trainees
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E59A1E]" />
                      Daily Ratri Pravachan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
