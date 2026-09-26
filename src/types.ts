export type Language = 'en' | 'hi';

export type PageId =
  | 'home'
  | 'about'
  | 'what-we-do'
  | 'programmes'
  | 'events'
  | 'gallery'
  | 'impact'
  | 'membership'
  | 'news'
  | 'contact'
  | 'admin';

export interface NavItem {
  id: PageId;
  labelEn: string;
  labelHi: string;
}

export interface HolisticPillar {
  id: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  descriptionEn: string;
  descriptionHi: string;
  keyActivitiesEn: string[];
  keyActivitiesHi: string[];
  icon: string;
}

export type TopicStatus = 'Ongoing' | 'Completed' | 'Coming Soon';

export interface TopicItem {
  id: string;
  title: string;
  titleHi: string;
  status: TopicStatus;
  category: string;
  description: string;
}

export interface PravachanItem {
  id: string;
  title: string;
  titleHi: string;
  date: string;
  speaker: string;
  type: 'Ratri Pravachan' | 'Youth Session' | 'Special Discourse';
  duration: string;
  videoUrl?: string;
  audioUrl?: string;
  summaryPoints: string[];
  fullTranscriptExcerpt?: string;
  isToday?: boolean;
}

export interface MemberJourneyStep {
  step: number;
  stage: string;
  stageHi: string;
  whatHappens: string;
  whatHappensHi: string;
  badge?: string;
}

export interface DacTask {
  number: number;
  taskEn: string;
  taskHi: string;
  noteTargetEn: string;
  noteTargetHi: string;
  category: 'Spiritual' | 'Physical' | 'Intellectual' | 'Conduct & Service';
}

export interface Programme {
  id: string;
  title: string;
  titleHi: string;
  category: 'CAREER / FINANCE / PROFESSIONAL' | 'DIGITAL / CREATIVE' | 'HEALTH / WELLNESS' | 'SPIRITUAL / PERSONAL GROWTH';
  whatWasCovered: string;
  formatReach: string;
  duration?: string;
  participants?: string;
  status: 'Ongoing' | 'Completed' | 'Upcoming' | 'Coming Soon';
  outcomes?: string[];
  imagePlaceholderText: string;
}

export interface CareerTrack {
  id: number;
  title: string;
  coreSkills: string[];
  foundation: string[];
  interviewPrep: string[];
  suggestedCertifications: string[];
}

export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  venue: string;
  ageGroup: string;
  entry: string;
  conductor: string;
  status: 'upcoming' | 'past';
  description: string;
  keyTopics?: string[];
  posterTheme?: string;
  posterImage?: string;
  recap?: string;
  createdAt?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string;
}

export interface TestimonialSlot {
  slotId: number;
  label: string;
  gender: 'boy' | 'girl';
  status: 'to_supply' | 'ready';
  studentName?: string;
  trackOrProgramme?: string;
  experienceText?: string;
  avatarUrl?: string;
  cohort?: string;
  createdAt?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  year: string;
  category: 'Shivir' | 'Workshop' | 'Discourse' | 'Youth Session';
  caption: string;
  url?: string;
  type?: 'image' | 'video';
  event?: string;
  createdAt?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  readTime: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Philosophy' | 'Career' | 'Youth Stories' | 'Announcements';
  date: string;
  readTime: string;
  excerpt: string;
  fullBody: string[];
  author: string;
  imageUrl?: string;
  featured?: boolean;
  createdAt?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string;
}

export interface SiteSettings {
  bannerEnabled: boolean;
  bannerText: string;
  bannerLinkText: string;
  bannerLinkPage: PageId;
  phone: string;
  phoneDisplay: string;
  email: string;
  whatsappGroupUrl: string;
  whatsappCommunityUrl?: string;
  membershipDeposit: string;
  currentTraineesCount: number;
  programsCount: string;
  eventsCount: string;
  googleFormUrl: string;
  tagline: string;
  subTagline: string;
  initiativeOf: string;
  // Hero section live customization fields
  heroTitle?: string;
  heroHighlightWord?: string;
  heroDescription?: string;
  heroBadgeText?: string;
  heroTargetAge?: string;
  heroPrimaryBtnText?: string;
  heroSecondaryBtnText?: string;
  // Social media handles & URLs for public viewing
  instagramUrl: string;
  instagramHandle: string;
  youtubeUrl: string;
  youtubeHandle?: string;
  telegramUrl: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  memberPortalUrl?: string;
  // Attribution & Venue details
  designerCreditName?: string;
  designerCreditUrl?: string;
  address?: string;
  targetAge?: string;
}

export type SocialPlatform =
  | 'instagram'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'facebook'
  | 'telegram'
  | 'whatsapp';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  postUrl: string;
  caption: string;
  authorName: string;
  authorHandle?: string;
  date: string;
  imageUrl?: string;
  videoEmbedUrl?: string;
  likesOrEngagement?: string;
  tags?: string[];
  isPinned?: boolean;
  isPublished?: boolean;
  createdAt?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string;
}

export interface AdminActivityLog {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'reset' | 'import' | 'auth';
  module: 'events' | 'gallery' | 'news' | 'testimonials' | 'settings' | 'social' | 'system';
  description: string;
}

export interface FAQItem {
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  category: string;
}

export interface TrashItem {
  id: string;
  module: 'social' | 'events' | 'gallery' | 'news' | 'testimonials';
  title: string;
  subtitle?: string;
  deletedAt: string;
  platform?: SocialPlatform;
  originalData: any;
}

