import { useState, useEffect, useSyncExternalStore } from 'react';
import {
  EventItem,
  GalleryItem,
  NewsArticle,
  TestimonialSlot,
  SiteSettings,
  AdminActivityLog,
  SocialPost,
  PageId,
} from '../types';
import { EVENTS_DATA } from '../data/events';
import { GALLERY_ITEMS } from '../data/gallery';
import { TESTIMONIAL_SLOTS } from '../data/testimonials';
import { SITE_CONFIG } from '../data/siteConfig';
import { INITIAL_SOCIAL_POSTS } from '../data/socialPosts';

// Initial News Articles seed
export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'Why 5:45 AM Awakening Unlocks Mental Clarity for Modern Youth',
    category: 'Philosophy',
    date: '28 Aug 2026',
    readTime: '4 min read',
    author: 'Jain Genius Research Desk',
    excerpt: 'The biological and spiritual mechanics behind the first rule of the Daily Activity Card (DAC), and why the Brahma Muhurta sets your focus apart.',
    fullBody: [
      'In our contemporary 24/7 hyperconnected world, sleep hygiene has deteriorated dramatically. Most youth find their focus scattered, cognitive stamina depleted, and nervous systems perpetually stimulated by late-night phone screens.',
      'Under the guidance of Sahebji, Rule 01 of the Jain Genius Daily Activity Card requires rising by 5:45 AM. Awakening at dawn aligns our internal circadian rhythms with the quietest hour of the day.',
      'When you wake at 5:45 AM, you experience the tranquility required for sacred Chaityavandan, deep contemplation, and physical yoga before the external world begins making demands on your attention.',
      'Members report a 60% reduction in morning anxiety within just 14 consecutive days of maintaining this dawn discipline.'
    ]
  },
  {
    id: 'art-2',
    title: 'The Account Executive Track: Navigating GST, Tally & High-Integrity Auditing',
    category: 'Career',
    date: '20 Aug 2026',
    readTime: '5 min read',
    author: 'Commerce Mentorship Cell',
    excerpt: 'How our 60-session Account Executive track trains young students to become indispensable financial professionals in top trading and corporate houses.',
    fullBody: [
      'Integrity in commerce is one of the highest expressions of Jain values. Asteya (non-stealing and strict honesty) is not merely a spiritual vow; in the corporate arena, it represents immaculate financial discipline.',
      'Our 60-session Account Executive specialization takes students through real vouchers, GST filings, reconciliation tables, and TDS calculations.',
      'Unlike theoretical college degrees, our trainees work on simulated audits under senior chartered accountants and business owners, graduating with tangible, job-ready competence.'
    ]
  },
  {
    id: 'art-3',
    title: 'Cohort 01 Trainees Complete Inaugural Gardner Intelligence Mapping',
    category: 'Youth Stories',
    date: '12 Aug 2026',
    readTime: '3 min read',
    author: 'Career Counselling Wing',
    excerpt: '24 young members completed their Gardner Multiple Intelligences Assessment, discovering their innate strengths in analytical, interpersonal, and creative spheres.',
    fullBody: [
      'Every human mind possesses distinct cognitive strengths. Rather than forcing every student down the exact same path, Jain Genius administers Gardner’s Multiple Intelligences Test as Step 03 of the Member Journey.',
      'The 24 active trainees in our first Bangalore cohort uncovered whether their dominant profiles pointed toward analytical accounting, strategic sales, digital content design, or administrative operations.',
      'Following the assessment, individual 1-on-1 counseling mapped each member to their optimal career track with 100% mutual alignment.'
    ]
  },
  {
    id: 'art-4',
    title: 'Upcoming Youth Assembly at Chickpet: "Depression: The Invisible Battle"',
    category: 'Announcements',
    date: '05 Aug 2026',
    readTime: '2 min read',
    author: 'Events Directorate',
    excerpt: 'An open, compassionate, and solution-driven gathering addressing the modern epidemic of anxiety and emotional isolation among youth aged 15–30.',
    fullBody: [
      'Mental health is Pillar 04 of our holistic framework. On 30 August 2026 at 2:15 PM, Pathshala Hall, Chickpet Jain Temple will host this vital discussion.',
      'The assembly will combine clinical psychological insights with the spiritual anchoring of Jain contemplation, guiding youth toward self-compassion, resilience, and actionable coping frameworks.',
      'Admission is completely free for all youth aged 15 to 30. Early registration is recommended to guarantee hall seating.'
    ]
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  bannerEnabled: true,
  bannerText: '📢 Admissions open for Cohort 02. Sunday Youth Shabhā at 2:30 PM, Pathshala Hall, Chickpet.',
  bannerLinkText: 'View Events',
  bannerLinkPage: 'events',
  phone: SITE_CONFIG.contact.phone,
  phoneDisplay: SITE_CONFIG.contact.phoneDisplay,
  email: SITE_CONFIG.contact.email,
  whatsappGroupUrl: SITE_CONFIG.contact.whatsappGroupUrl,
  membershipDeposit: SITE_CONFIG.membershipDeposit,
  currentTraineesCount: SITE_CONFIG.currentTraineesCount,
  programsCount: SITE_CONFIG.programsCount,
  eventsCount: SITE_CONFIG.eventsCount,
  googleFormUrl: SITE_CONFIG.googleFormUrl,
  tagline: SITE_CONFIG.tagline,
  subTagline: SITE_CONFIG.subTagline,
  initiativeOf: SITE_CONFIG.initiativeOf,
};

