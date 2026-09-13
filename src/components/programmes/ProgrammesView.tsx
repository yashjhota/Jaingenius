import React, { useState } from 'react';
import { PROGRAMMES_DATA } from '../../data/programmes';
import { CAREER_TRACKS_DATA, COMMON_TRACK_STRUCTURE } from '../../data/careerTracks';
import { CareerTrack, Programme, Language, PageId } from '../../types';
import { CTASection } from '../layout/CTASection';
import { Sparkles, Briefcase, ChevronRight, CheckCircle2, Clock, Users, ArrowRight, X, Compass, Layers, Award } from 'lucide-react';

interface ProgrammesViewProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister: (trackTitle?: string) => void;
}

export const ProgrammesView: React.FC<ProgrammesViewProps> = ({
  lang,
  onNavigate,
  onOpenRegister,
}) => {
  const [activeTab, setActiveTab] = useState<'tracks' | 'all'>('tracks');
  const [selectedTrack, setSelectedTrack] = useState<CareerTrack | null>(null);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

  return (
    <div className="bg-[#FAF8F5] text-[#0C1B2A] min-h-screen">
      {/* Header */}
      <section className="bg-[#0C1B2A] text-white py-20 border-b border-[#E59A1E]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628] text-xs font-bold uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>Career Acceleration & Upskilling</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FAF8F5] tracking-tight font-display">
            Programmes & Career Tracks
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Rigorous 60-session industry tracks engineered to take young aspirants from zero baseline
            to verified placement readiness across 8 in-demand professional domains.
          </p>
        </div>
      </section>

      {/* Navigation Tabs (8 Career Tracks vs All Holistic Programmes) */}
      <section className="py-6 bg-white border-b border-slate-200 sticky top-[72px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'tracks'
                  ? 'bg-[#0C1B2A] text-white border-[#E59A1E]'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              8 Specialization Career Tracks
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'all'
                  ? 'bg-[#0C1B2A] text-white border-[#E59A1E]'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              All Holistic & Spiritual Programmes
            </button>
          </div>

          <div className="text-xs text-[#B8780E] font-bold hidden md:block">
            Refundable Deposit: ₹1,000 Total
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'tracks' ? (
          <div className="space-y-12">
            {/* 60-Session Master Architecture Explainer Banner */}
            <div className="p-8 rounded-3xl bg-white border-2 border-[#E59A1E]/40 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#B8780E] uppercase tracking-wider block">
                    Structured 60-Session Curriculum
                  </span>
                  <h3 className="text-2xl font-bold text-[#0C1B2A] font-display mt-1">
                    Universal 3-Phase Progression Across Every Track
                  </h3>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                  Total Investment: ₹1,000 Security Deposit
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0C1B2A]">Phase 1: Foundation</span>
                    <span className="text-[11px] font-bold text-[#E59A1E] px-2 py-0.5 rounded bg-[#E59A1E]/10">10 Sessions</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    AI tools for daily productivity, business email drafting, and core computer office applications (Word, Excel, PPT, Canva).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0C1B2A]">Phase 2: Domain Skills</span>
                    <span className="text-[11px] font-bold text-[#E59A1E] px-2 py-0.5 rounded bg-[#E59A1E]/10">40 Sessions</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Intensive hands-on technical labs with live assignments, software modules, commercial data entries, and practical exercises.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0C1B2A]">Phase 3: Placement</span>
                    <span className="text-[11px] font-bold text-[#E59A1E] px-2 py-0.5 rounded bg-[#E59A1E]/10">10 Sessions</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Polished resume creation, portfolio review, mock interviews with SWOT analysis, and direct referrals to business partners.
                  </p>
                </div>
              </div>
            </div>

            {/* The 8 Career Tracks Grid */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#0C1B2A] font-display">
                Choose from 8 Specialized Career Tracks
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {CAREER_TRACKS_DATA.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrack(track)}
                    className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#E59A1E] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-7 h-7 rounded-lg bg-[#0C1B2A] text-[#F3A628] font-bold text-xs flex items-center justify-center">
                          0{track.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          60 Sessions
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-[#0C1B2A] font-display group-hover:text-[#B8780E] transition-colors">
                        {track.title}
                      </h4>

                      <div className="mt-3 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Core Modules:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {track.coreSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#B8780E]">
                      <span>View Full Track</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* All Holistic & Spiritual Programmes */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROGRAMMES_DATA.map((prog) => (
              <div
                key={prog.id}
                onClick={() => setSelectedProgramme(prog)}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B8780E]">
                      {prog.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {prog.duration || prog.formatReach}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0C1B2A] font-display">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {prog.whatWasCovered}
                  </p>

                  {prog.outcomes && prog.outcomes.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Key Outcomes:
                      </span>
                      <div className="space-y-1">
                        {prog.outcomes.map((m, i) => (
                          <div key={i} className="text-xs text-slate-700 flex items-start gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">
                    Format: {prog.formatReach}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRegister(prog.title);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#0C1B2A] bg-[#E59A1E] hover:bg-[#F5B738] transition-colors"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Selected Career Track Detail Modal */}
      {selectedTrack && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#081320]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative w-full max-w-3xl bg-[#0C1B2A] border border-[#E59A1E]/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#E59A1E] text-[#0C1B2A] font-bold text-sm flex items-center justify-center">
                  0{selectedTrack.id}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#FAF8F5] font-display">
                    {selectedTrack.title}
                  </h3>
                  <span className="text-xs text-[#E59A1E]">
                    60-Session Master Specialization • Complete Industry Readiness
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrack(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-6 space-y-6 max-h-[68vh] overflow-y-auto">
              {/* Core Specialized Skills */}
              <div>
                <h4 className="text-xs font-bold text-[#F3A628] uppercase tracking-wider mb-2">
                  Specialized Skills (40 Sessions)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTrack.coreSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Foundation Module (10 Sessions) */}
              <div className="p-4 rounded-2xl bg-[#112438] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#E59A1E]">
                  <span>Foundation Training (10 Sessions)</span>
                  <span className="text-slate-400 font-normal">Common to all tracks</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedTrack.foundation.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E59A1E]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interview Preparation (10 Sessions) */}
              <div className="p-4 rounded-2xl bg-[#112438] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#E59A1E]">
                  <span>Interview & Placement Readiness (10 Sessions)</span>
                  <span className="text-slate-400 font-normal">Direct Employer Referrals</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedTrack.interviewPrep.map((ip, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E59A1E]" />
                      <span>{ip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certifications Recommended */}
              <div className="bg-[#081320] p-4 rounded-2xl border border-white/10">
                <span className="text-xs font-bold text-[#F3A628] block mb-2 uppercase tracking-wider">
                  Aligned Industry Certifications:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedTrack.suggestedCertifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#E59A1E]/15 text-[#F3A628] text-xs font-semibold"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Deposit: ₹1,000 includes all 60 sessions & placement guidance.
              </span>

              <button
                onClick={() => {
                  const trackName = selectedTrack.title;
                  setSelectedTrack(null);
                  onOpenRegister(trackName);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] shadow-md transition-all"
              >
                Apply for {selectedTrack.title}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Programme Modal */}
      {selectedProgramme && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#081320]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-xl bg-[#0C1B2A] border border-[#E59A1E]/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-[#FAF8F5] font-display">
                {selectedProgramme.title}
              </h3>
              <button
                onClick={() => setSelectedProgramme(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-xs text-[#E59A1E] font-semibold">
                Category: {selectedProgramme.category} • Format: {selectedProgramme.formatReach}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedProgramme.whatWasCovered}
              </p>

              {selectedProgramme.outcomes && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Learning Outcomes
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedProgramme.outcomes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E59A1E]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => {
                  const progTitle = selectedProgramme.title;
                  setSelectedProgramme(null);
                  onOpenRegister(progTitle);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#E59A1E] text-[#0C1B2A] text-xs font-bold"
              >
                Register for Programme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA Band */}
      <CTASection lang={lang} onOpenRegister={onOpenRegister} />
    </div>
  );
};
