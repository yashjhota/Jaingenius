import React, { useState, useEffect } from 'react';
import { useCMS } from '../../services/cmsStore';
import { SiteSettings, PageId } from '../../types';
import { ConfirmDialog } from './ConfirmDialog';
import {
  Settings,
  Save,
  Bell,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Link,
  ShieldAlert,
  Instagram,
  Youtube,
  Send,
  MessageCircle,
  Twitter,
  Linkedin,
  MapPin,
  Building2,
  Share2,
  Calendar,
  GraduationCap,
  Eye,
  Globe,
  DollarSign,
  Palette,
  Loader2,
} from 'lucide-react';

interface SiteSettingsManagerProps {
  onNavigate: (page: PageId) => void;
  showToast: (msg: string) => void;
}

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({
  onNavigate,
  showToast,
}) => {
  const {
    settings,
    updateSiteSettings,
    exportBackupJSON,
    importBackupJSON,
    resetToFactoryDefaults,
  } = useCMS();

  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // Synchronize when remote settings change unless form is being actively typed
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...settings,
    }));
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteSettings(formData);
      showToast('Website configurations & public settings saved to database!');
    } catch (err: any) {
      showToast('Error saving settings: ' + (err?.message || 'Database write error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jain-genius-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded website data backup file (JSON).');
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    if (!importJsonText.trim()) return;

    try {
      const res = await importBackupJSON(importJsonText);
      if (res.success) {
        showToast(res.message);
        setImportJsonText('');
        setFormData({ ...settings });
      } else {
        setImportError(res.message);
      }
    } catch (err: any) {
      setImportError(err.message || 'Failed to import backup to Firestore.');
    }
  };

  const handleReset = () => {
    setIsConfirmingReset(true);
  };

  const handleConfirmReset = async () => {
    await resetToFactoryDefaults();
    showToast('All website collections reset to foundation seeds.');
    setFormData({ ...settings });
    setIsConfirmingReset(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-[#0C1B2A] to-[#162E4A] rounded-3xl p-6 sm:p-8 text-white border border-[#E59A1E]/30 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E59A1E]/20 text-[#F3A628] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Site Management Privileges</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Public Website & Database Configuration
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Edit all public-facing site information in real time. Changes made here update both the
              Firestore cloud database and reflect immediately across all public visitor pages.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] font-bold text-sm shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0C1B2A]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving to Database...' : 'Save All Website Settings'}</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Social Media & Public Channels */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0C1B2A] font-display">
                  Social Media Presence & Public Handles
                </h3>
                <p className="text-xs text-slate-500">
                  Controls Instagram name/handle, links, YouTube channel, Telegram, and WhatsApp communities.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
              Live Public Visibility
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Instagram Handle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram Public Display Handle / Username</span>
              </label>
              <input
                type="text"
                value={formData.instagramHandle || ''}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                placeholder="@jaingenius or @yashjhota"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Rendered on social follow buttons, footer link cards, and public social feeds.
              </p>
            </div>

            {/* Instagram Profile URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-pink-600" />
                <span>Instagram Profile URL</span>
              </label>
              <input
                type="url"
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://www.instagram.com/jaingenius"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Direct destination link opened when visitors tap on Instagram icons.
              </p>
            </div>

            {/* YouTube Channel URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube Channel URL</span>
              </label>
              <input
                type="url"
                value={formData.youtubeUrl || ''}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/@jaingenius"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            {/* YouTube Channel Handle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube Display Handle</span>
              </label>
              <input
                type="text"
                value={formData.youtubeHandle || ''}
                onChange={(e) => setFormData({ ...formData, youtubeHandle: e.target.value })}
                placeholder="@jaingenius"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            {/* Telegram URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-sky-500" />
                <span>Telegram Community / Channel URL</span>
              </label>
              <input
                type="url"
                value={formData.telegramUrl || ''}
                onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                placeholder="https://t.me/jaingeniusorg"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            {/* WhatsApp Community URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Community Group URL</span>
              </label>
              <input
                type="url"
                value={formData.whatsappCommunityUrl || formData.whatsappGroupUrl || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappCommunityUrl: e.target.value,
                    whatsappGroupUrl: e.target.value,
                  })
                }
                placeholder="https://chat.whatsapp.com/invite/..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            {/* Twitter / X URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-slate-700" />
                <span>Twitter / X Profile URL</span>
              </label>
              <input
                type="url"
                value={formData.twitterUrl || ''}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                placeholder="https://x.com/jaingeniustcm"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            {/* Member Portal URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>Member Portal Web App URL</span>
              </label>
              <input
                type="url"
                value={formData.memberPortalUrl || ''}
                onChange={(e) => setFormData({ ...formData, memberPortalUrl: e.target.value })}
                placeholder="https://jaingeniusorg.lovable.app/"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Organization Brand, Venue & Attribution */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#B8780E] flex items-center justify-center border border-amber-100">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0C1B2A] font-display">
                Brand Identity, Headquarter Venue & Credits
              </h3>
              <p className="text-xs text-slate-500">
                Spiritual leadership guidance title, official tagline, assembly venue, and footer attribution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Initiative Of */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initiative Of (Spiritual Mentor / Guidance Dedication)
              </label>
              <input
                type="text"
                value={formData.initiativeOf || ''}
                onChange={(e) => setFormData({ ...formData, initiativeOf: e.target.value })}
                placeholder="Param Pujya Muniraj Shri Bhuvanbhushanvijayji Maharajsaheb"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Displayed in the top navigation bar, hero banner, and official footer.
              </p>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Tagline
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="The Change Makers"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            {/* Target Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Age Range
              </label>
              <input
                type="text"
                value={formData.targetAge || ''}
                onChange={(e) => setFormData({ ...formData, targetAge: e.target.value })}
                placeholder="Youth (Age 15–30)"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            {/* Sub-tagline */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mission Statement / Sub-Tagline
              </label>
              <input
                type="text"
                value={formData.subTagline || ''}
                onChange={(e) => setFormData({ ...formData, subTagline: e.target.value })}
                placeholder="Build a generation of Jain change-makers who lead with values, professional excellence, and community seva."
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            {/* Assembly Venue Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E59A1E]" />
                <span>Headquarters / Regular Assembly Venue Address</span>
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Pathshala Hall, Chickpet Jain Temple, Chickpet, Bangalore, Karnataka, India"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Shown on the public Contact page and event venue instructions.
              </p>
            </div>

            {/* Designer / Developer Credit Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#E59A1E]" />
                <span>Footer Attribution / Designer Credit Name</span>
              </label>
              <input
                type="text"
                value={formData.designerCreditName || ''}
                onChange={(e) => setFormData({ ...formData, designerCreditName: e.target.value })}
                placeholder="jhota"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Appears in footer: "Designed & Developed by [name]".
              </p>
            </div>

            {/* Designer Credit URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#E59A1E]" />
                <span>Designer Credit Instagram / Website Link</span>
              </label>
              <input
                type="url"
                value={formData.designerCreditUrl || ''}
                onChange={(e) => setFormData({ ...formData, designerCreditUrl: e.target.value })}
                placeholder="https://www.instagram.com/yashjhota"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Live Public Counters & Membership Deposit */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0C1B2A] font-display">
                Live Metrics & Membership Deposit
              </h3>
              <p className="text-xs text-slate-500">
                Update the live cohort trainee counters and refundable deposit amount.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Active Trainees Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#E59A1E]" />
                <span>Active Cohort Trainees</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.currentTraineesCount ?? 24}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentTraineesCount: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-bold text-[#0C1B2A]"
              />
              <p className="text-[11px] text-slate-400 mt-1">Displayed in live stats banner.</p>
            </div>

            {/* Programs Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#E59A1E]" />
                <span>Programs Run (Display)</span>
              </label>
              <input
                type="text"
                value={formData.programsCount || '9+'}
                onChange={(e) => setFormData({ ...formData, programsCount: e.target.value })}
                placeholder="9+"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-bold text-[#0C1B2A]"
              />
            </div>

            {/* Events Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E59A1E]" />
                <span>Events Held (Display)</span>
              </label>
              <input
                type="text"
                value={formData.eventsCount || '12+'}
                onChange={(e) => setFormData({ ...formData, eventsCount: e.target.value })}
                placeholder="12+"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-bold text-[#0C1B2A]"
              />
            </div>

            {/* Membership Deposit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#E59A1E]" />
                <span>Refundable Deposit</span>
              </label>
              <input
                type="text"
                value={formData.membershipDeposit || '₹1,000'}
                onChange={(e) => setFormData({ ...formData, membershipDeposit: e.target.value })}
                placeholder="₹1,000"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-bold text-[#0C1B2A]"
              />
              <p className="text-[11px] text-slate-400 mt-1">100% refundable on shivir completion.</p>
            </div>
          </div>
        </div>

        {/* SECTION 4: Helpline Numbers & Registration Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0C1B2A] font-display">
                Helpline Numbers & Registration Pipeline
              </h3>
              <p className="text-xs text-slate-500">
                Public telephone lines, support email, and the admissions Google Form URL.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Phone Number (Formatted)
              </label>
              <input
                type="text"
                value={formData.phoneDisplay || ''}
                onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
                placeholder="+91 94800 52108"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Direct Dial Tel Link (Digits only)
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9480052108"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E59A1E]" />
                <span>Enquiry Email Address</span>
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jaingeniustcm@gmail.com"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Group / Direct Chat URL</span>
              </label>
              <input
                type="url"
                value={formData.whatsappGroupUrl || ''}
                onChange={(e) => setFormData({ ...formData, whatsappGroupUrl: e.target.value })}
                placeholder="https://wa.me/919480052108"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#E59A1E]" />
                <span>Official Google Registration & Enquiry Form URL</span>
              </label>
              <input
                type="url"
                value={formData.googleFormUrl || ''}
                onChange={(e) => setFormData({ ...formData, googleFormUrl: e.target.value })}
                placeholder="https://docs.google.com/forms/d/e/1FAIpQLSe-0lD9a..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Submissions from the modal and public register buttons synchronize with this spreadsheet form.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: Top Public Announcement Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#B8780E] flex items-center justify-center border border-amber-100">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0C1B2A] font-display">
                Top Public Notice & Urgent Announcement Banner
              </h3>
              <p className="text-xs text-slate-500">
                Displays on the highest bar of every public page to broadcast crucial notifications.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
            <div>
              <p className="text-sm font-bold text-slate-900">Enable Announcement Banner</p>
              <p className="text-xs text-slate-600">
                When enabled, renders at the top of the header across desktop and mobile.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bannerEnabled}
                onChange={(e) => setFormData({ ...formData, bannerEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E59A1E]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Announcement Message Text
              </label>
              <input
                type="text"
                value={formData.bannerText || ''}
                onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                placeholder="📢 Admissions open for Cohort 02. Sunday Youth Assembly at 2:30 PM..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Banner Action Button Label
              </label>
              <input
                type="text"
                value={formData.bannerLinkText || ''}
                onChange={(e) => setFormData({ ...formData, bannerLinkText: e.target.value })}
                placeholder="View Events"
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E] focus:bg-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: Live Public Preview Card */}
        <div className="bg-[#0C1B2A] rounded-3xl p-6 sm:p-8 text-white border border-[#E59A1E]/40 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#F3A628]" />
              <h3 className="text-base font-bold text-white font-display">
                Live Public Simulation Preview
              </h3>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E59A1E]/20 text-[#F3A628] border border-[#E59A1E]/30">
              Immediate Visitor Experience
            </span>
          </div>

          <div className="space-y-4">
            {/* Top Banner Simulation */}
            {formData.bannerEnabled && (
              <div className="p-3 rounded-xl bg-[#162E4A] border border-[#E59A1E]/30 text-xs text-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#E59A1E] animate-pulse shrink-0" />
                  <span className="truncate">{formData.bannerText}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#E59A1E] text-[#0C1B2A] font-bold text-[10px] shrink-0">
                  {formData.bannerLinkText || 'Action'}
                </span>
              </div>
            )}

            {/* Social Pill Simulation */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3A628] block">
                Social Badges As Seen By Public Visitors:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={formData.instagramUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-xs font-semibold text-pink-300 hover:bg-pink-500/20"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Follow {formData.instagramHandle || '@jaingenius'}</span>
                </a>

                {formData.youtubeUrl && (
                  <a
                    href={formData.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-400" />
                    <span>{formData.youtubeHandle || 'YouTube'}</span>
                  </a>
                )}

                {formData.whatsappCommunityUrl && (
                  <a
                    href={formData.whatsappCommunityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Community</span>
                  </a>
                )}
              </div>
            </div>

            {/* Footer Simulation */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span>Initiative of: </span>
                <strong className="text-white">{formData.initiativeOf}</strong>
              </div>
              <div>
                <span>Designed &amp; Developed by </span>
                <a
                  href={formData.designerCreditUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3A628] font-bold underline ml-1"
                >
                  {formData.designerCreditName || 'jhota'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Updates are synced to Cloud Firestore and propagated in real time.</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0C1B2A]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Updating Database...' : 'Save & Publish All Site Settings'}</span>
          </button>
        </div>
      </form>

      {/* SECTION 7: Backup, Export, JSON Restore & Diagnostics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Settings className="w-5 h-5 text-[#E59A1E]" />
          <div>
            <h3 className="text-lg font-bold text-[#0C1B2A] font-display">
              Data Backup, Export & System Recovery
            </h3>
            <p className="text-xs text-slate-500">
              Preserve website content, export complete database backups, or restore from a JSON file.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Backup */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">
                Download Full Website Database (JSON)
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Exports all events, uploaded gallery photos, published news articles, testimonials, and
                settings as a clean portable JSON backup file.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="px-4 py-2.5 rounded-xl bg-[#0C1B2A] hover:bg-[#162E4A] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Download Backup File</span>
            </button>
          </div>

          {/* Reset Factory */}
          <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Reset to Foundation Defaults</span>
              </h4>
              <p className="text-[11px] text-red-700/80 leading-relaxed">
                Restores the standard foundation events, gallery items, news articles, and student slots.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>

        {/* Import JSON Form */}
        <div className="pt-4 border-t border-slate-100">
          <form onSubmit={handleImportSubmit} className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Restore / Import Backup from JSON Text
            </label>
            <textarea
              rows={3}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON backup content here..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 font-mono focus:outline-none focus:border-[#E59A1E]"
            />
            {importError && <p className="text-xs text-red-600 font-medium">{importError}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!importJsonText.trim()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Restore from JSON
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmingReset}
        title="Reset All Content to Foundation Seeds?"
        message="Are you sure you want to reset all website events, gallery, news, and testimonials to foundation defaults? This will erase custom additions."
        confirmLabel="Reset Content"
        confirmVariant="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setIsConfirmingReset(false)}
      />
    </div>
  );
};
