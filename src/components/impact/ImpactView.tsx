import React from 'react';
import { useCMS } from '../../services/cmsStore';
import { SITE_CONFIG } from '../../data/siteConfig';
import { Language, PageId } from '../../types';
import { TRANSLATIONS } from '../../data/i18n';
import { CTASection } from '../layout/CTASection';
import { Sparkles, Users, Award, Download, Clock, Settings, Quote, CheckCircle2 } from 'lucide-react';

interface ImpactViewProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ lang, onNavigate, onOpenRegister }) => {
  const { testimonials } = useCMS();
  const t = TRANSLATIONS[lang];

  return (
    <div className="bg-[#FAF8F5] text-[#0C1B2A] min-h-screen">
      {/* Header */}
      <section className="bg-[#0C1B2A] text-white py-20 border-b border-[#E59A1E]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628] text-xs font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>Verifiable Transformation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FAF8F5] tracking-tight font-display">
            Impact & Member Journeys
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Measuring the tangible transformation of Jain youth across spiritual grounding,
            disciplined daily routines, and professional workforce readiness.
          </p>
        </div>
      </section>

      {/* Real Verified Core Impact Stat Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0C1B2A] text-white border-2 border-[#E59A1E]/50 rounded-3xl p-8 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F3A628] uppercase tracking-wider">
                Live Cohort
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#FAF8F5] font-display">
              {SITE_CONFIG.currentTraineesCount}
            </div>
            <h4 className="text-base font-bold text-white">Active Members in Training</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Currently undergoing the intensive 60-session industry tracks and rigorous daily habit reporting.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Discipline Engine
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#0C1B2A] font-display">
              14 Habits
            </div>
            <h4 className="text-base font-bold text-[#0C1B2A]">Daily Activity Card (DAC)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Target 5:45 AM awakening, yoga, pooja, svadhyaya, zero negative speech, and evening reflections tracked daily.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Annual Documentation
              </span>
              <h4 className="text-lg font-bold text-[#0C1B2A] font-display mt-2">
                Audited Annual Impact Report
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Comprehensive breakdown of attendance metrics, skill benchmarks, and placement outcomes.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Edition: 2026</span>
              <button
                onClick={() => alert('The inaugural 2026 Jain Genius Annual Impact Report is in compilation. Registered members will receive an advance copy.')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Honest, Tasteful Testimonial Slots Section (No Fake Identities) */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#B8780E] uppercase tracking-wider block">
              Student Perspectives
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0C1B2A] font-display">
              Member Voices & First Cohort
            </h3>
            {/* Specified Tasteful Notice from Prompt Section 19 */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold">Student Stories Coming Soon</span> — The first batch of 24 Jain Genius members is currently undergoing intensive training. Their verified transformations, testimonials, and placement records will be published here upon cohort graduation.
              </div>
              <button
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300/80 text-amber-950 text-xs font-bold shrink-0 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Admin Edit</span>
              </button>
            </div>
          </div>

          {/* Structured Slots for 3 Boys & 2 Girls from Prompt */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((slot) => {
              const publicName = slot.studentName || slot.name || 'Student';
              const publicQuote = slot.experienceText || slot.quote || '';
              const isPublished = slot.status === 'ready' && publicName && publicQuote;

              if (isPublished) {
                return (
                  <div
                    key={slot.slotId}
                    className="p-6 rounded-3xl bg-white border-2 border-[#E59A1E]/40 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Member
                        </span>
                        <span className="text-[11px] text-[#B8780E] font-semibold">
                          {slot.yearOrCohort || slot.cohort || 'Cohort 01'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {slot.avatarUrl ? (
                          <img
                            src={slot.avatarUrl}
                            alt={publicName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-[#E59A1E]/30"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#0C1B2A] text-[#FAF8F5] font-bold text-sm flex items-center justify-center border border-[#E59A1E]/50">
                            {publicName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-[#0C1B2A] font-display">
                            {publicName}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {slot.trackOrProgramme || (slot.gender === 'boy' ? 'Boy Candidate' : 'Girl Candidate')}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <Quote className="w-5 h-5 text-amber-300 absolute -top-1 -left-1 opacity-40" />
                        <p className="text-xs text-slate-700 italic leading-relaxed pl-4">
                          "{publicQuote}"
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Bangalore Assembly</span>
                      <span className="text-[#B8780E] font-semibold">Jain Genius</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={slot.slotId}
                  className="p-6 rounded-3xl bg-slate-50 border border-dashed border-slate-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 uppercase tracking-wide">
                        {slot.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        In Training
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-800 font-display">
                      Slot #{slot.slotId} • {slot.gender === 'boy' ? 'Boy Candidate' : 'Girl Candidate'}
                    </h4>

                    <p className="text-xs text-slate-500 italic leading-relaxed">
                      {publicQuote || '[Verified journey and experience write-up will be published upon completion of the 60-session industry track]'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Track: {slot.trackOrProgramme || '60-Session Master'}</span>
                    <span className="text-[#E59A1E] font-semibold">Cohort 01</span>
                  </div>
                </div>
              );
            })}

            {/* Mentor & Coordinator Slot */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0C1B2A] to-[#112438] text-white border border-[#E59A1E]/40 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E59A1E] text-[#0C1B2A] uppercase tracking-wide">
                  Coordination Note
                </span>
                <h4 className="text-base font-bold text-[#FAF8F5] font-display">
                  Gaurav — Admissions Lead
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Watching youth build disciplined routines and develop practical career skills shows the value of a structured learning environment."
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-[#F3A628]">
                Enquiries: {SITE_CONFIG.contact.phoneDisplay}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Band */}
      <CTASection lang={lang} onOpenRegister={onOpenRegister} />
    </div>
  );
};
