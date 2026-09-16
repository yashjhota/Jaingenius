import React, { useState } from 'react';
import { SocialPost, SocialPlatform, Language, PageId } from '../../types';
import { useCMS } from '../../services/cmsStore';
import { SITE_CONFIG } from '../../data/siteConfig';
import {
  Share2,
  ExternalLink,
  Play,
  X,
  Pin,
  Flame,
  MessageCircle,
  Send,
  Instagram,
  Youtube,
  Twitter,
  ArrowRight,
  Sparkles,
  User,
  Clock,
  Radio,
} from 'lucide-react';

interface SocialFeedSectionProps {
  lang: Language;
  onNavigate?: (page: PageId) => void;
  className?: string;
  maxItems?: number;
  showHeaderAction?: boolean;
}

const PLATFORM_META: Record<
  SocialPlatform,
  {
    name: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    icon: React.ReactNode;
    actionLabel: string;
  }
> = {
  instagram: {
    name: 'Instagram',
    badgeBg: 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20',
    badgeText: 'text-pink-300',
    border: 'border-pink-500/30',
    icon: <Instagram className="w-3.5 h-3.5 text-pink-400" />,
    actionLabel: 'View on Instagram',
  },
  youtube: {
    name: 'YouTube',
    badgeBg: 'bg-red-500/20',
    badgeText: 'text-red-300',
    border: 'border-red-500/30',
    icon: <Youtube className="w-3.5 h-3.5 text-red-400" />,
    actionLabel: 'Watch on YouTube',
  },
  twitter: {
    name: 'X (Twitter)',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300',
    border: 'border-sky-500/30',
    icon: <Twitter className="w-3.5 h-3.5 text-sky-300" />,
    actionLabel: 'Read on X',
  },
  telegram: {
    name: 'Telegram',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    border: 'border-blue-500/30',
    icon: <Send className="w-3.5 h-3.5 text-blue-400" />,
    actionLabel: 'Join Channel',
  },
  whatsapp: {
    name: 'WhatsApp',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    border: 'border-emerald-500/30',
    icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />,
    actionLabel: 'Open in WhatsApp',
  },
  linkedin: {
    name: 'LinkedIn',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
    border: 'border-cyan-500/30',
    icon: <Share2 className="w-3.5 h-3.5 text-cyan-400" />,
    actionLabel: 'View on LinkedIn',
  },
  facebook: {
    name: 'Facebook',
    badgeBg: 'bg-indigo-500/20',
    badgeText: 'text-indigo-300',
    border: 'border-indigo-500/30',
    icon: <Share2 className="w-3.5 h-3.5 text-indigo-400" />,
    actionLabel: 'View on Facebook',
  },
};

