import React, { useState } from 'react';
import { SocialPost, SocialPlatform, PageId } from '../../types';
import { useCMS } from '../../services/cmsStore';
import { SITE_CONFIG } from '../../data/siteConfig';
import { ImageUploadField } from './ImageUploadField';
import { ConfirmDialog } from './ConfirmDialog';
import {
  Share2,
  Plus,
  Edit3,
  Trash2,
  Search,
  ExternalLink,
  X,
  Pin,
  Eye,
  EyeOff,
  Sparkles,
  Play,
  Instagram,
  Youtube,
  Twitter,
  Send,
  MessageCircle,
  Linkedin,
  Facebook,
  CheckCircle2,
  HelpCircle,
  Tag,
  Calendar,
  User,
  Flame,
  Archive,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

interface SocialFeedManagerProps {
  onNavigate: (page: PageId) => void;
  showToast: (msg: string) => void;
}

const PLATFORM_CONFIG: Record<
  SocialPlatform,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  instagram: {
    label: 'Instagram',
    color: 'text-pink-400',
    bg: 'bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-orange-500/15',
    border: 'border-pink-500/30',
    icon: <Instagram className="w-4 h-4 text-pink-400" />,
  },
  youtube: {
    label: 'YouTube',
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    icon: <Youtube className="w-4 h-4 text-red-400" />,
  },
  twitter: {
    label: 'X (Twitter)',
    color: 'text-sky-300',
    bg: 'bg-sky-500/15',
    border: 'border-sky-500/30',
    icon: <Twitter className="w-4 h-4 text-sky-300" />,
  },
  telegram: {
    label: 'Telegram',
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    icon: <Send className="w-4 h-4 text-blue-400" />,
  },
  whatsapp: {
    label: 'WhatsApp',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    icon: <MessageCircle className="w-4 h-4 text-emerald-400" />,
  },
  linkedin: {
    label: 'LinkedIn',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/30',
    icon: <Linkedin className="w-4 h-4 text-cyan-400" />,
  },
  facebook: {
    label: 'Facebook',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/15',
    border: 'border-indigo-500/30',
    icon: <Facebook className="w-4 h-4 text-indigo-400" />,
  },
};

