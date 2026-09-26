import React, { useState, useEffect } from 'react';
import { PageId, Language, SocialPost, EventItem, GalleryItem } from './types';
import { useCMS } from './services/cmsStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CTASection } from './components/layout/CTASection';
import { RegistrationModal } from './components/forms/RegistrationModal';

// Home Section Components
import { Hero } from './components/home/Hero';
import { LiveMetrics } from './components/home/LiveMetrics';
import { PillarsSection } from './components/home/PillarsSection';
import { TopicsCarousel } from './components/home/TopicsCarousel';
import { JourneySection } from './components/home/JourneySection';
import { DacSection } from './components/home/DacSection';
import { SocialFeedSection } from './components/home/SocialFeedSection';

// Page Views
import { AboutView } from './components/about/AboutView';
import { WhatWeDoView } from './components/what-we-do/WhatWeDoView';
import { ProgrammesView } from './components/programmes/ProgrammesView';
import { EventsView } from './components/events/EventsView';
import { GalleryView } from './components/gallery/GalleryView';
import { ImpactView } from './components/impact/ImpactView';
import { MembershipView } from './components/membership/MembershipView';
import { NewsView } from './components/news/NewsView';
import { ContactView } from './components/contact/ContactView';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Admin Live Customization Overlays
import { AdminLiveBar } from './components/admin/AdminLiveBar';
import { InPageSectionEditorModal, QuickEditorSection } from './components/admin/InPageSectionEditorModal';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [lang, setLang] = useState<Language>('en');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedTrackForRegister, setSelectedTrackForRegister] = useState<string>('');

  const { isAuthenticated, isLiveEditMode } = useCMS();

  // In-page quick section editor state
  const [quickEditorSection, setQuickEditorSection] = useState<QuickEditorSection | null>(null);
  const [quickEditorItem, setQuickEditorItem] = useState<any>(null);

  // Global toast feedback system
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4500);
  };

  // Handle URL hash navigation if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'home',
        'about',
        'what-we-do',
        'programmes',
        'events',
        'gallery',
        'impact',
        'membership',
        'news',
        'contact',
        'admin',
      ];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleOpenRegister = (trackTitle?: string) => {
    if (trackTitle) {
      setSelectedTrackForRegister(trackTitle);
    }
    setIsRegisterOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FAF8F5] text-[#0C1B2A] font-sans antialiased selection:bg-[#E59A1E] selection:text-[#0C1B2A] ${
        isAuthenticated ? 'pt-10' : ''
      }`}
    >
      {/* Floating Admin Dock & Live Bar */}
      <AdminLiveBar
        onNavigate={handleNavigate}
        onOpenQuickEditor={(sec) => {
          setQuickEditorItem(null);
          setQuickEditorSection(sec as QuickEditorSection);
        }}
        onShowToast={showToast}
      />

      {/* Persistent Sticky Top Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenRegister={() => handleOpenRegister()}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero
              lang={lang}
              onNavigate={handleNavigate}
              onOpenRegister={() => handleOpenRegister()}
              onOpenQuickEdit={() => {
                setQuickEditorItem(null);
                setQuickEditorSection('hero');
              }}
            />

            <LiveMetrics lang={lang} />

            <PillarsSection
              lang={lang}
              onNavigate={handleNavigate}
            />

            <TopicsCarousel lang={lang} />

            <JourneySection
              lang={lang}
              onNavigate={handleNavigate}
              onOpenRegister={() => handleOpenRegister()}
            />

            <DacSection
              lang={lang}
              onNavigate={handleNavigate}
              onOpenRegister={() => handleOpenRegister()}
            />

            <SocialFeedSection
              lang={lang}
              onNavigate={handleNavigate}
              onOpenAddPost={() => {
                setQuickEditorItem(null);
                setQuickEditorSection('add_social_post');
              }}
              onOpenEditPost={(post: SocialPost) => {
                setQuickEditorItem(post);
                setQuickEditorSection('edit_social_post');
              }}
              onOpenEditSocials={() => {
                setQuickEditorItem(null);
                setQuickEditorSection('socials');
              }}
              onShowToast={showToast}
            />

            <CTASection
              lang={lang}
              onOpenRegister={() => handleOpenRegister()}
            />
          </>
        )}

        {currentPage === 'about' && (
          <AboutView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={() => handleOpenRegister()}
          />
        )}

        {currentPage === 'what-we-do' && (
          <WhatWeDoView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={() => handleOpenRegister()}
          />
        )}

        {currentPage === 'programmes' && (
          <ProgrammesView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={(track) => handleOpenRegister(track)}
          />
        )}

        {currentPage === 'events' && (
          <EventsView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={(evTitle) => handleOpenRegister(evTitle)}
            onOpenAddEvent={() => {
              setQuickEditorItem(null);
              setQuickEditorSection('add_event');
            }}
            onOpenEditEvent={(ev: EventItem) => {
              setQuickEditorItem(ev);
              setQuickEditorSection('edit_event');
            }}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={() => handleOpenRegister()}
            onOpenAddGallery={() => {
              setQuickEditorItem(null);
              setQuickEditorSection('add_gallery');
            }}
            onOpenEditGallery={(item: GalleryItem) => {
              setQuickEditorItem(item);
              setQuickEditorSection('edit_gallery');
            }}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'impact' && (
          <ImpactView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={() => handleOpenRegister()}
          />
        )}

        {currentPage === 'membership' && (
          <MembershipView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={() => handleOpenRegister()}
          />
        )}

        {currentPage === 'news' && (
          <NewsView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={() => handleOpenRegister()}
          />
        )}

        {currentPage === 'contact' && (
          <ContactView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={() => handleOpenRegister()}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            onNavigate={handleNavigate}
            lang={lang}
          />
        )}
      </main>

      {/* Structured Organization Footer */}
      <Footer
        onNavigate={handleNavigate}
        lang={lang}
        onOpenRegister={() => handleOpenRegister()}
        onOpenQuickEdit={() => {
          setQuickEditorItem(null);
          setQuickEditorSection('footer');
        }}
      />

      {/* Branded Google Forms Wrapper Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        lang={lang}
        defaultTrack={selectedTrackForRegister}
      />

      {/* In-Page Live Section Editor Modal */}
      <InPageSectionEditorModal
        section={quickEditorSection}
        targetItem={quickEditorItem}
        onClose={() => {
          setQuickEditorSection(null);
          setQuickEditorItem(null);
        }}
        onShowToast={showToast}
      />

      {/* Interactive Global Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0C1B2A] text-white border border-[#E59A1E]/50 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#F3A628] shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
