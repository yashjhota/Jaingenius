import React, { useState, useEffect } from 'react';
import { useCMS } from '../../services/cmsStore';
import { SiteSettings, SocialPost, SocialPlatform, EventItem, GalleryItem } from '../../types';
import {
  X,
  Save,
  Sparkles,
  CheckCircle2,
  Share2,
  Calendar,
  Camera,
  Layers,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Instagram,
  Youtube,
  Send,
  MessageCircle,
  Twitter,
} from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

export type QuickEditorSection =
  | 'hero'
  | 'footer'
  | 'socials'
  | 'add_social_post'
  | 'edit_social_post'
  | 'add_event'
  | 'edit_event'
  | 'add_gallery'
  | 'edit_gallery';

interface InPageSectionEditorModalProps {
  section: QuickEditorSection | null;
  targetItem?: any;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const InPageSectionEditorModal: React.FC<InPageSectionEditorModalProps> = ({
  section,
  targetItem,
  onClose,
  onShowToast,
}) => {
  const {
    settings,
    updateHeroSettings,
    updateFooterSettings,
    updateSocialConfig,
    addSocialPost,
    updateSocialPost,
    addEvent,
    updateEvent,
    addGalleryItem,
    updateGalleryItem,
  } = useCMS();

  // Local form state
  const [heroForm, setHeroForm] = useState({
    heroTitle: settings.heroTitle || 'Jain Genius',
    heroHighlightWord: settings.heroHighlightWord || settings.tagline || 'The Change Makers',
    heroDescription: settings.heroDescription || settings.subTagline || '',
    heroBadgeText: settings.heroBadgeText || `Guided by Sahebji • ${settings.initiativeOf}`,
    heroTargetAge: settings.heroTargetAge || settings.targetAge || 'Youth (15–30)',
    heroPrimaryBtnText: settings.heroPrimaryBtnText || 'Become a Member',
    bannerEnabled: settings.bannerEnabled,
    bannerText: settings.bannerText || '',
    bannerLinkText: settings.bannerLinkText || 'View Events',
  });

  const [socialsForm, setSocialsForm] = useState({
    instagramUrl: settings.instagramUrl || '',
    instagramHandle: settings.instagramHandle || '@jaingenius',
    youtubeUrl: settings.youtubeUrl || '',
    youtubeHandle: settings.youtubeHandle || '@jaingenius',
    whatsappCommunityUrl: settings.whatsappCommunityUrl || '',
    whatsappGroupUrl: settings.whatsappGroupUrl || '',
    telegramUrl: settings.telegramUrl || '',
    twitterUrl: settings.twitterUrl || '',
  });

  const [footerForm, setFooterForm] = useState({
    phone: settings.phone || '',
    phoneDisplay: settings.phoneDisplay || '',
    email: settings.email || '',
    address: settings.address || '',
    initiativeOf: settings.initiativeOf || '',
    membershipDeposit: settings.membershipDeposit || '',
    designerCreditName: settings.designerCreditName || 'jhota',
    designerCreditUrl: settings.designerCreditUrl || '',
  });

  // Social Post form
  const [postForm, setPostForm] = useState<Partial<SocialPost>>({
    platform: 'instagram',
    postUrl: '',
    caption: '',
    authorName: 'Jain Genius Community',
    authorHandle: '@jaingenius',
    date: 'Just now',
    imageUrl: '',
    videoEmbedUrl: '',
    likesOrEngagement: 'Active',
    isPinned: false,
    isPublished: true,
  });

  // Event form
  const [eventForm, setEventForm] = useState<Partial<EventItem>>({
    title: '',
    subtitle: '',
    date: new Date().toISOString().split('T')[0],
    time: '2:30 PM - 5:30 PM',
    venue: 'Pathshala Hall, Chickpet Jain Temple',
    ageGroup: '15–30 Years',
    entry: 'Free for Youth',
    conductor: 'Sahebji & Core Mentors',
    status: 'upcoming',
    description: '',
  });

  // Gallery form
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    title: '',
    year: '2026',
    category: 'Youth Session',
    caption: '',
    url: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (section === 'edit_social_post' && targetItem) {
      setPostForm({ ...targetItem });
    } else if (section === 'add_social_post') {
      setPostForm({
        platform: 'instagram',
        postUrl: '',
        caption: '',
        authorName: 'Jain Genius Community',
        authorHandle: '@jaingenius',
        date: 'Just now',
        imageUrl: '',
        videoEmbedUrl: '',
        likesOrEngagement: 'Active',
        isPinned: false,
        isPublished: true,
      });
    } else if (section === 'edit_event' && targetItem) {
      setEventForm({ ...targetItem });
    } else if (section === 'edit_gallery' && targetItem) {
      setGalleryForm({ ...targetItem });
    }
  }, [section, targetItem]);

  if (!section) return null;

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateHeroSettings({
        ...heroForm,
        tagline: heroForm.heroHighlightWord,
        subTagline: heroForm.heroDescription,
      });
      onShowToast('Hero section & banner updated in cloud database!');
      onClose();
    } catch (error) {
      console.error('Failed to save hero section settings:', error);
      onShowToast('Could not save hero settings to the cloud. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateSocialConfig(socialsForm);
      onShowToast('Social media links & channels updated!');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateFooterSettings(footerForm);
      onShowToast('Footer information and contact details saved!');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.caption || !postForm.postUrl) {
      alert('Please fill in both a post URL and caption.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (section === 'edit_social_post' && postForm.id) {
        await updateSocialPost(postForm.id, postForm);
        onShowToast('Social post updated and saved to cloud!');
      } else {
        await addSocialPost({
          platform: postForm.platform || 'instagram',
          postUrl: postForm.postUrl || '',
          caption: postForm.caption || '',
          authorName: postForm.authorName || 'Jain Genius',
          authorHandle: postForm.authorHandle,
          date: postForm.date || 'Recent',
          imageUrl: postForm.imageUrl,
          videoEmbedUrl: postForm.videoEmbedUrl,
          likesOrEngagement: postForm.likesOrEngagement,
          isPinned: postForm.isPinned,
          isPublished: postForm.isPublished,
        });
        onShowToast('New social media post published to live site!');
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) {
      alert('Please specify the event title and date.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (section === 'edit_event' && eventForm.id) {
        await updateEvent(eventForm.id, eventForm);
        onShowToast('Event updated in cloud database!');
      } else {
        await addEvent({
          title: eventForm.title || '',
          subtitle: eventForm.subtitle,
          date: eventForm.date || '',
          time: eventForm.time || '2:30 PM',
          venue: eventForm.venue || 'Pathshala Hall',
          ageGroup: eventForm.ageGroup || '15–30',
          entry: eventForm.entry || 'Free',
          conductor: eventForm.conductor || 'Sahebji',
          status: (eventForm.status as any) || 'upcoming',
          description: eventForm.description || '',
        });
        onShowToast('New event scheduled and published to site!');
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title) {
      alert('Please specify a title for the photo.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (section === 'edit_gallery' && galleryForm.id) {
        await updateGalleryItem(galleryForm.id, galleryForm);
        onShowToast('Gallery capture updated!');
      } else {
        await addGalleryItem({
          title: galleryForm.title || '',
          year: galleryForm.year || '2026',
          category: (galleryForm.category as any) || 'Youth Session',
          caption: galleryForm.caption || '',
          url: galleryForm.url,
        });
        onShowToast('New photo added to the gallery!');
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-[#0C1B2A] border border-[#E59A1E]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#162E4A]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E59A1E]/20 text-[#F3A628] border border-[#E59A1E]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                {section === 'hero' && 'Live Customize Hero Section'}
                {section === 'footer' && 'Live Customize Footer & Contacts'}
                {section === 'socials' && 'Live Customize Social Links'}
                {section === 'add_social_post' && 'Publish New Social Media Post'}
                {section === 'edit_social_post' && 'Edit Social Media Post'}
                {section === 'add_event' && 'Add Youth Event / Assembly'}
                {section === 'edit_event' && 'Edit Event Details'}
                {section === 'add_gallery' && 'Add Photo to Gallery'}
                {section === 'edit_gallery' && 'Edit Photo Capture'}
              </h3>
              <p className="text-xs text-slate-400">
                Changes persist immediately to Cloud Firestore and sync across all clients.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs sm:text-sm">
          {/* HERO SECTION FORM */}
          {section === 'hero' && (
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Primary Brand Title
                  </label>
                  <input
                    type="text"
                    value={heroForm.heroTitle}
                    onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="e.g. Jain Genius"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Highlight Gradient Word
                  </label>
                  <input
                    type="text"
                    value={heroForm.heroHighlightWord}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, heroHighlightWord: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#F5B738] font-bold focus:border-[#E59A1E] focus:outline-none"
                    placeholder="e.g. The Change Makers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Hero Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={heroForm.heroBadgeText}
                  onChange={(e) => setHeroForm({ ...heroForm, heroBadgeText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                  placeholder="Guided by Sahebji..."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Mission Statement / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={heroForm.heroDescription}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, heroDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none resize-none"
                  placeholder="Describe the awakening mission..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Target Demographic
                  </label>
                  <input
                    type="text"
                    value={heroForm.heroTargetAge}
                    onChange={(e) => setHeroForm({ ...heroForm, heroTargetAge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="Youth (15–30)"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={heroForm.heroPrimaryBtnText}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, heroPrimaryBtnText: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="Become a Member"
                  />
                </div>
              </div>

              {/* Announcement Banner Controls */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Global Notice Banner</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={heroForm.bannerEnabled}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, bannerEnabled: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E59A1E]"></div>
                  </label>
                </div>

                {heroForm.bannerEnabled && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Banner Text
                    </label>
                    <input
                      type="text"
                      value={heroForm.bannerText}
                      onChange={(e) => setHeroForm({ ...heroForm, bannerText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                      placeholder="e.g. Admissions open for Cohort 02..."
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E59A1E] hover:bg-[#F3A628] text-[#0C1B2A] font-bold shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving to Cloud...' : 'Save to Cloud'}</span>
                </button>
              </div>
            </form>
          )}

          {/* SOCIALS CONFIG FORM */}
          {section === 'socials' && (
            <form onSubmit={handleSocialsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={socialsForm.instagramUrl}
                    onChange={(e) =>
                      setSocialsForm({ ...socialsForm, instagramUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="https://instagram.com/jaingenius"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Instagram Handle Display
                  </label>
                  <input
                    type="text"
                    value={socialsForm.instagramHandle}
                    onChange={(e) =>
                      setSocialsForm({ ...socialsForm, instagramHandle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="@jaingenius"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={socialsForm.youtubeUrl}
                    onChange={(e) =>
                      setSocialsForm({ ...socialsForm, youtubeUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="https://youtube.com/@jaingenius"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    WhatsApp Community URL
                  </label>
                  <input
                    type="url"
                    value={socialsForm.whatsappCommunityUrl}
                    onChange={(e) =>
                      setSocialsForm({ ...socialsForm, whatsappCommunityUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="https://chat.whatsapp.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Telegram Broadcast URL
                  </label>
                  <input
                    type="url"
                    value={socialsForm.telegramUrl}
                    onChange={(e) =>
                      setSocialsForm({ ...socialsForm, telegramUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="https://t.me/jaingenius"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    X (Twitter) URL
                  </label>
                  <input
                    type="url"
                    value={socialsForm.twitterUrl}
                    onChange={(e) =>
                      setSocialsForm({ ...socialsForm, twitterUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="https://x.com/jaingenius"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E59A1E] hover:bg-[#F3A628] text-[#0C1B2A] font-bold shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Channels'}</span>
                </button>
              </div>
            </form>
          )}

          {/* FOOTER & CONTACTS FORM */}
          {section === 'footer' && (
            <form onSubmit={handleFooterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Helpline Phone (Dial Format)
                  </label>
                  <input
                    type="text"
                    value={footerForm.phone}
                    onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="+919880000000"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Phone Display Text
                  </label>
                  <input
                    type="text"
                    value={footerForm.phoneDisplay}
                    onChange={(e) =>
                      setFooterForm({ ...footerForm, phoneDisplay: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="+91 98800 00000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={footerForm.email}
                    onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="connect@jaingenius.org"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Initiative / Trust Attribution
                  </label>
                  <input
                    type="text"
                    value={footerForm.initiativeOf}
                    onChange={(e) =>
                      setFooterForm({ ...footerForm, initiativeOf: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="Sri Jinshasan Aradhana Trust"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assembly Venue Address
                </label>
                <textarea
                  rows={2}
                  value={footerForm.address}
                  onChange={(e) => setFooterForm({ ...footerForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none resize-none"
                  placeholder="Pathshala Hall, Chickpet Jain Temple..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Designer Credit Name
                  </label>
                  <input
                    type="text"
                    value={footerForm.designerCreditName}
                    onChange={(e) =>
                      setFooterForm({ ...footerForm, designerCreditName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="jhota"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Designer Link / Instagram
                  </label>
                  <input
                    type="url"
                    value={footerForm.designerCreditUrl}
                    onChange={(e) =>
                      setFooterForm({ ...footerForm, designerCreditUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="https://instagram.com/yashjhota"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E59A1E] hover:bg-[#F3A628] text-[#0C1B2A] font-bold shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Update Footer'}</span>
                </button>
              </div>
            </form>
          )}

          {/* SOCIAL POST ADD / EDIT FORM */}
          {(section === 'add_social_post' || section === 'edit_social_post') && (
            <form onSubmit={handleSocialPostSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Social Platform
                  </label>
                  <select
                    value={postForm.platform}
                    onChange={(e) =>
                      setPostForm({ ...postForm, platform: e.target.value as SocialPlatform })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                  >
                    <option value="instagram" className="bg-[#0C1B2A]">Instagram</option>
                    <option value="youtube" className="bg-[#0C1B2A]">YouTube</option>
                    <option value="twitter" className="bg-[#0C1B2A]">X (Twitter)</option>
                    <option value="telegram" className="bg-[#0C1B2A]">Telegram</option>
                    <option value="whatsapp" className="bg-[#0C1B2A]">WhatsApp</option>
                    <option value="linkedin" className="bg-[#0C1B2A]">LinkedIn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Direct Post / Video Link URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={postForm.postUrl}
                    onChange={(e) => setPostForm({ ...postForm, postUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="https://instagram.com/p/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Post Caption / Summary *
                </label>
                <textarea
                  rows={3}
                  required
                  value={postForm.caption}
                  onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none resize-none"
                  placeholder="Highlights from the session or discourse..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Author / Account Name
                  </label>
                  <input
                    type="text"
                    value={postForm.authorName}
                    onChange={(e) => setPostForm({ ...postForm, authorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Handle
                  </label>
                  <input
                    type="text"
                    value={postForm.authorHandle || ''}
                    onChange={(e) => setPostForm({ ...postForm, authorHandle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="@jaingenius"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Preview Thumbnail Image"
                value={postForm.imageUrl}
                onChange={(url) => setPostForm({ ...postForm, imageUrl: url })}
                hint="Upload an image or paste a web URL"
              />

              <div className="flex items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={postForm.isPinned || false}
                    onChange={(e) => setPostForm({ ...postForm, isPinned: e.target.checked })}
                    className="rounded text-[#E59A1E] focus:ring-[#E59A1E]"
                  />
                  <span className="font-semibold text-white">Pin to top of feed</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={postForm.isPublished !== false}
                    onChange={(e) => setPostForm({ ...postForm, isPublished: e.target.checked })}
                    className="rounded text-[#E59A1E] focus:ring-[#E59A1E]"
                  />
                  <span className="font-semibold text-white">Published (Visible to Visitors)</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E59A1E] hover:bg-[#F3A628] text-[#0C1B2A] font-bold shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Publishing...'
                      : section === 'edit_social_post'
                      ? 'Update Post'
                      : 'Publish Post'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* EVENT FORM */}
          {(section === 'add_event' || section === 'edit_event') && (
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Event Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                  placeholder="e.g. Sunday Youth Shabhā"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="30 August 2026"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="2:30 PM - 5:30 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="Pathshala Hall, Chickpet"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Status
                  </label>
                  <select
                    value={eventForm.status}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, status: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                  >
                    <option value="upcoming" className="bg-[#0C1B2A]">Upcoming</option>
                    <option value="ongoing" className="bg-[#0C1B2A]">Ongoing</option>
                    <option value="past" className="bg-[#0C1B2A]">Past</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Description & Agenda
                </label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none resize-none"
                  placeholder="Outline the session highlights and key speakers..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E59A1E] hover:bg-[#F3A628] text-[#0C1B2A] font-bold shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Event'}</span>
                </button>
              </div>
            </form>
          )}

          {/* GALLERY FORM */}
          {(section === 'add_gallery' || section === 'edit_gallery') && (
            <form onSubmit={handleGallerySubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Photo Title / Caption *
                </label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                  placeholder="e.g. Sunday Youth Assembly Discussion"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) =>
                      setGalleryForm({ ...galleryForm, category: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                  >
                    <option value="Youth Session" className="bg-[#0C1B2A]">Youth Session</option>
                    <option value="Workshop" className="bg-[#0C1B2A]">Workshop</option>
                    <option value="Shivir" className="bg-[#0C1B2A]">Shivir</option>
                    <option value="Discourse" className="bg-[#0C1B2A]">Discourse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={galleryForm.year}
                    onChange={(e) => setGalleryForm({ ...galleryForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#E59A1E] focus:outline-none"
                    placeholder="2026"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Photo Image"
                value={galleryForm.url}
                onChange={(url) => setGalleryForm({ ...galleryForm, url })}
                hint="Upload an image or paste a photo URL"
              />

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E59A1E] hover:bg-[#F3A628] text-[#0C1B2A] font-bold shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Photo'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
