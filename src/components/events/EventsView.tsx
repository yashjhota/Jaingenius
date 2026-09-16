import React, { useState } from 'react';
import { useCMS } from '../../services/cmsStore';
import { EventItem, Language, PageId } from '../../types';
import { SITE_CONFIG } from '../../data/siteConfig';
import { Calendar, Clock, MapPin, Users, Phone, Sparkles, Filter, QrCode, ArrowRight, X, Settings } from 'lucide-react';

interface EventsViewProps {
  lang: Language;
  onNavigate: (page: PageId) => void;
  onOpenRegister: (eventTitle?: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  lang,
  onNavigate,
  onOpenRegister,
}) => {
  const { events, isAuthenticated } = useCMS();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filteredEvents = events.filter((ev) => {
    if (filter === 'upcoming') return ev.status === 'upcoming';
    if (filter === 'past') return ev.status === 'past';
    return true;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#0C1B2A] min-h-screen">
      {/* Header */}
      <section className="bg-[#0C1B2A] text-white py-20 border-b border-[#E59A1E]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628] text-xs font-bold uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5 text-[#E59A1E]" />
            <span>Community Assemblies</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FAF8F5] tracking-tight font-display">
            Events & Youth Shabhās
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Real youth gatherings addressing life's deepest emotional, philosophical, and national questions.
            Conducted at Pathshala Hall, Chickpet Jain Temple, Bangalore.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-4 sm:py-6 bg-white border-b border-slate-200 sticky top-[60px] sm:top-[72px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none touch-pan-x pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline mr-2">
              Status:
            </span>
            {(['all', 'upcoming', 'past'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border shrink-0 ${
                  filter === mode
                    ? 'bg-[#0C1B2A] text-white border-[#E59A1E]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {mode === 'all' ? 'All Gatherings' : `${mode} Events`}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="text-xs text-slate-500 font-medium hidden md:block">
              Standard Venue: Pathshala Hall, Chickpet Jain Temple
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-[#B8780E] text-xs font-semibold transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Manage</span>
            </button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredEvents.map((ev) => {
            const isUpcoming = ev.status === 'upcoming';
            return (
              <div
                key={ev.id}
                className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Event Poster Card Banner */}
                <div className="bg-gradient-to-br from-[#0C1B2A] via-[#112438] to-[#162E4A] p-6 text-white relative overflow-hidden">
                  {ev.posterImage && (
                    <div className="mb-4 rounded-xl overflow-hidden aspect-video border border-white/15 bg-black/40">
                      <img
                        src={ev.posterImage}
                        alt={ev.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isUpcoming
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {isUpcoming ? 'Upcoming Event' : 'Concluded'}
                    </span>
                    <span className="text-xs font-bold text-[#F3A628] bg-[#E59A1E]/20 px-2.5 py-0.5 rounded-md">
                      {ev.entry}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-[#FAF8F5] leading-snug">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-[#E59A1E] font-medium mt-1">
                    Conducted by {ev.conductor}
                  </p>

                  {/* Date & Time pills */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E59A1E]" />
                      {ev.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#E59A1E]" />
                      {ev.time}
                    </span>
                  </div>
                </div>

                {/* Event Details Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="space-y-2 pt-2 text-xs text-slate-700">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#E59A1E] shrink-0 mt-0.5" />
                        <span className="leading-snug">{ev.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#E59A1E] shrink-0" />
                        <span>Eligible Age Group: {ev.ageGroup}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="text-xs font-bold text-[#0C1B2A] hover:text-[#B8780E] flex items-center gap-1"
                    >
                      <QrCode className="w-4 h-4 text-[#E59A1E]" />
                      <span>View Pass QR</span>
                    </button>

                    <button
                      onClick={() => onOpenRegister(ev.title)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#0C1B2A] bg-[#E59A1E] hover:bg-[#F5B738] transition-colors"
                    >
                      Reserve Seat
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* QR Code & Detail Modal */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#081320]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-md bg-[#0C1B2A] border border-[#E59A1E]/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 text-center space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-[#F3A628] uppercase tracking-wider">
                Event Pass & Verification
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#FAF8F5] font-display">
                {selectedEvent.title}
              </h3>
              <p className="text-xs text-[#E59A1E] mt-0.5">
                {selectedEvent.date} • {selectedEvent.time}
              </p>
            </div>

            {/* Generated SVG QR Code representation */}
            <div className="p-4 bg-white rounded-2xl inline-block mx-auto border-2 border-[#E59A1E]">
              <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="#0C1B2A" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#0C1B2A" />

                <rect x="65" y="10" width="25" height="25" fill="#0C1B2A" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#0C1B2A" />

                <rect x="10" y="65" width="25" height="25" fill="#0C1B2A" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#0C1B2A" />

                <rect x="42" y="12" width="6" height="20" fill="#0C1B2A" />
                <rect x="52" y="24" width="8" height="8" fill="#E59A1E" />
                <rect x="42" y="42" width="16" height="16" fill="#0C1B2A" />
                <rect x="46" y="46" width="8" height="8" fill="#E59A1E" />
                <rect x="65" y="45" width="10" height="6" fill="#0C1B2A" />
                <rect x="80" y="55" width="10" height="20" fill="#0C1B2A" />
                <rect x="42" y="70" width="18" height="18" fill="#0C1B2A" />
                <rect x="65" y="80" width="20" height="10" fill="#0C1B2A" />
              </svg>
              <span className="text-[10px] font-bold text-[#0C1B2A] block mt-1 tracking-wider uppercase">
                Scan for Spot Entry
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Venue: {selectedEvent.venue}. Entry is {selectedEvent.entry} for youth {selectedEvent.ageGroup}.
              For seating confirmation, reach Gaurav at{' '}
              <a href={`tel:${SITE_CONFIG.contact.phone}`} className="text-[#F3A628] underline">
                {SITE_CONFIG.contact.phoneDisplay}
              </a>
            </p>

            <button
              onClick={() => {
                const title = selectedEvent.title;
                setSelectedEvent(null);
                onOpenRegister(title);
              }}
              className="w-full py-3 rounded-xl bg-[#E59A1E] text-[#0C1B2A] text-xs font-bold"
            >
              Confirm Admission
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
