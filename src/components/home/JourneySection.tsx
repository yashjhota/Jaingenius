import React, { useState } from 'react';
import { MEMBER_JOURNEY_STEPS } from '../../data/journey';
import { Language, PageId } from '../../types';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, Compass } from 'lucide-react';

interface JourneySectionProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const JourneySection: React.FC<JourneySectionProps> = ({
  lang,
  onNavigate,
  onOpenRegister,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = MEMBER_JOURNEY_STEPS[activeStepIndex];

  return (
    <section className="py-20 bg-[#FFFFFF] border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 text-[#B8780E] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>End-to-End Progression</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0C1B2A] tracking-tight font-display">
            {lang === 'en' ? 'The Member Development Journey' : 'सदस्य विकास की ६-चरणीय यात्रा'}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {lang === 'en'
              ? 'A proven, structured pathway guiding youth from spiritual reconnection to a certified career track and professional placement.'
              : 'एक प्रामाणिक, सुव्यवस्थित मार्ग जो युवाओं को आध्यात्मिक पुनर्जागरण से लेकर करियर ट्रैक और इंटर्नशिप तक ले जाता है।'}
          </p>
        </div>

        {/* Progressive Visual Timeline (Desktop) */}
        <div className="hidden lg:grid grid-cols-6 gap-3 mb-10 relative">
          {/* Connector Line behind steps */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

          {MEMBER_JOURNEY_STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            const isCompleted = idx < activeStepIndex;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`relative z-10 flex flex-col items-center text-center p-4 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-[#0C1B2A] text-white shadow-lg ring-2 ring-[#E59A1E]'
                    : 'bg-white text-[#0C1B2A] border border-slate-200 hover:border-[#E59A1E]/60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors ${
                    isActive
                      ? 'bg-[#E59A1E] text-[#0C1B2A]'
                      : isCompleted
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/40'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `0${step.step}`}
                </div>

                <span className={`text-xs font-bold leading-snug line-clamp-2 ${isActive ? 'text-[#FAF8F5]' : 'text-[#0C1B2A]'}`}>
                  {step.stage}
                </span>

                <span
                  className={`mt-1 text-[10px] font-semibold uppercase tracking-wider ${
                    isActive ? 'text-[#F3A628]' : 'text-slate-400'
                  }`}
                >
                  {step.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progressive Visual Timeline (Mobile/Tablet Pills) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {MEMBER_JOURNEY_STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  isActive
                    ? 'bg-[#0C1B2A] text-white border-[#E59A1E]'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${isActive ? 'bg-[#E59A1E] text-[#0C1B2A]' : 'bg-slate-200 text-slate-700'}`}>
                  {step.step}
                </span>
                <span>{step.stage}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Canvas */}
        <div className="bg-[#FAF8F5] border-2 border-[#E59A1E]/30 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#E59A1E] text-[#0C1B2A] text-xs font-extrabold uppercase tracking-wide">
                  Step 0{activeStep.step} of 06
                </span>
                <span className="text-xs font-bold text-[#B8780E] uppercase tracking-wider">
                  Phase: {activeStep.badge}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0C1B2A] font-display">
                {lang === 'en' ? activeStep.stage : activeStep.stageHi}
              </h3>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {lang === 'en' ? activeStep.whatHappens : activeStep.whatHappensHi}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E59A1E]" />
                  Verified Mentorship
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E59A1E]" />
                  Tracked in Member Portal
                </span>
              </div>
            </div>

            {/* Stage Quick Actions */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-center lg:text-left">
              <div className="text-xs text-slate-500 font-medium">
                Want to begin your own 6-step development journey?
              </div>

              <button
                onClick={onOpenRegister}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] shadow-sm transition-all"
              >
                Apply for Next Cohort
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="hover:text-[#0C1B2A] disabled:opacity-30"
                >
                  ← Previous Step
                </button>
                <button
                  disabled={activeStepIndex === MEMBER_JOURNEY_STEPS.length - 1}
                  onClick={() =>
                    setActiveStepIndex((prev) => Math.min(MEMBER_JOURNEY_STEPS.length - 1, prev + 1))
                  }
                  className="text-[#E59A1E] font-bold hover:underline disabled:opacity-30 flex items-center gap-1"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