// Storage keys
const STORAGE_KEYS = {
  EVENTS: 'jg_cms_events',
  GALLERY: 'jg_cms_gallery',
  NEWS: 'jg_cms_news',
  TESTIMONIALS: 'jg_cms_testimonials',
  SETTINGS: 'jg_cms_settings',
  SOCIAL: 'jg_cms_social_posts',
  LOGS: 'jg_cms_activity_logs',
  AUTH: 'jg_cms_admin_auth',
};

// Listeners for reactive store
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
  try {
    window.dispatchEvent(new CustomEvent('jg_cms_update'));
  } catch {
    // window might not exist in rare cases
  }
}

// Memory cache to avoid repeated JSON parsing
interface CMSState {
  events: EventItem[];
  gallery: GalleryItem[];
  news: NewsArticle[];
  testimonials: TestimonialSlot[];
  settings: SiteSettings;
  socialPosts: SocialPost[];
  logs: AdminActivityLog[];
  isAuthenticated: boolean;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Initial in-memory state
let state: CMSState = {
  events: loadFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, EVENTS_DATA),
  gallery: loadFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, GALLERY_ITEMS),
  news: loadFromStorage<NewsArticle[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS_ARTICLES),
  testimonials: loadFromStorage<TestimonialSlot[]>(STORAGE_KEYS.TESTIMONIALS, TESTIMONIAL_SLOTS),
  settings: loadFromStorage<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS),
  socialPosts: loadFromStorage<SocialPost[]>(STORAGE_KEYS.SOCIAL, INITIAL_SOCIAL_POSTS),
  logs: loadFromStorage<AdminActivityLog[]>(STORAGE_KEYS.LOGS, [
    {
      id: 'log-init',
      timestamp: new Date().toISOString(),
      action: 'create',
      module: 'system',
      description: 'CMS Database initialized with curated foundation data.',
    },
  ]),
  isAuthenticated: loadFromStorage<boolean>(STORAGE_KEYS.AUTH, false),
};

function logActivity(
  action: AdminActivityLog['action'],
  module: AdminActivityLog['module'],
  description: string
) {
  const newLog: AdminActivityLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
    timestamp: new Date().toISOString(),
    action,
    module,
    description,
  };
  state = {
    ...state,
    logs: [newLog, ...state.logs].slice(0, 100), // keep latest 100
  };
  saveToStorage(STORAGE_KEYS.LOGS, state.logs);
}

