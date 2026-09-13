import React, { useState, useEffect } from 'react';
import { PageId, Language } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CTASection } from './components/layout/CTASection';
import { RegistrationModal } from './components/forms/RegistrationModal';

// Home Section Components
import { Hero } from './components/home/Hero';
import { LiveMetrics } from './components/home/LiveMetrics';
import { PillarsSection } from './components/home/PillarsSection';
import { TopicsCarousel } from './components/home/TopicsCarousel';
import { PravachanSpotlight } from './components/home/PravachanSpotlight';
import { JourneySection } from './components/home/JourneySection';
import { DacSection } from './components/home/DacSection';

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

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [lang, setLang] = useState<Language>('en');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedTrackForRegister, setSelectedTrackForRegister] = useState<string>('');

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0C1B2A] font-sans antialiased selection:bg-[#E59A1E] selection:text-[#0C1B2A]">
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
            />

            <LiveMetrics lang={lang} />

            <PillarsSection
              lang={lang}
              onNavigate={handleNavigate}
            />

            <TopicsCarousel lang={lang} />

            <PravachanSpotlight lang={lang} />

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
          />
        )}

        {currentPage === 'gallery' && (
          <GalleryView
            lang={lang}
            onNavigate={handleNavigate}
            onOpenRegister={() => handleOpenRegister()}
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
      />

      {/* Branded Google Forms Wrapper Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        lang={lang}
        defaultTrack={selectedTrackForRegister}
      />
    </div>
  );
}
