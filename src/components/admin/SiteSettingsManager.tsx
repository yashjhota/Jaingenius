import React, { useState } from 'react';
import { useCMS } from '../../services/cmsStore';
import { SiteSettings, PageId } from '../../types';
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
} from 'lucide-react';

interface SiteSettingsManagerProps {
  onNavigate: (page: PageId) => void;
  showToast: (msg: string) => void;
}

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({
  onNavigate,
  showToast,
}) => {
  const { settings, updateSiteSettings, exportBackupJSON, importBackupJSON, resetToFactoryDefaults } =
    useCMS();

  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    showToast('Website configurations & banner settings successfully updated!');
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

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    if (!importJsonText.trim()) return;

    const res = importBackupJSON(importJsonText);
    if (res.success) {
      showToast(res.message);
      setImportJsonText('');
      setFormData({ ...settings });
    } else {
      setImportError(res.message);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all website events, gallery, news, and testimonials to foundation defaults? This will erase custom additions.'
      )
    ) {
      resetToFactoryDefaults();
      showToast('All website collections reset to foundation seeds.');
      setFormData({ ...settings });
    }
  };

  return (
    <div className="space-y-8">
      {/* General Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Banner & Public Announcement Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-[#E59A1E]" />
            <h3 className="text-base font-bold text-[#0C1B2A] font-display">
              Top Public Notice & Urgent Announcement Banner
            </h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/50">
            <div>
              <p className="text-xs font-bold text-slate-900">Enable Announcement Banner</p>
              <p className="text-[11px] text-slate-500">
                Shows across the very top bar of every page on the live website.
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Announcement Message Text
              </label>
              <input
                type="text"
                value={formData.bannerText}
                onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                placeholder="📢 Admissions open for Cohort 02. Sunday Youth Assembly at 2:30 PM..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Banner Action Button Label
              </label>
              <input
                type="text"
                value={formData.bannerLinkText}
                onChange={(e) => setFormData({ ...formData, bannerLinkText: e.target.value })}
                placeholder="View Events"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>
          </div>
        </div>

        {/* Global Contact, Helpline & Google Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-5 h-5 text-[#E59A1E]" />
            <h3 className="text-base font-bold text-[#0C1B2A] font-display">
              Helpline Numbers & Registration Pipeline
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Phone Number (Formatted)
              </label>
              <input
                type="text"
                value={formData.phoneDisplay}
                onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
                placeholder="+91 99000 00000"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Direct Dial Tel Link (digits only)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+919900000000"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enquiry Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@jaingenius.org"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Group Invite URL
              </label>
              <input
                type="url"
                value={formData.whatsappGroupUrl}
                onChange={(e) => setFormData({ ...formData, whatsappGroupUrl: e.target.value })}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Google Registration & Enquiry Form URL
              </label>
              <input
                type="url"
                value={formData.googleFormUrl}
                onChange={(e) => setFormData({ ...formData, googleFormUrl: e.target.value })}
                placeholder="https://docs.google.com/forms/d/e/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used whenever students submit registration modal details or click the public Google Form links.
              </p>
            </div>
          </div>
        </div>

        {/* Live Metrics Counters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-[#E59A1E]" />
            <h3 className="text-base font-bold text-[#0C1B2A] font-display">
              Live Institutional Metrics & Indicators
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active Trainees Count
              </label>
              <input
                type="number"
                value={formData.currentTraineesCount}
                onChange={(e) =>
                  setFormData({ ...formData, currentTraineesCount: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Programs Indicator
              </label>
              <input
                type="text"
                value={formData.programsCount}
                onChange={(e) => setFormData({ ...formData, programsCount: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Events Indicator
              </label>
              <input
                type="text"
                value={formData.eventsCount}
                onChange={(e) => setFormData({ ...formData, eventsCount: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Refundable Deposit
              </label>
              <input
                type="text"
                value={formData.membershipDeposit}
                onChange={(e) => setFormData({ ...formData, membershipDeposit: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#E59A1E]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] text-sm font-bold shadow-xs hover:shadow transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Website Settings</span>
          </button>
        </div>
      </form>

      {/* Database Backup, Export & Factory Reset Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Settings className="w-5 h-5 text-[#E59A1E]" />
          <h3 className="text-base font-bold text-[#0C1B2A] font-display">
            Data Backup, Sync & System Recovery
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">
                Download Full Website Database (JSON)
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Exports all events, uploaded gallery photos, published news articles, testimonials, and settings as a clean portable JSON backup file.
              </p>
            </div>

            <button
              onClick={handleDownloadBackup}
              className="px-4 py-2 rounded-xl bg-[#0C1B2A] hover:bg-[#162E4A] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Download Backup File</span>
            </button>
          </div>

          {/* Reset */}
          <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Reset to Foundation Defaults
              </h4>
              <p className="text-[11px] text-red-700/80 leading-relaxed">
                Restores the standard foundation events, gallery items, news articles, and 5 student slots.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
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
            {importError && (
              <p className="text-xs text-red-600 font-medium">{importError}</p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!importJsonText.trim()}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold disabled:opacity-40"
              >
                Restore from JSON
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
