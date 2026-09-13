import React, { useState } from 'react';
import { PageId, Language } from '../../types';
import { useCMS } from '../../services/cmsStore';
import { EventsManager } from './EventsManager';
import { GalleryManager } from './GalleryManager';
import { NewsManager } from './NewsManager';
import { TestimonialsManager } from './TestimonialsManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { Logo } from '../common/Logo';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Calendar,
  Camera,
  Newspaper,
  MessageSquare,
  Settings,
  LayoutDashboard,
  Eye,
  Sparkles,
  ArrowUpRight,
  Clock,
  Plus,
  Users,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: PageId) => void;
  lang: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, lang }) => {
  const {
    events,
    gallery,
    news,
    testimonials,
    settings,
    logs,
    isAuthenticated,
    login,
    logout,
  } = useCMS();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'events' | 'gallery' | 'news' | 'testimonials' | 'settings'
  >('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(pinInput);
    if (!ok) {
      setPinError(true);
    } else {
      setPinError(false);
      setPinInput('');
      showToast('Welcome back, Administrator!');
    }
  };

  // --- If Not Authenticated, Display Dignified Admin Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#081320] flex items-center justify-center p-4 sm:p-6 text-[#FAF8F5]">
        <div className="w-full max-w-md bg-[#0C1B2A] border border-[#E59A1E]/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E59A1E]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3">
            <div className="inline-flex p-3.5 rounded-2xl bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628] mb-1">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Institutional content management dashboard for Jain Genius — The Change Makers.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Master PIN or Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  placeholder="Enter PIN (e.g. 2026)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#081320] border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E59A1E] transition-colors"
                />
              </div>

              {pinError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Incorrect PIN or credentials. Try PIN <strong>2026</strong>.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          {/* Quick Demo Helper Hint */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center space-y-1">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
              Default Access Credentials
            </span>
            <p className="text-[11px] text-slate-400">
              Master PIN: <strong className="text-white">2026</strong> or Password:{' '}
              <strong className="text-white">admin123</strong>
            </p>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Authenticated Admin Dashboard Layout ---
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0C1B2A] flex flex-col">
      {/* Toast Floating Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#0C1B2A] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#E59A1E]/40 flex items-center gap-3 animate-fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navigation Bar */}
      <header className="bg-[#0C1B2A] text-white border-b border-[#E59A1E]/20 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-left group flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F5B738] to-[#E59A1E] text-[#0C1B2A] flex items-center justify-center font-black text-sm">
                JG
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-black tracking-wide text-[#FAF8F5] uppercase">
                  Jain Genius
                </div>
                <div className="text-[10px] text-[#F3A628] font-bold">Admin Central</div>
              </div>
            </button>

            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
              Live Database Connected
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 transition-colors font-medium"
            >
              <Eye className="w-3.5 h-3.5 text-[#E59A1E]" />
              <span className="hidden sm:inline">View Public Website</span>
              <span className="sm:hidden">Public</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none border-t border-white/5 py-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'events'
                ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'gallery'
                ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Gallery ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'news'
                ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>News & Updates ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'testimonials'
                ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Testimonials ({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Site Settings & Backup</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Greeting & Headline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-display text-[#0C1B2A]">
                  Admin Command Hub
                </h2>
                <p className="text-xs text-slate-500">
                  Manage all public-facing information: events, gallery photos, news articles, student testimonials, and banners.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('home')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-[#E59A1E]" />
                  <span>Preview Live Website</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('events')}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-[#E59A1E] cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Events
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#E59A1E] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#0C1B2A] font-display">
                  {events.length}
                </div>
                <p className="text-[11px] text-slate-400">
                  {events.filter((e) => e.status === 'upcoming').length} upcoming assemblies
                </p>
              </div>

              <div
                onClick={() => setActiveTab('gallery')}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-[#E59A1E] cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Gallery
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#0C1B2A] font-display">
                  {gallery.length}
                </div>
                <p className="text-[11px] text-slate-400">Archived photos & session captures</p>
              </div>

              <div
                onClick={() => setActiveTab('news')}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-[#E59A1E] cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Articles
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Newspaper className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#0C1B2A] font-display">
                  {news.length}
                </div>
                <p className="text-[11px] text-slate-400">Published news & thought pieces</p>
              </div>

              <div
                onClick={() => setActiveTab('testimonials')}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-[#E59A1E] cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Testimonials
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#0C1B2A] font-display">
                  {testimonials.length}
                </div>
                <p className="text-[11px] text-slate-400">
                  {testimonials.filter((t) => t.status === 'ready').length} published student stories
                </p>
              </div>
            </div>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab('events')}
                className="p-5 rounded-3xl bg-gradient-to-br from-[#0C1B2A] to-[#162E4A] text-white text-left space-y-2 hover:shadow-lg transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 text-[#F5B738] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold font-display text-white">
                  Add New Event
                </h4>
                <p className="text-xs text-slate-300">
                  Create upcoming youth assemblies or discourse listings.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className="p-5 rounded-3xl bg-gradient-to-br from-[#0C1B2A] to-[#162E4A] text-white text-left space-y-2 hover:shadow-lg transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 text-[#F5B738] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold font-display text-white">
                  Upload Photos
                </h4>
                <p className="text-xs text-slate-300">
                  Add session photos to Shivir, Workshops, or Youth Assemblies.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className="p-5 rounded-3xl bg-gradient-to-br from-[#0C1B2A] to-[#162E4A] text-white text-left space-y-2 hover:shadow-lg transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 text-[#F5B738] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Newspaper className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold font-display text-white">
                  Publish Article
                </h4>
                <p className="text-xs text-slate-300">
                  Announce admissions, career guidance, or philosophy updates.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-5 rounded-3xl bg-gradient-to-br from-[#0C1B2A] to-[#162E4A] text-white text-left space-y-2 hover:shadow-lg transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-white/10 text-[#F5B738] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold font-display text-white">
                  Banner & Settings
                </h4>
                <p className="text-xs text-slate-300">
                  Update top notice bar, phone helpline, and Google Form link.
                </p>
              </button>
            </div>

            {/* Audit & Activity Logs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E59A1E]" />
                  <h3 className="text-sm font-bold text-[#0C1B2A] font-display">
                    Recent Administrative Changes & Audit Log
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Latest 100 Actions</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-2 space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            log.action === 'create'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.action === 'update'
                              ? 'bg-sky-100 text-sky-800'
                              : log.action === 'delete'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {log.action}
                        </span>
                        <span className="font-semibold text-slate-800">{log.description}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                        Module: {log.module}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Events */}
        {activeTab === 'events' && (
          <EventsManager onNavigate={onNavigate} showToast={showToast} />
        )}

        {/* Tab 3: Gallery */}
        {activeTab === 'gallery' && (
          <GalleryManager onNavigate={onNavigate} showToast={showToast} />
        )}

        {/* Tab 4: News */}
        {activeTab === 'news' && (
          <NewsManager onNavigate={onNavigate} showToast={showToast} />
        )}

        {/* Tab 5: Testimonials */}
        {activeTab === 'testimonials' && (
          <TestimonialsManager onNavigate={onNavigate} showToast={showToast} />
        )}

        {/* Tab 6: Site Settings & Backup */}
        {activeTab === 'settings' && (
          <SiteSettingsManager onNavigate={onNavigate} showToast={showToast} />
        )}
      </main>
    </div>
  );
};
