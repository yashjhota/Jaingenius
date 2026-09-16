import React, { useState, useRef } from 'react';
import { DAILY_PRAVACHAN_ITEMS } from '../../data/pravachan';
import { SITE_CONFIG } from '../../data/siteConfig';
import { Language, PravachanItem } from '../../types';
import {
  Play,
  Pause,
  Volume2,
  FileText,
  Video,
  Headphones,
  ExternalLink,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Bookmark
} from 'lucide-react';

interface PravachanSpotlightProps {
  lang: Language;
}

export const PravachanSpotlight: React.FC<PravachanSpotlightProps> = ({ lang }) => {
  const todayDiscourse = DAILY_PRAVACHAN_ITEMS[0];
  const pastDiscourses = DAILY_PRAVACHAN_ITEMS.slice(1);

  const [activeMedia, setActiveMedia] = useState<'audio' | 'video'>('audio');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedDiscourse, setSelectedDiscourse] = useState<PravachanItem>(todayDiscourse);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // audio play fallback
      });
      setIsPlaying(true);
    }
  };

  const handleSelectDiscourse = (item: PravachanItem) => {
    setSelectedDiscourse(item);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <section id="daily-pravachan" className="py-20 bg-[#0A1624] text-[#FAF8F5] relative overflow-hidden">
      {/* Spiritual ambient gold background wash */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E59A1E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F5B738]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flagship Spiritual Anchor</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight font-display">
            Daily Pravachan from Sahebji
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every day, Sahebji ({SITE_CONFIG.initiativeOf}) delivers a Ratri Pravachan — life lessons
            for the internal spiritual grounding and mental resilience of youth.
          </p>
        </div>

        {/* Flagship Player Showcase Card */}
        <div className="rounded-3xl bg-[#0F2238] border-2 border-[#E59A1E]/40 shadow-2xl p-5 sm:p-8 lg:p-12 mb-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Details & Takeaways (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-[#E59A1E] text-[#0C1B2A] font-bold">
                  {selectedDiscourse.isToday ? "TODAY'S DISCOURSE" : 'ARCHIVE DISCOURSE'}
                </span>
                <span className="text-[#F3A628] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedDiscourse.date}
                </span>
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedDiscourse.duration}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#FAF8F5] font-display leading-tight">
                  {lang === 'en' ? selectedDiscourse.title : selectedDiscourse.titleHi}
                </h3>
                <p className="text-xs sm:text-sm text-[#E59A1E] font-medium mt-1">
                  Discourse by {selectedDiscourse.speaker}
                </p>
              </div>

              {/* Core takeaways excerpt */}
              <div className="bg-[#081320] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F3A628] uppercase tracking-wider flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5" />
                    Key Core Insights
                  </span>
                  <button
                    onClick={() => setShowSummaryModal(true)}
                    className="text-xs text-[#E59A1E] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Read Full Summary</span>
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {selectedDiscourse.summaryPoints.slice(0, 3).map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E59A1E] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-[#FAF8F5] flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4 text-[#F3A628]" />
                  <span>View Pravachan Summary</span>
                </button>

                <a
                  href={SITE_CONFIG.memberPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#162E4A] hover:bg-[#1E3B5C] border border-[#E59A1E]/30 text-xs font-bold text-[#FAF8F5] flex items-center justify-center gap-2 transition-all"
                >
                  <span>Search Archive in Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Right Col: Interactive Player Experience (5 cols) */}
            <div className="lg:col-span-5 bg-[#081320] border border-[#E59A1E]/30 rounded-2xl p-6 space-y-5">
              {/* Media Switcher Tab */}
              <div className="flex rounded-xl bg-[#0C1B2A] p-1 border border-white/10">
                <button
                  onClick={() => setActiveMedia('audio')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    activeMedia === 'audio'
                      ? 'bg-[#E59A1E] text-[#0C1B2A] shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Audio Discourse</span>
                </button>
                <button
                  onClick={() => setActiveMedia('video')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    activeMedia === 'video'
                      ? 'bg-[#E59A1E] text-[#0C1B2A] shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Discourse</span>
                </button>
              </div>

              {activeMedia === 'audio' ? (
                <div className="space-y-6 text-center py-4">
                  {/* Subtle waveform graphic visualization */}
                  <div className="flex items-center justify-center gap-1.5 h-14 px-4 bg-[#0C1B2A] rounded-xl border border-white/5">
                    {[12, 28, 44, 20, 36, 48, 24, 40, 16, 32, 46, 22, 38, 50, 18, 26].map((h, idx) => (
                      <span
                        key={idx}
                        className={`w-1 rounded-full bg-[#E59A1E] transition-all duration-300 ${
                          isPlaying ? 'animate-pulse' : 'opacity-40'
                        }`}
                        style={{ height: `${isPlaying ? h : Math.max(8, h * 0.4)}px` }}
                      />
                    ))}
                  </div>

                  <audio
                    ref={audioRef}
                    src={selectedDiscourse.audioUrl}
                    onEnded={() => setIsPlaying(false)}
                  />

                  {/* Player Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={toggleAudio}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-[#F5B738] to-[#E59A1E] text-[#0C1B2A] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                      aria-label={isPlaying ? 'Pause Pravachan' : 'Play Pravachan'}
                    >
                      {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center justify-between px-2">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-[#E59A1E]" />
                      High Definition Voice
                    </span>
                    <span>{selectedDiscourse.duration}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0C1B2A] border border-white/10 flex items-center justify-center">
                    {/* Embedded Youtube/Video Player or Preview */}
                    <iframe
                      src={selectedDiscourse.videoUrl}
                      title={selectedDiscourse.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Video streaming powered by Jain Genius Media Archives
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Archive Entries Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-[#FAF8F5] font-display">
              Recent Ratri Pravachan Archives
            </h4>
            <a
              href={SITE_CONFIG.memberPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#E59A1E] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Full Resource Library (Member Portal)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pastDiscourses.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectDiscourse(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedDiscourse.id === item.id
                    ? 'bg-[#162E4A] border-[#E59A1E]'
                    : 'bg-[#0F2238] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span>{item.date}</span>
                  <span className="text-[#F3A628] font-medium">{item.duration}</span>
                </div>
                <h5 className="text-sm font-bold text-[#FAF8F5] line-clamp-2">
                  {lang === 'en' ? item.title : item.titleHi}
                </h5>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#E59A1E] font-medium">
                  <Play className="w-3 h-3" />
                  <span>Listen to this recording</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pravachan Summary Modal */}
      {showSummaryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-[#081320]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-xl bg-[#0C1B2A] border border-[#E59A1E]/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#E59A1E] text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Pravachan Summary Sheet</span>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <h4 className="text-xl font-bold text-[#FAF8F5] font-display">
                {selectedDiscourse.title}
              </h4>
              <p className="text-xs text-[#E59A1E]">
                {selectedDiscourse.date} • {selectedDiscourse.speaker}
              </p>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  Key Principles Explained:
                </span>
                {selectedDiscourse.summaryPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed bg-[#081320] p-3 rounded-xl border border-white/5">
                    <span className="w-5 h-5 rounded-full bg-[#E59A1E]/20 text-[#F3A628] font-bold text-[10px] flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {selectedDiscourse.fullTranscriptExcerpt && (
                <div className="pt-3 border-t border-white/10">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Direct Quote / Excerpt:
                  </span>
                  <blockquote className="text-xs italic text-slate-400 bg-white/5 p-3 rounded-xl border-l-2 border-[#E59A1E]">
                    "{selectedDiscourse.fullTranscriptExcerpt}"
                  </blockquote>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2 rounded-xl bg-[#E59A1E] text-[#0C1B2A] text-xs font-bold"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
