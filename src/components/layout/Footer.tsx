import React from 'react';
import { Logo } from '../common/Logo';
import { PageId, Language } from '../../types';
import { SITE_CONFIG, NAV_ITEMS } from '../../data/siteConfig';
import { TRANSLATIONS } from '../../data/i18n';
import { Phone, Mail, MessageCircle, ExternalLink, ShieldCheck, HeartHandshake, ArrowUpRight, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  lang: Language;
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, lang, onOpenRegister }) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer id="main-footer" className="bg-[#081320] text-slate-300 pt-16 pb-12 border-t border-[#E59A1E]/30 relative overflow-hidden">
      {/* Subtle background glow element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#E59A1E]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Philosophy (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="cursor-pointer inline-flex items-center gap-3.5 group" onClick={() => onNavigate('home')}>
              <Logo size="lg" />
              <div className="flex flex-col">
                <span className="font-bold text-[#FAF8F5] text-xl font-display group-hover:text-[#F2A922] transition-colors leading-tight tracking-wide">
                  Jain Genius
                </span>
                <span className="text-xs text-[#FAF8F5]/85 font-semibold tracking-wider uppercase">
                  <span className="text-[#F2A922] mr-1.5">—</span>The Change Makers<span className="text-[#F2A922] ml-1.5">—</span>
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md pt-2">
              Jain Genius (The Change Makers) is a Jain community organisation dedicated to the holistic
              development of its registered members — nurturing them spiritually, intellectually,
              professionally, physically and socially, rooted in Jain values.
            </p>

            <div className="bg-[#0C1B2A] border border-[#E59A1E]/30 rounded-xl p-3.5 max-w-md">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#F3A628] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-[#FAF8F5] font-semibold block">Guidance & Lineage</span>
                  <span className="text-slate-400 leading-snug block mt-0.5">
                    An initiative of {SITE_CONFIG.initiativeOf}. Flagship programmes curated specifically for youth (Age 15–30).
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
                External Member Portal
              </div>
              <a
                href={SITE_CONFIG.memberPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#112438] hover:bg-[#18314C] border border-[#E59A1E]/40 text-[#F3A628] text-xs font-semibold transition-all hover:translate-x-0.5"
              >
                <span>Access Live Member Dashboard (Task Tracker)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F3A628] border-b border-white/10 pb-2">
              Website Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id as PageId);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-300 hover:text-[#F3A628] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-500 group-hover:bg-[#F3A628] transition-colors" />
                    <span>{lang === 'en' ? item.labelEn : item.labelHi}</span>
                  </button>
                </li>
              ))}
              <li className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    onNavigate('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#F3A628] hover:text-[#F5B738] transition-colors flex items-center gap-1.5 group text-xs font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E59A1E]" />
                  <span>Admin Portal / CMS Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact & Registration (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F3A628] border-b border-white/10 pb-2">
              Registration & Contact
            </h4>

            <p className="text-xs text-slate-400">
              For new admissions, shivir registrations, and career track counselling:
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#112438] border border-[#E59A1E]/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#F3A628]" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Registration Coordinator</span>
                  <a
                    href={`tel:${SITE_CONFIG.contact.phone}`}
                    className="text-sm font-semibold text-[#FAF8F5] hover:text-[#F3A628] transition-colors"
                  >
                    {SITE_CONFIG.contact.name} — {SITE_CONFIG.contact.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#112438] border border-[#E59A1E]/30 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Instant WhatsApp Support</span>
                  <a
                    href={SITE_CONFIG.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#FAF8F5] hover:text-[#25D366] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#112438] border border-[#E59A1E]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#F3A628]" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{t.officialEmail}</span>
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}`}
                    className="text-sm font-semibold text-[#FAF8F5] hover:text-[#F3A628] transition-colors"
                  >
                    {SITE_CONFIG.contact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenRegister}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] shadow-sm transition-all"
              >
                {t.becomeMember} (Deposit: {SITE_CONFIG.membershipDeposit})
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Note */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} {SITE_CONFIG.name} — {SITE_CONFIG.tagline}. {t.allRightsReserved}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="inline-flex items-center justify-center sm:justify-start gap-1 text-slate-300">
              <span>Designed and Developed with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5 inline-block shrink-0 animate-pulse" />
              <span>by</span>
              <a
                href="https://www.instagram.com/yashjhota"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F3A628] hover:text-[#F5B738] font-semibold underline underline-offset-2 transition-colors ml-0.5 hover:opacity-90"
              >
                jhota
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Guided by values</span>
            <span>•</span>
            <span>Youth Empowerment (15–30)</span>
            <span>•</span>
            <a
              href={SITE_CONFIG.memberPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F3A628] hover:underline"
            >
              Member Portal
            </a>
            <span>•</span>
            <a
              href={SITE_CONFIG.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[#F3A628] transition-colors"
            >
              Google Form
            </a>
            <span>•</span>
            <button
              onClick={() => {
                onNavigate('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#E59A1E] hover:text-[#F3A628] font-semibold flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