export const SocialFeedSection: React.FC<SocialFeedSectionProps> = ({
  lang,
  onNavigate,
  className = '',
  maxItems,
  showHeaderAction = true,
}) => {
  const { socialPosts } = useCMS();
  const [activePlatform, setActivePlatform] = useState<string>('all');
  const [activeVideoPost, setActiveVideoPost] = useState<SocialPost | null>(null);

  // Only show published posts, sorted pinned first, then newest
  const publishedPosts = socialPosts
    .filter((p) => p.isPublished !== false)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const filteredPosts = publishedPosts.filter((p) => {
    if (activePlatform === 'all') return true;
    if (activePlatform === 'instagram') return p.platform === 'instagram';
    if (activePlatform === 'youtube') return p.platform === 'youtube';
    if (activePlatform === 'twitter') return p.platform === 'twitter';
    if (activePlatform === 'community')
      return p.platform === 'telegram' || p.platform === 'whatsapp';
    return true;
  });

  const displayedPosts = maxItems ? filteredPosts.slice(0, maxItems) : filteredPosts;

  return (
    <section
      id="social-pulse"
      className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 -mr-48 w-96 h-96 bg-[#E59A1E]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -ml-48 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E59A1E]/10 border border-[#E59A1E]/30 text-[#F3A628] text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE COMMUNITY PULSE • REAL-TIME NEWS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0C1B2A] tracking-tight font-display">
              Latest from Our Social Channels
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Real-time highlights from Sunday Youth Shabhās, Sahebji's inspiring ratri pravachan clips, DAC habits in action, and announcements directly curated by our admin desk.
            </p>
          </div>

          {/* Social Follow Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="https://www.instagram.com/yashjhota"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/30 text-xs font-semibold text-slate-800 transition-all hover:scale-105"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>Follow @yashjhota</span>
            </a>

            <a
              href={SITE_CONFIG.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-slate-800 transition-all hover:scale-105"
            >
              <Youtube className="w-3.5 h-3.5 text-red-600" />
              <span>YouTube</span>
            </a>

            <a
              href={SITE_CONFIG.social.whatsappCommunity}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-slate-800 transition-all hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Group</span>
            </a>

            {showHeaderAction && onNavigate && (
              <button
                onClick={() => onNavigate('news')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C1B2A] text-white hover:bg-[#162E4A] text-xs font-semibold transition-colors"
              >
                <span>All News</span>
                <ArrowRight className="w-3 h-3 text-[#F3A628]" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 touch-pan-x">
          {[
            { id: 'all', label: 'All Updates', icon: <Radio className="w-3.5 h-3.5" /> },
            { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-3.5 h-3.5 text-pink-500" /> },
            { id: 'youtube', label: 'YouTube Videos', icon: <Youtube className="w-3.5 h-3.5 text-red-500" /> },
            { id: 'twitter', label: 'X (Twitter)', icon: <Twitter className="w-3.5 h-3.5 text-sky-500" /> },
            { id: 'community', label: 'Telegram & WhatsApp', icon: <Send className="w-3.5 h-3.5 text-blue-500" /> },
          ].map((tab) => {
            const isSelected = activePlatform === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePlatform(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#0C1B2A] text-[#FAF8F5] shadow-sm ring-1 ring-[#E59A1E]/50'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/15 text-[#F3A628]' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.id === 'all'
                    ? publishedPosts.length
                    : tab.id === 'community'
                    ? publishedPosts.filter((p) => p.platform === 'telegram' || p.platform === 'whatsapp').length
                    : publishedPosts.filter((p) => p.platform === tab.id).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Post Cards Grid */}
        {displayedPosts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
            <Share2 className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
            <h3 className="text-base font-bold text-slate-800">No updates found in this category</h3>
            <p className="text-xs text-slate-500">
              Check back soon or select "All Updates" to view the latest announcements.
            </p>
            <button
              onClick={() => setActivePlatform('all')}
              className="px-4 py-2 rounded-xl bg-[#E59A1E] text-[#0C1B2A] text-xs font-bold"
            >
              View All Updates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.map((post) => {
              const meta = PLATFORM_META[post.platform] || PLATFORM_META.instagram;
              const hasVideo =
                post.platform === 'youtube' && (post.videoEmbedUrl || post.postUrl.includes('youtube'));

              return (
                <article
                  key={post.id}
                  className={`bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden relative group ${
                    post.isPinned
                      ? 'border-[#E59A1E]/80 ring-2 ring-[#E59A1E]/20 shadow-md'
                      : 'border-slate-200/90 shadow-xs hover:border-[#E59A1E]/50'
                  }`}
                >
                  {/* Top Bar inside card */}
                  <div className="p-4 sm:p-5 pb-3 flex items-center justify-between gap-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.badgeBg} ${meta.border} border ${meta.badgeText}`}
                      >
                        {meta.icon}
                        <span className="font-bold">{meta.name}</span>
                      </span>

                      {post.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
                          <Pin className="w-2.5 h-2.5 fill-amber-700" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Media Thumbnail Container */}
                  {post.imageUrl && (
                    <div
                      onClick={() => {
                        if (hasVideo) {
                          setActiveVideoPost(post);
                        } else {
                          window.open(post.postUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer group/media"
                    >
                      <img
                        src={post.imageUrl}
                        alt="Social post media"
                        className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {hasVideo ? (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover/media:bg-black/20">
                          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover/media:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                          <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/75 text-white text-[10px] font-bold">
                            Watch Video
                          </span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-white text-xs font-semibold inline-flex items-center gap-1">
                            <span>Open source post</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Caption & Content */}
                  <div className="p-5 flex-1 space-y-3">
                    {/* Author line */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800 truncate">
                        <User className="w-3.5 h-3.5 text-[#E59A1E] shrink-0" />
                        <span className="truncate">{post.authorName}</span>
                      </div>
                      {post.authorHandle && (
                        <span className="text-[11px] text-slate-400 font-mono shrink-0">
                          {post.authorHandle}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-4 font-normal">
                      {post.caption}
                    </p>

                    {/* Hashtags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium hover:bg-slate-200 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Action Bar */}
                  <div className="p-4 sm:p-5 pt-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                    {post.likesOrEngagement ? (
                      <span className="text-[11px] text-slate-500 font-medium">
                        {post.likesOrEngagement}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Jain Genius Community
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {hasVideo && (
                        <button
                          onClick={() => setActiveVideoPost(post)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors"
                        >
                          <Play className="w-3 h-3 fill-red-700" />
                          <span>Play</span>
                        </button>
                      )}

                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#E59A1E] text-slate-700 hover:text-[#0C1B2A] text-xs font-bold transition-colors shadow-2xs group/btn"
                      >
                        <span>{meta.actionLabel}</span>
                        <ExternalLink className="w-3 h-3 text-[#E59A1E] group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {activeVideoPost && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0C1B2A] border border-[#E59A1E]/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-white space-y-4 my-8 relative">
            <button
              onClick={() => setActiveVideoPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 z-10"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
              {activeVideoPost.videoEmbedUrl ? (
                <iframe
                  src={`${activeVideoPost.videoEmbedUrl}?autoplay=1&rel=0`}
                  title={activeVideoPost.caption}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <Play className="w-12 h-12 text-red-500" />
                  <p className="text-sm text-slate-300">
                    This video is hosted directly on YouTube.
                  </p>
                  <a
                    href={activeVideoPost.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-2"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Video Details */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <User className="w-3.5 h-3.5 text-[#F3A628]" />
                  <span>{activeVideoPost.authorName}</span>
                </div>
                <span>{activeVideoPost.date}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeVideoPost.caption}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-slate-400">
                  {activeVideoPost.likesOrEngagement || 'Jain Genius Discourse & Shivir Highlights'}
                </span>
                <a
                  href={activeVideoPost.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#F3A628] hover:underline font-semibold"
                >
                  <span>Open directly on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
