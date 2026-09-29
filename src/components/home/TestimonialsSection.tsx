import React from 'react';
import { Language, PageId } from '../../types';
import { useCMS } from '../../services/cmsStore';
import {
  Quote,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Settings,
  UserCheck,
} from 'lucide-react';

interface TestimonialsSectionProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  lang,
  onNavigate,
  onOpenRegister,
}) => {
  const { testimonials, isAuthenticated, isLiveEditMode } = useCMS();

  const activeTestimonials = testimonials.filter((t) => !t.isDeleted);
  const readyTestimonials = activeTestimonials.filter(
    (t) =>
      t.status === 'ready' &&
      Boolean((t.studentName || t.name)?.trim()) &&
      Boolean((t.experienceText || t.quote)?.trim())
  );
  const inTrainingSlots = activeTestimonials.filter((t) => t.status !== 'ready');

  // Display all ready testimonials first, followed by pending slots up to 6 total items
  const displayItems = [...readyTestimonials, ...inTrainingSlots].slice(0, 6);

  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] border-y border-amber-200/50 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200/80">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#E59A1E]" />
              <span>{lang === 'hi' ? 'छात्र अनुभव व परिवर्तन' : 'Verified Member Voices'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0C1B2A] font-display tracking-tight leading-tight">
              {lang === 'hi' ? 'जैन जीनियस प्रशिक्षुओं के वास्तविक अनुभव' : 'Real Transformations from Cohort 01 Trainees'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {lang === 'hi'
                ? 'जानिए कैसे 60-सत्रों के उद्योग-उन्मुख पाठ्यक्रम ने हमारे युवाओं में आत्मविश्वास और नेतृत्व क्षमता का संचार किया।'
                : 'Direct reflections from our youth members undergoing the 60-session industry training track and daily spiritual discipline.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated && (
              <button
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                title="Manage student stories in admin"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Manage Stories</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('impact')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C1B2A] hover:bg-[#152e47] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>{lang === 'hi' ? 'सभी प्रभाव देखें' : 'View Full Impact Page'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F5B738]" />
            </button>
          </div>
        </div>

        {/* Live Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((slot) => {
            const publicName = (slot.studentName || slot.name || 'Student').trim();
            const publicQuote = (slot.experienceText || slot.quote || '').trim();
            const isReady = slot.status === 'ready' && !!publicName && !!publicQuote;

            if (isReady) {
              return (
                <div
                  key={slot.slotId}
                  className="group relative p-7 rounded-3xl bg-white border-2 border-amber-300/60 hover:border-[#E59A1E] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified Trainee</span>
                      </span>
                      <span className="text-[11px] font-semibold text-[#B8780E]">
                        {slot.cohort || slot.yearOrCohort || 'Cohort 01'}
                      </span>
                    </div>

                    {/* Member Profile */}
                    <div className="flex items-center gap-3.5 pt-1">
                      {slot.avatarUrl ? (
                        <img
                          src={slot.avatarUrl}
                          alt={publicName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#E59A1E]/40 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0C1B2A] to-[#1a3854] text-amber-300 font-extrabold text-base flex items-center justify-center border-2 border-[#E59A1E]/50 shadow-inner group-hover:scale-105 transition-transform">
                          {publicName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-[#0C1B2A] font-display group-hover:text-[#B8780E] transition-colors">
                          {publicName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {slot.trackOrProgramme || (slot.gender === 'girl' ? 'Girl Candidate' : 'Boy Candidate')}
                        </p>
                      </div>
                    </div>

                    {/* Testimonial Quote */}
                    <div className="relative pt-2">
                      <Quote className="w-6 h-6 text-amber-400/30 absolute -top-1 -left-1" />
                      <p className="text-sm text-slate-700 italic leading-relaxed pl-5 sm:line-clamp-6">
                        "{publicQuote}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-[#E59A1E]" />
                      <span>Bangalore Assembly</span>
                    </span>
                    <span className="font-semibold text-[#B8780E]">Jain Genius</span>
                  </div>
                </div>
              );
            }

            // In Training / Reserved Slot
            return (
              <div
                key={slot.slotId}
                className="p-7 rounded-3xl bg-slate-50/80 border border-dashed border-slate-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                      {slot.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      In Training
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-700 font-display">
                      Slot #{slot.slotId} • {slot.gender === 'girl' ? 'Girl Candidate' : 'Boy Candidate'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Track: {slot.trackOrProgramme || '60-Session Master'}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 italic leading-relaxed">
                    [Verified journey write-up is in compilation and will be published upon cohort milestone completion]
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Bangalore Cohort</span>
                  <span className="font-semibold text-amber-700">Cohort 01</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="p-6 rounded-3xl bg-[#0C1B2A] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#E59A1E]/30 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold font-display text-white">
              {lang === 'hi' ? 'क्या आप अगले बैच में शामिल होना चाहते हैं?' : 'Ready to Start Your Transformation in Cohort 02?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === 'hi'
                ? 'सीमित 24 स्थान। केवल 15–30 आयु वर्ग के युवाओं के लिए।'
                : 'Limited to 24 dedicated young change-makers (Age 15–30) per cohort.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                {lang === 'hi' ? 'अभी आवेदन करें' : 'Apply for Next Cohort'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
