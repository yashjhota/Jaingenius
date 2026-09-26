import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';
import { PageId, Language } from '../../types';
import { NAV_ITEMS, SITE_CONFIG } from '../../data/siteConfig';
import { TRANSLATIONS } from '../../data/i18n';
import { useCMS } from '../../services/cmsStore';
import { Menu, X, ExternalLink, Globe, Phone, UserCheck, Sparkles, ShieldCheck, Lock } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  lang,
  onToggleLang,
  onOpenRegister,
}) => {
  const { settings, isAuthenticated } = useCMS();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Banner with Helpline & Member Notice */}
      <div className="bg-[#081320] text-slate-300 text-xs py-1.5 px-4 border-b border-[#E59A1E]/20 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#E59A1E] animate-pulse" />
            <span className="font-medium text-[#FAF8F5]">
              {settings.bannerText || (lang === 'en'
                ? 'Flagship Youth Initiative (Age 15–30)'
                : 'युवाओं का समग्र विकास उपक्रम (आयु १५–३० वर्ष)')}
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              {settings.initiativeOf || SITE_CONFIG.initiativeOf}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`tel:${settings.phone || SITE_CONFIG.contact.phone}`}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#F3A628] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#E59A1E]" />
              <span>Enquiry: {settings.phoneDisplay || SITE_CONFIG.contact.phoneDisplay}</span>
            </a>
            <a
              href={settings.memberPortalUrl || SITE_CONFIG.memberPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-[#F3A628] hover:underline font-semibold"
            >
              <span>{t.openMemberPortal}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0C1B2A]/95 backdrop-blur-md shadow-md border-b border-[#E59A1E]/25 py-2.5'
            : 'bg-[#0C1B2A] py-3.5 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2A922] rounded-full transition-transform hover:scale-105 shrink-0"
            aria-label="Jain Genius Home"
          >
            <Logo size="md" />
            <div className="flex flex-col">
              <span className="font-bold text-[#FAF8F5] text-sm sm:text-base font-display leading-tight tracking-wide">
                Jain Genius
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#FAF8F5]/85 font-semibold tracking-wider uppercase hidden min-[380px]:block">
                <span className="text-[#F2A922] mr-0.5 sm:mr-1">—</span>The Change Makers<span className="text-[#F2A922] ml-0.5 sm:ml-1">—</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as PageId)}
                  className={`px-2.5 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                    isActive
                      ? 'text-[#F3A628] bg-white/10 shadow-sm font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang === 'en' ? item.labelEn : item.labelHi}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions & CTA */}
          <div className="hidden xl:flex items-center gap-2">
            {/* Admin Portal button */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPage === 'admin'
                  ? 'text-[#F3A628] bg-white/15 border border-[#E59A1E]'
                  : 'text-slate-300 hover:text-white border border-white/10 hover:border-white/25 bg-white/5'
              }`}
              title="Admin CMS Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#E59A1E]" />
              <span className="hidden xl:inline">Admin</span>
              {isAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Admin Active" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-300 hover:text-white border border-white/20 hover:border-[#E59A1E]/50 transition-colors"
              title="Switch Language (English / हिंदी)"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-[#E59A1E]" />
              <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>

            {/* Member Login CTA - Redirects to Lovable app */}
            <a
              href={SITE_CONFIG.memberPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#FAF8F5] bg-[#162B42] hover:bg-[#1E3958] border border-[#E59A1E]/40 hover:border-[#E59A1E] transition-all shadow-sm"
              title="Open the deployed Member Portal for task tracking"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#F3A628]" />
              <span>{t.memberLogin}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Primary Become a Member CTA */}
            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0C1B2A]" />
              <span>{t.becomeMember}</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2">
            {/* Quick Lang Switch on mobile */}
            <button
              onClick={onToggleLang}
              className="px-2 py-1 rounded text-xs font-bold text-[#F3A628] border border-white/20 hover:bg-white/5 transition-colors"
              aria-label="Toggle Language"
            >
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>

            {/* Member Portal button on mobile */}
            <a
              href={SITE_CONFIG.memberPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex px-2.5 py-1 rounded text-xs font-semibold text-white bg-[#162B42] hover:bg-[#1E3958] border border-[#E59A1E]/40 items-center gap-1 transition-colors"
              title="Member Login"
            >
              <span>Login</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#F3A628]" />
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-md text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E59A1E]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#0C1B2A]/98 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        >
          {/* Top Bar inside Drawer */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div className="flex flex-col">
                <span className="font-bold text-[#FAF8F5] text-base font-display leading-tight tracking-wide">
                  Jain Genius
                </span>
                <span className="text-[10px] text-[#FAF8F5]/85 font-semibold tracking-wider uppercase">
                  <span className="text-[#F2A922] mr-1">—</span>The Change Makers<span className="text-[#F2A922] ml-1">—</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-white/5"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links List */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as PageId)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E59A1E]/20 to-transparent text-[#F3A628] border-l-4 border-[#E59A1E]'
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span>{lang === 'en' ? item.labelEn : item.labelHi}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#F3A628]" />}
                </button>
              );
            })}

            {/* Admin Portal Drawer Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-semibold flex items-center justify-between transition-colors ${
                currentPage === 'admin'
                  ? 'bg-gradient-to-r from-[#E59A1E]/20 to-transparent text-[#F3A628] border-l-4 border-[#E59A1E]'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E59A1E]" />
                <span>Admin Portal</span>
              </span>
              {isAuthenticated ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase">
                  Unlocked
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Bottom Actions inside Drawer */}
          <div className="p-5 border-t border-white/10 bg-[#081320] space-y-3">
            {/* Primary CTA */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-3 px-4 rounded-xl text-center text-sm font-bold text-[#0C1B2A] bg-gradient-to-r from-[#F5B738] to-[#E59A1E] shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#0C1B2A]" />
              <span>{t.becomeMember}</span>
            </button>

            {/* Member Login Direct link */}
            <a
              href={settings.memberPortalUrl || SITE_CONFIG.memberPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-white bg-[#162B42] border border-[#E59A1E]/50 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#F3A628] shrink-0" />
              <span className="truncate">{t.memberLogin}</span>
              <span className="text-xs text-[#F3A628] font-mono hidden min-[360px]:inline">(Task Tracker)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </a>

            {/* Helpline info */}
            <div className="pt-2 text-center text-xs text-slate-400">
              <span>{t.registrationHelpline}: </span>
              <a
                href={`tel:${settings.phone || SITE_CONFIG.contact.phone}`}
                className="text-[#F3A628] font-semibold underline"
              >
                {settings.phoneDisplay || SITE_CONFIG.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