// CMS Actions
export const CMSStore = {
  // Subscribe helper for React useSyncExternalStore
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getState(): CMSState {
    return state;
  },

  // Auth
  login(pinOrPassword: string): boolean {
    const clean = pinOrPassword.trim();
    const envPin = (import.meta.env.VITE_ADMIN_PIN || '2026').trim();
    const envPassword = (import.meta.env.VITE_ADMIN_PASSWORD || 'Jaingenius2026').trim();

    // Authenticate against env PIN or env password
    const valid =
      clean === envPin ||
      clean === envPassword ||
      clean.toLowerCase() === envPassword.toLowerCase();

    if (valid) {
      state = { ...state, isAuthenticated: true };
      saveToStorage(STORAGE_KEYS.AUTH, true);
      logActivity('auth', 'system', 'Admin successfully signed into dashboard.');
      notify();
      return true;
    }
    return false;
  },

  logout() {
    state = { ...state, isAuthenticated: false };
    saveToStorage(STORAGE_KEYS.AUTH, false);
    logActivity('auth', 'system', 'Admin signed out of dashboard.');
    notify();
  },

  // --- EVENTS ---
  addEvent(event: Omit<EventItem, 'id'> & { id?: string }) {
    const newEvent: EventItem = {
      ...event,
      id: event.id || 'event-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    state = {
      ...state,
      events: [newEvent, ...state.events],
    };
    saveToStorage(STORAGE_KEYS.EVENTS, state.events);
    logActivity('create', 'events', `Created event: "${newEvent.title}" (${newEvent.status})`);
    notify();
    return newEvent;
  },

  updateEvent(id: string, updates: Partial<EventItem>) {
    state = {
      ...state,
      events: state.events.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)),
    };
    saveToStorage(STORAGE_KEYS.EVENTS, state.events);
    logActivity('update', 'events', `Updated event: "${updates.title || id}"`);
    notify();
  },

  deleteEvent(id: string) {
    const target = state.events.find((ev) => ev.id === id);
    state = {
      ...state,
      events: state.events.filter((ev) => ev.id !== id),
    };
    saveToStorage(STORAGE_KEYS.EVENTS, state.events);
    logActivity('delete', 'events', `Deleted event: "${target?.title || id}"`);
    notify();
  },

  // --- GALLERY ---
  addGalleryItem(item: Omit<GalleryItem, 'id'> & { id?: string }) {
    const newItem: GalleryItem = {
      ...item,
      id: item.id || 'gal-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    state = {
      ...state,
      gallery: [newItem, ...state.gallery],
    };
    saveToStorage(STORAGE_KEYS.GALLERY, state.gallery);
    logActivity('create', 'gallery', `Uploaded photo to gallery: "${newItem.title}" (${newItem.category})`);
    notify();
    return newItem;
  },

  updateGalleryItem(id: string, updates: Partial<GalleryItem>) {
    state = {
      ...state,
      gallery: state.gallery.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    };
    saveToStorage(STORAGE_KEYS.GALLERY, state.gallery);
    logActivity('update', 'gallery', `Updated gallery item: "${updates.title || id}"`);
    notify();
  },

  deleteGalleryItem(id: string) {
    const target = state.gallery.find((it) => it.id === id);
    state = {
      ...state,
      gallery: state.gallery.filter((it) => it.id !== id),
    };
    saveToStorage(STORAGE_KEYS.GALLERY, state.gallery);
    logActivity('delete', 'gallery', `Deleted gallery item: "${target?.title || id}"`);
    notify();
  },

  // --- NEWS & ARTICLES ---
  addNewsArticle(article: Omit<NewsArticle, 'id'> & { id?: string }) {
    const newArticle: NewsArticle = {
      ...article,
      id: article.id || 'art-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    state = {
      ...state,
      news: [newArticle, ...state.news],
    };
    saveToStorage(STORAGE_KEYS.NEWS, state.news);
    logActivity('create', 'news', `Published news article: "${newArticle.title}"`);
    notify();
    return newArticle;
  },

  updateNewsArticle(id: string, updates: Partial<NewsArticle>) {
    state = {
      ...state,
      news: state.news.map((art) => (art.id === id ? { ...art, ...updates } : art)),
    };
    saveToStorage(STORAGE_KEYS.NEWS, state.news);
    logActivity('update', 'news', `Updated news article: "${updates.title || id}"`);
    notify();
  },

  deleteNewsArticle(id: string) {
    const target = state.news.find((art) => art.id === id);
    state = {
      ...state,
      news: state.news.filter((art) => art.id !== id),
    };
    saveToStorage(STORAGE_KEYS.NEWS, state.news);
    logActivity('delete', 'news', `Deleted news article: "${target?.title || id}"`);
    notify();
  },

  // --- TESTIMONIALS ---
  addTestimonial(testimonial: Omit<TestimonialSlot, 'slotId'> & { slotId?: number }) {
    const maxSlot = state.testimonials.reduce((max, t) => Math.max(max, t.slotId), 0);
    const newSlot: TestimonialSlot = {
      ...testimonial,
      slotId: testimonial.slotId || maxSlot + 1,
      createdAt: new Date().toISOString(),
    };
    state = {
      ...state,
      testimonials: [...state.testimonials, newSlot],
    };
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, state.testimonials);
    logActivity(
      'create',
      'testimonials',
      `Added testimonial: "${newSlot.studentName || newSlot.label}" (${newSlot.status})`
    );
    notify();
    return newSlot;
  },

  updateTestimonial(slotId: number, updates: Partial<TestimonialSlot>) {
    state = {
      ...state,
      testimonials: state.testimonials.map((t) => (t.slotId === slotId ? { ...t, ...updates } : t)),
    };
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, state.testimonials);
    logActivity(
      'update',
      'testimonials',
      `Updated testimonial Slot #${slotId}: "${updates.studentName || updates.label || 'Candidate'}"`
    );
    notify();
  },

  deleteTestimonial(slotId: number) {
    state = {
      ...state,
      testimonials: state.testimonials.filter((t) => t.slotId !== slotId),
    };
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, state.testimonials);
    logActivity('delete', 'testimonials', `Deleted testimonial Slot #${slotId}`);
    notify();
  },

  // --- SITE SETTINGS ---
  updateSiteSettings(updates: Partial<SiteSettings>) {
    state = {
      ...state,
      settings: { ...state.settings, ...updates },
    };
    saveToStorage(STORAGE_KEYS.SETTINGS, state.settings);
    logActivity('update', 'settings', 'Updated website general configurations & banner.');
    notify();
  },

  // --- SOCIAL MEDIA POSTS & LIVE FEEDS ---
  addSocialPost(post: Omit<SocialPost, 'id' | 'createdAt'>): SocialPost {
    const newPost: SocialPost = {
      ...post,
      id: 'sp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      isPublished: post.isPublished !== undefined ? post.isPublished : true,
      createdAt: new Date().toISOString(),
    };
    state = {
      ...state,
      socialPosts: [newPost, ...state.socialPosts],
    };
    saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
    logActivity('create', 'social', `Added ${post.platform} social post: "${post.caption.substring(0, 40)}..."`);
    notify();
    return newPost;
  },

  updateSocialPost(id: string, updates: Partial<SocialPost>): boolean {
    const exists = state.socialPosts.some((p) => p.id === id);
    if (!exists) return false;
    state = {
      ...state,
      socialPosts: state.socialPosts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    };
    saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
    logActivity('update', 'social', `Updated social post ID #${id}`);
    notify();
    return true;
  },

  deleteSocialPost(id: string): boolean {
    const post = state.socialPosts.find((p) => p.id === id);
    if (!post) return false;
    state = {
      ...state,
      socialPosts: state.socialPosts.filter((p) => p.id !== id),
    };
    saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
    logActivity('delete', 'social', `Deleted ${post.platform} post: "${post.caption.substring(0, 30)}..."`);
    notify();
    return true;
  },

  togglePinSocialPost(id: string): boolean {
    const post = state.socialPosts.find((p) => p.id === id);
    if (!post) return false;
    const newPinned = !post.isPinned;
    state = {
      ...state,
      socialPosts: state.socialPosts.map((p) => (p.id === id ? { ...p, isPinned: newPinned } : p)),
    };
    saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
    logActivity('update', 'social', `${newPinned ? 'Pinned' : 'Unpinned'} social post ID #${id}`);
    notify();
    return true;
  },

  togglePublishSocialPost(id: string): boolean {
    const post = state.socialPosts.find((p) => p.id === id);
    if (!post) return false;
    const newPub = !post.isPublished;
    state = {
      ...state,
      socialPosts: state.socialPosts.map((p) => (p.id === id ? { ...p, isPublished: newPub } : p)),
    };
    saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
    logActivity('update', 'social', `${newPub ? 'Published' : 'Hidden'} social post ID #${id}`);
    notify();
    return true;
  },

  // --- BACKUP & RESTORE ---
  exportBackupJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      organization: 'Jain Genius - The Change Makers',
      data: {
        events: state.events,
        gallery: state.gallery,
        news: state.news,
        testimonials: state.testimonials,
        settings: state.settings,
        socialPosts: state.socialPosts,
      },
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackupJSON(jsonStr: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.data) {
        throw new Error('Invalid backup format: Missing data field.');
      }
      const { events, gallery, news, testimonials, settings, socialPosts } = parsed.data;

      if (events) {
        state.events = events;
        saveToStorage(STORAGE_KEYS.EVENTS, events);
      }
      if (gallery) {
        state.gallery = gallery;
        saveToStorage(STORAGE_KEYS.GALLERY, gallery);
      }
      if (news) {
        state.news = news;
        saveToStorage(STORAGE_KEYS.NEWS, news);
      }
      if (testimonials) {
        state.testimonials = testimonials;
        saveToStorage(STORAGE_KEYS.TESTIMONIALS, testimonials);
      }
      if (settings) {
        state.settings = settings;
        saveToStorage(STORAGE_KEYS.SETTINGS, settings);
      }
      if (socialPosts) {
        state.socialPosts = socialPosts;
        saveToStorage(STORAGE_KEYS.SOCIAL, socialPosts);
      }

      logActivity('import', 'system', 'Restored website data from uploaded JSON backup.');
      notify();
      return { success: true, message: 'All website information successfully imported and restored.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to parse JSON backup file.' };
    }
  },

  resetToFactoryDefaults() {
    state = {
      ...state,
      events: EVENTS_DATA,
      gallery: GALLERY_ITEMS,
      news: INITIAL_NEWS_ARTICLES,
      testimonials: TESTIMONIAL_SLOTS,
      settings: INITIAL_SITE_SETTINGS,
      socialPosts: INITIAL_SOCIAL_POSTS,
    };
    saveToStorage(STORAGE_KEYS.EVENTS, EVENTS_DATA);
    saveToStorage(STORAGE_KEYS.GALLERY, GALLERY_ITEMS);
    saveToStorage(STORAGE_KEYS.NEWS, INITIAL_NEWS_ARTICLES);
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, TESTIMONIAL_SLOTS);
    saveToStorage(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    saveToStorage(STORAGE_KEYS.SOCIAL, INITIAL_SOCIAL_POSTS);

    logActivity('reset', 'system', 'Reset all public website collections to factory foundation seeds.');
    notify();
  },
};