// Helper: auto-detect YouTube embed URL
function extractYouTubeEmbedUrl(url: string): string | undefined {
  if (!url) return undefined;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}`;
  }
  return undefined;
}

export const SocialFeedManager: React.FC<SocialFeedManagerProps> = ({
  onNavigate,
  showToast,
}) => {
  const {
    socialPosts,
    addSocialPost,
    updateSocialPost,
    deleteSocialPost,
    moveToTrash,
    restoreFromTrash,
    togglePinSocialPost,
    togglePublishSocialPost,
  } = useCMS();

  const [statusTab, setStatusTab] = useState<'active' | 'trash'>('active');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<SocialPost | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // In-app Delete & Trash Confirmation Modal State (replaces blocked window.confirm)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    post: SocialPost | null;
    isProcessing: boolean;
    mode: 'trash_or_permanent' | 'permanent_only';
  }>({
    isOpen: false,
    post: null,
    isProcessing: false,
    mode: 'trash_or_permanent',
  });

  const initialForm: Omit<SocialPost, 'id'> = {
    platform: 'instagram',
    postUrl: '',
    caption: '',
    authorName: 'Jain Genius — The Change Makers',
    authorHandle: '@jaingeniustcm',
    date: 'Just now',
    imageUrl: '',
    videoEmbedUrl: '',
    likesOrEngagement: '',
    tags: ['#JainGenius', '#YouthEmpowerment'],
    isPinned: false,
    isPublished: true,
  };

  const [formData, setFormData] = useState<Omit<SocialPost, 'id'>>(initialForm);
  const [tagsInput, setTagsInput] = useState('');

  // Active vs Trashed counts
  const activePosts = socialPosts.filter((p) => !p.isDeleted);
  const trashedPosts = socialPosts.filter((p) => !!p.isDeleted);

  const baseList = statusTab === 'active' ? activePosts : trashedPosts;

  const filteredPosts = baseList.filter((post) => {
    const matchesPlatform =
      platformFilter === 'All' || post.platform === platformFilter;
    const matchesSearch =
      post.caption.toLowerCase().includes(search.toLowerCase()) ||
      post.authorName.toLowerCase().includes(search.toLowerCase()) ||
      (post.authorHandle &&
        post.authorHandle.toLowerCase().includes(search.toLowerCase())) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    return matchesPlatform && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingPostId(null);
    setFormData(initialForm);
    setTagsInput('#JainGenius, #YouthEmpowerment');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: SocialPost) => {
    setEditingPostId(post.id);
    setFormData({
      platform: post.platform,
      postUrl: post.postUrl,
      caption: post.caption,
      authorName: post.authorName,
      authorHandle: post.authorHandle || '',
      date: post.date,
      imageUrl: post.imageUrl || '',
      videoEmbedUrl: post.videoEmbedUrl || '',
      likesOrEngagement: post.likesOrEngagement || '',
      tags: post.tags || [],
      isPinned: !!post.isPinned,
      isPublished: post.isPublished !== false,
    });
    setTagsInput(post.tags ? post.tags.join(', ') : '');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Smart URL handler: detects platform and YouTube embed
  const handleUrlChange = (url: string) => {
    let detectedPlatform = formData.platform;
    const lower = url.toLowerCase();

    if (lower.includes('instagram.com')) {
      detectedPlatform = 'instagram';
    } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      detectedPlatform = 'youtube';
    } else if (lower.includes('twitter.com') || lower.includes('x.com')) {
      detectedPlatform = 'twitter';
    } else if (lower.includes('t.me') || lower.includes('telegram')) {
      detectedPlatform = 'telegram';
    } else if (lower.includes('chat.whatsapp.com') || lower.includes('wa.me')) {
      detectedPlatform = 'whatsapp';
    } else if (lower.includes('linkedin.com')) {
      detectedPlatform = 'linkedin';
    }

    const autoEmbed = extractYouTubeEmbedUrl(url);

    setFormData((prev) => ({
      ...prev,
      postUrl: url,
      platform: detectedPlatform,
      videoEmbedUrl: autoEmbed || prev.videoEmbedUrl,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.caption.trim()) {
      setFormError('Post caption or headline is required.');
      return;
    }
    if (!formData.postUrl.trim()) {
      setFormError('Post URL or link is required.');
      return;
    }

    const parsedTags = tagsInput
      .split(/[, ]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const postPayload = {
      ...formData,
      tags: parsedTags,
    };

    if (editingPostId) {
      await updateSocialPost(editingPostId, postPayload);
      showToast('Social post successfully updated in Cloud database!');
    } else {
      await addSocialPost(postPayload);
      showToast('New social media post published to live feed!');
    }

    setIsModalOpen(false);
  };

  // Open in-app dialog for moving to trash or deleting permanently
  const handleOpenDelete = (post: SocialPost, mode: 'trash_or_permanent' | 'permanent_only' = 'trash_or_permanent') => {
    setDeleteDialog({
      isOpen: true,
      post,
      isProcessing: false,
      mode,
    });
  };

  const handleConfirmMoveToTrash = async () => {
    if (!deleteDialog.post) return;
    setDeleteDialog((prev) => ({ ...prev, isProcessing: true }));
    try {
      await moveToTrash('social', deleteDialog.post.id);
      showToast(`Post moved to Trash. It is hidden from public view and can be restored anytime.`);
    } finally {
      setDeleteDialog({ isOpen: false, post: null, isProcessing: false, mode: 'trash_or_permanent' });
    }
  };

  const handleConfirmPermanentDelete = async () => {
    if (!deleteDialog.post) return;
    setDeleteDialog((prev) => ({ ...prev, isProcessing: true }));
    try {
      await deleteSocialPost(deleteDialog.post.id);
      showToast(`Post permanently erased from Cloud Firestore.`);
    } finally {
      setDeleteDialog({ isOpen: false, post: null, isProcessing: false, mode: 'trash_or_permanent' });
    }
  };

  const handleRestore = async (post: SocialPost) => {
    await restoreFromTrash('social', post.id);
    showToast(`Restored "${post.caption.slice(0, 30)}..." to live public feed!`);
  };

  const pinnedCount = activePosts.filter((p) => p.isPinned).length;
  const publishedCount = activePosts.filter((p) => p.isPublished !== false).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="bg-[#0C1B2A] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F3A628] uppercase tracking-wider mb-1">
            <Share2 className="w-4 h-4" />
            <span>Social Media Hub & Real-Time Pulse</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Dynamic Social Posts & Community Links
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Publish, pin, and manage real-time updates from Instagram, YouTube, X, Telegram, and WhatsApp. Trainees and community visitors see these live on the homepage and news hub.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View on Website</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F5B738] via-[#E59A1E] to-[#F3A628] text-[#0C1B2A] text-xs font-bold hover:brightness-110 transition-all shadow-md inline-flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Social Post / Embed</span>
          </button>
        </div>
      </div>

      {/* Official Channels Quick Links */}
      <div className="bg-[#081320] border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Flame className="w-4 h-4 text-[#F3A628]" />
          <span>Official Social Handles:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={SITE_CONFIG.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Instagram (@jaingenius.tcm)</span>
          </a>
          <a
            href={SITE_CONFIG.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-colors"
          >
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>YouTube (@jaingenius)</span>
          </a>
          <a
            href={SITE_CONFIG.social.whatsappCommunity}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Community</span>
          </a>
          <a
            href={SITE_CONFIG.social.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-blue-400" />
            <span>Telegram Channel</span>
          </a>
        </div>
      </div>

      {/* Active vs Trash Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusTab === 'active'
                ? 'bg-[#E59A1E] text-[#0C1B2A] shadow-md shadow-[#E59A1E]/10'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Active Feed ({activePosts.length})</span>
          </button>

          <button
            onClick={() => setStatusTab('trash')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusTab === 'trash'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Trash Bin ({trashedPosts.length})</span>
          </button>
        </div>

        {statusTab === 'trash' ? (
          <p className="text-[11px] text-rose-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>These posts are hidden from visitors. You can restore them or permanently delete them.</span>
          </p>
        ) : (
          <div className="text-[11px] text-slate-400 hidden sm:block">
            <span>Click the trash icon on any card to remove it from public view.</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0C1B2A] p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {['All', 'instagram', 'youtube', 'twitter', 'telegram', 'whatsapp'].map((plat) => {
            const isSelected = platformFilter === plat;
            const cfg =
              plat !== 'All' ? PLATFORM_CONFIG[plat as SocialPlatform] : null;
            return (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#E59A1E] text-[#0C1B2A]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {cfg && cfg.icon}
                <span className="capitalize">{plat === 'All' ? 'All Platforms' : cfg?.label || plat}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts, handles, tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#081320] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Post Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-[#0C1B2A] border border-white/10 rounded-2xl p-12 text-center text-slate-400">
          <Share2 className="w-10 h-10 mx-auto text-slate-500 mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white mb-1">
            {statusTab === 'trash' ? 'Trash Bin is Empty' : 'No Social Posts Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {statusTab === 'trash'
              ? 'No trashed social posts currently stored.'
              : search || platformFilter !== 'All'
              ? 'Try changing your filter criteria or search query.'
              : 'Add your first social media link or post embed to display real-time updates.'}
          </p>
          {statusTab === 'active' && (
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-[#E59A1E] text-[#0C1B2A] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Social Post Now</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => {
            const platformCfg = PLATFORM_CONFIG[post.platform] || PLATFORM_CONFIG.instagram;
            const isPublished = post.isPublished !== false;

            return (
              <div
                key={post.id}
                className={`bg-[#0C1B2A] border rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:border-[#E59A1E]/50 ${
                  post.isDeleted
                    ? 'border-rose-500/40 opacity-80'
                    : post.isPinned
                    ? 'border-[#E59A1E] ring-1 ring-[#E59A1E]/30 shadow-lg shadow-[#E59A1E]/5'
                    : 'border-white/10'
                } ${!isPublished && !post.isDeleted ? 'opacity-60 bg-[#081320]' : ''}`}
              >
                {/* Header of card */}
                <div className="p-4 border-b border-white/5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {/* Platform Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${platformCfg.bg} ${platformCfg.border} border ${platformCfg.color}`}
                    >
                      {platformCfg.icon}
                      <span>{platformCfg.label}</span>
                    </span>

                    {/* Quick status chips */}
                    <div className="flex items-center gap-1.5">
                      {post.isDeleted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                          <Archive className="w-2.5 h-2.5" />
                          <span>In Trash</span>
                        </span>
                      )}
                      {!post.isDeleted && post.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E59A1E]/20 text-[#F3A628] border border-[#E59A1E]/40 text-[10px] font-bold">
                          <Pin className="w-2.5 h-2.5 fill-current" />
                          <span>Pinned</span>
                        </span>
                      )}
                      {!post.isDeleted && !isPublished && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                          Draft (Hidden)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Author / Date Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-medium text-slate-200 truncate">
                      <User className="w-3 h-3 text-[#F3A628]" />
                      <span className="truncate">{post.authorName}</span>
                    </div>
                    <span className="text-[11px] shrink-0">{post.date}</span>
                  </div>
                </div>

                {/* Media preview (if exists) */}
                {post.imageUrl && (
                  <div className="relative aspect-video bg-[#081320] overflow-hidden group">
                    <img
                      src={post.imageUrl}
                      alt="Social Post Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.platform === 'youtube' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Caption / Content */}
                <div className="p-4 space-y-3 flex-1">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {post.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-medium text-[#F3A628]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Engagement metric */}
                  {post.likesOrEngagement && (
                    <div className="text-[11px] text-slate-400 font-medium">
                      {post.likesOrEngagement}
                    </div>
                  )}
                </div>

                {/* Card Action Bar */}
                <div className="p-3 bg-[#081320]/80 border-t border-white/5 flex items-center justify-between gap-1 text-xs">
                  {post.isDeleted ? (
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className="text-[11px] text-rose-300 font-semibold flex items-center gap-1">
                        <Archive className="w-3.5 h-3.5 text-rose-400" />
                        <span>Trashed</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleRestore(post)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                          title="Restore to live public feed"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                        <button
                          onClick={() => handleOpenDelete(post, 'permanent_only')}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                          title="Erase forever from database"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Forever</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePinSocialPost(post.id)}
                          title={post.isPinned ? 'Unpin post' : 'Pin to top of feed'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            post.isPinned
                              ? 'bg-[#E59A1E]/20 text-[#F3A628] border-[#E59A1E]/40'
                              : 'text-slate-400 hover:text-white border-white/10 hover:bg-white/5'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => togglePublishSocialPost(post.id)}
                          title={isPublished ? 'Hide from public feed' : 'Publish to live feed'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isPublished
                              ? 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                              : 'text-rose-400 border-rose-500/30 hover:bg-rose-500/10'
                          }`}
                        >
                          {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open source post link"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#F3A628] border border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-[#F3A628]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={async () => {
                            await moveToTrash('social', post.id);
                            showToast(`"${post.platform.toUpperCase()}" post moved to Trash. Hidden from public site.`);
                          }}
                          className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                          title="Move to Trash (instantly removes from website)"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Trash</span>
                        </button>

                        <button
                          onClick={() => handleOpenDelete(post, 'trash_or_permanent')}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                          title="Delete post or purge from database"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0C1B2A] border border-[#E59A1E]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-white relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F3A628] uppercase tracking-wider mb-1">
                <Share2 className="w-4 h-4" />
                <span>{editingPostId ? 'Edit Social Post' : 'Publish New Social Post'}</span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                {editingPostId ? 'Update Social Feed Item' : 'Add Social Media Post / Announcement'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Platform Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Social Platform *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      'instagram',
                      'youtube',
                      'twitter',
                      'telegram',
                      'whatsapp',
                      'linkedin',
                      'facebook',
                    ] as SocialPlatform[]
                  ).map((plat) => {
                    const cfg = PLATFORM_CONFIG[plat];
                    const isSelected = formData.platform === plat;
                    return (
                      <button
                        type="button"
                        key={plat}
                        onClick={() => setFormData({ ...formData, platform: plat })}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? `${cfg.bg} ${cfg.border} ring-1 ring-[#E59A1E] text-white`
                            : 'bg-[#081320] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cfg.icon}
                        <span className="truncate">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Post URL with auto-detect */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-semibold">
                    Post / Reel / Video / Announcement URL *
                  </label>
                  <span className="text-[11px] text-[#F3A628]">
                    Auto-detects platform & embeds
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={formData.postUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.instagram.com/p/... or https://youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                  {formData.postUrl && (
                    <a
                      href={formData.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#F3A628]"
                      title="Test link in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Caption / News Headline / Update Text *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Summarize the update, key takeaways from the shivirs, or Sahebji's quote..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#E59A1E] leading-relaxed"
                />
              </div>

              {/* Author & Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Author / Account Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. Jain Genius — The Change Makers"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Handle / Username
                  </label>
                  <input
                    type="text"
                    value={formData.authorHandle}
                    onChange={(e) => setFormData({ ...formData, authorHandle: e.target.value })}
                    placeholder="e.g. @jaingenius.tcm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>
              </div>

              {/* Date & Engagement metric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Date or Relative Timestamp
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. Just now, Yesterday, or 14 Sep 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Engagement Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.likesOrEngagement}
                    onChange={(e) =>
                      setFormData({ ...formData, likesOrEngagement: e.target.value })
                    }
                    placeholder="e.g. 1.4k likes • 86 shares or 3.2k views"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="#JainGenius, #YouthEmpowerment, #Chickpet"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                />
              </div>

              {/* YouTube Embed URL (if YouTube) */}
              {formData.platform === 'youtube' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    YouTube Embed URL (for direct inline playing)
                  </label>
                  <input
                    type="url"
                    value={formData.videoEmbedUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, videoEmbedUrl: e.target.value })
                    }
                    placeholder="https://www.youtube-nocookie.com/embed/VIDEO_ID"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#081320] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#E59A1E]"
                  />
                </div>
              )}

              {/* Thumbnail / Image Upload */}
              <ImageUploadField
                label="Thumbnail / Media Image (Upload or URL)"
                value={formData.imageUrl}
                onChange={(img) => setFormData({ ...formData, imageUrl: img })}
                aspectHint="Card preview: 16:9 or 1:1 image ratio"
                placeholder="https://images.unsplash.com/... or paste image link"
              />

              {/* Pinned & Published Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) =>
                      setFormData({ ...formData, isPinned: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#E59A1E] focus:ring-0 bg-[#081320] border-white/20"
                  />
                  <span className="font-semibold text-slate-200">
                    ⭐ Pin to Top of Live Community Feed
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublished: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#E59A1E] focus:ring-0 bg-[#081320] border-white/20"
                  />
                  <span className="font-semibold text-slate-200">
                    Visible on Live Public Website
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F5B738] via-[#E59A1E] to-[#F3A628] text-[#0C1B2A] font-bold hover:brightness-110 shadow-lg"
                >
                  {editingPostId ? 'Save Changes' : 'Publish Post to Feed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Confirmation Dialog for Trashing or Permanently Deleting Posts */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={
          deleteDialog.mode === 'trash_or_permanent'
            ? `Delete or Trash ${deleteDialog.post?.platform ? deleteDialog.post.platform.toUpperCase() : 'Social'} Post?`
            : `Permanently Erase ${deleteDialog.post?.platform ? deleteDialog.post.platform.toUpperCase() : 'Social'} Post?`
        }
        message={
          deleteDialog.mode === 'trash_or_permanent'
            ? 'Choose whether to move this post to the Trash Bin (it will be immediately hidden from the live website and can be restored at any time), or permanently erase it from Cloud Firestore.'
            : 'Are you sure you want to permanently erase this post from Cloud Firestore? This action cannot be undone.'
        }
        itemTitle={
          deleteDialog.post
            ? `[${deleteDialog.post.platform.toUpperCase()}] ${deleteDialog.post.caption}`
            : undefined
        }
        confirmLabel={
          deleteDialog.mode === 'trash_or_permanent'
            ? 'Delete Permanently'
            : 'Erase Forever'
        }
        confirmVariant="danger"
        secondaryActionLabel={
          deleteDialog.mode === 'trash_or_permanent'
            ? 'Move to Trash (Hidden from website)'
            : undefined
        }
        onSecondaryAction={
          deleteDialog.mode === 'trash_or_permanent'
            ? handleConfirmMoveToTrash
            : undefined
        }
        onConfirm={handleConfirmPermanentDelete}
        onCancel={() =>
          setDeleteDialog({
            isOpen: false,
            post: null,
            isProcessing: false,
            mode: 'trash_or_permanent',
          })
        }
        isProcessing={deleteDialog.isProcessing}
      />
    </div>
  );
};
