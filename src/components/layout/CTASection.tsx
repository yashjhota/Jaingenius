import React from 'react';
import { Language } from '../../types';
import { SITE_CONFIG } from '../../data/siteConfig';
import { TRANSLATIONS } from '../../data/i18n';
import { Phone, MessageCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface CTASectionProps {
  lang: Language;
  onOpenRegister: () => void;
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  lang,
  onOpenRegister,
  className = '',
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0C1B2A] via-[#112438] to-[#0A1624] border-2 border-[#E59A1E]/40 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
          {/* Subtle gold decorative background accents */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#E59A1E]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-[#F5B738]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Refine to Superfine • Age 15–30</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight font-display">
                {t.wantToUpgrade}
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {t.wantToUpgradeSub}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#E59A1E]" />
                  <span>Membership Deposit: {SITE_CONFIG.membershipDeposit}</span>
                </div>
                <span>•</span>
                <span>{SITE_CONFIG.currentTraineesCount} Members Undergoing Active Training</span>
              </div>
            </div>

            {/* Right Action Stack */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={onOpenRegister}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] via-[#E59A1E] to-[#F3A628] hover:from-[#FBC658] hover:to-[#F5B738] transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t.joinNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={`tel:${SITE_CONFIG.contact.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-xs font-semibold text-[#FAF8F5] transition-colors"
                  title="Call Gaurav"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F3A628]" />
                  <span>Call {SITE_CONFIG.contact.name}</span>
                </a>

                <a
                  href={SITE_CONFIG.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-xs font-semibold text-[#FAF8F5] transition-colors"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