// React Hook for real-time reactivity in any component
export function useCMS() {
  const currentState = useSyncExternalStore(
    CMSStore.subscribe,
    CMSStore.getState,
    CMSStore.getState
  );

  return {
    ...currentState,
    login: CMSStore.login,
    logout: CMSStore.logout,
    addEvent: CMSStore.addEvent,
    updateEvent: CMSStore.updateEvent,
    deleteEvent: CMSStore.deleteEvent,
    addGalleryItem: CMSStore.addGalleryItem,
    updateGalleryItem: CMSStore.updateGalleryItem,
    deleteGalleryItem: CMSStore.deleteGalleryItem,
    addNewsArticle: CMSStore.addNewsArticle,
    updateNewsArticle: CMSStore.updateNewsArticle,
    deleteNewsArticle: CMSStore.deleteNewsArticle,
    addTestimonial: CMSStore.addTestimonial,
    updateTestimonial: CMSStore.updateTestimonial,
    deleteTestimonial: CMSStore.deleteTestimonial,
    updateSiteSettings: CMSStore.updateSiteSettings,
    addSocialPost: CMSStore.addSocialPost,
    updateSocialPost: CMSStore.updateSocialPost,
    deleteSocialPost: CMSStore.deleteSocialPost,
    togglePinSocialPost: CMSStore.togglePinSocialPost,
    togglePublishSocialPost: CMSStore.togglePublishSocialPost,
    exportBackupJSON: CMSStore.exportBackupJSON,
    importBackupJSON: CMSStore.importBackupJSON,
    resetToFactoryDefaults: CMSStore.resetToFactoryDefaults,
  };
}

// Utility: File to compressed base64 data URL
export function convertImageFileToBase64(
  file: File,
  maxDimension = 1200,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = document.createElement('img');
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to WebP or JPEG for compact storage
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to raw data url
        resolve(readerEvent.target?.result as string);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
