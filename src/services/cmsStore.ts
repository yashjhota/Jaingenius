import { useState, useEffect, useSyncExternalStore } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  EventItem,
  GalleryItem,
  NewsArticle,
  TestimonialSlot,
  SiteSettings,
  AdminActivityLog,
  SocialPost,
  TrashItem,
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
    excerpt:
      'The biological and spiritual mechanics behind the first rule of the Daily Activity Card (DAC), and why the Brahma Muhurta sets your focus apart.',
    fullBody: [
      'In our contemporary 24/7 hyperconnected world, sleep hygiene has deteriorated dramatically. Most youth find their focus scattered, cognitive stamina depleted, and nervous systems perpetually stimulated by late-night phone screens.',
      'Under the guidance of Sahebji, Rule 01 of the Jain Genius Daily Activity Card requires rising by 5:45 AM. Awakening at dawn aligns our internal circadian rhythms with the quietest hour of the day.',
      'When you wake at 5:45 AM, you experience the tranquility required for sacred Chaityavandan, deep contemplation, and physical yoga before the external world begins making demands on your attention.',
      'Members report a 60% reduction in morning anxiety within just 14 consecutive days of maintaining this dawn discipline.',
    ],
  },
  {
    id: 'art-2',
    title: 'The Account Executive Track: Navigating GST, Tally & High-Integrity Auditing',
    category: 'Career',
    date: '20 Aug 2026',
    readTime: '5 min read',
    author: 'Commerce Mentorship Cell',
    excerpt:
      'How our 60-session Account Executive track trains young students to become indispensable financial professionals in top trading and corporate houses.',
    fullBody: [
      'Integrity in commerce is one of the highest expressions of Jain values. Asteya (non-stealing and strict honesty) is not merely a spiritual vow; in the corporate arena, it represents immaculate financial discipline.',
      'Our 60-session Account Executive specialization takes students through real vouchers, GST filings, reconciliation tables, and TDS calculations.',
      'Unlike theoretical college degrees, our trainees work on simulated audits under senior chartered accountants and business owners, graduating with tangible, job-ready competence.',
    ],
  },
  {
    id: 'art-3',
    title: 'Cohort 01 Trainees Complete Inaugural Gardner Intelligence Mapping',
    category: 'Youth Stories',
    date: '12 Aug 2026',
    readTime: '3 min read',
    author: 'Career Counselling Wing',
    excerpt:
      '24 young members completed their Gardner Multiple Intelligences Assessment, discovering their innate strengths in analytical, interpersonal, and creative spheres.',
    fullBody: [
      'Every human mind possesses distinct cognitive strengths. Rather than forcing every student down the exact same path, Jain Genius administers Gardner’s Multiple Intelligences Test as Step 03 of the Member Journey.',
      'The 24 active trainees in our first Bangalore cohort uncovered whether their dominant profiles pointed toward analytical accounting, strategic sales, digital content design, or administrative operations.',
      'Following the assessment, individual 1-on-1 counseling mapped each member to their optimal career track with 100% mutual alignment.',
    ],
  },
  {
    id: 'art-4',
    title: 'Upcoming Youth Assembly at Chickpet: "Depression: The Invisible Battle"',
    category: 'Announcements',
    date: '05 Aug 2026',
    readTime: '2 min read',
    author: 'Events Directorate',
    excerpt:
      'An open, compassionate, and solution-driven gathering addressing the modern epidemic of anxiety and emotional isolation among youth aged 15–30.',
    fullBody: [
      'Mental health is Pillar 04 of our holistic framework. On 30 August 2026 at 2:15 PM, Pathshala Hall, Chickpet Jain Temple will host this vital discussion.',
      'The assembly will combine clinical psychological insights with the spiritual anchoring of Jain contemplation, guiding youth toward self-compassion, resilience, and actionable coping frameworks.',
      'Admission is completely free for all youth aged 15 to 30. Early registration is recommended to guarantee hall seating.',
    ],
  },
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
  whatsappCommunityUrl: SITE_CONFIG.social.whatsappCommunity,
  membershipDeposit: SITE_CONFIG.membershipDeposit,
  currentTraineesCount: SITE_CONFIG.currentTraineesCount,
  programsCount: SITE_CONFIG.programsCount,
  eventsCount: SITE_CONFIG.eventsCount,
  googleFormUrl: SITE_CONFIG.googleFormUrl,
  tagline: SITE_CONFIG.tagline,
  subTagline: SITE_CONFIG.subTagline,
  initiativeOf: SITE_CONFIG.initiativeOf,
  heroTitle: 'Jain Genius',
  heroHighlightWord: 'The Change Makers',
  heroDescription:
    'Dedicated to the holistic awakening and empowerment of youth aged 15–30 across spiritual grounding, vocational careers, physical health, and emotional resilience.',
  heroBadgeText: 'Guided by Sahebji • An Initiative of Sri Jinshasan Aradhana Trust',
  heroTargetAge: 'Youth (15–30)',
  heroPrimaryBtnText: 'Become a Member',
  heroSecondaryBtnText: 'Join WhatsApp Community',
  instagramUrl: SITE_CONFIG.social.instagram,
  instagramHandle: '@jaingenius',
  youtubeUrl: SITE_CONFIG.social.youtube,
  youtubeHandle: '@jaingenius',
  telegramUrl: SITE_CONFIG.social.telegram,
  twitterUrl: SITE_CONFIG.social.twitter,
  linkedinUrl: '',
  memberPortalUrl: SITE_CONFIG.memberPortalUrl,
  designerCreditName: 'jhota',
  designerCreditUrl: 'https://www.instagram.com/yashjhota',
  address: 'Pathshala Hall, Chickpet Jain Temple, Chickpet, Bangalore, Karnataka, India',
  targetAge: SITE_CONFIG.targetAge,
};

// Storage keys for local caching & offline support
const STORAGE_KEYS = {
  EVENTS: 'jg_cms_events',
  GALLERY: 'jg_cms_gallery',
  NEWS: 'jg_cms_news',
  TESTIMONIALS: 'jg_cms_testimonials',
  SETTINGS: 'jg_cms_settings',
  SOCIAL: 'jg_cms_social_posts',
  LOGS: 'jg_cms_activity_logs',
  AUTH: 'jg_cms_admin_auth',
  LIVE_EDIT: 'jg_cms_live_edit_mode',
  INITIALIZED: 'jg_cms_db_initialized',
};

// Listeners for reactive store
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
  try {
    window.dispatchEvent(new CustomEvent('jg_cms_update'));
  } catch {
    // window might not exist in non-browser context
  }
}

export type FirebaseSyncStatus = 'connected' | 'syncing' | 'offline' | 'error';

// Reactive CMS State
export interface CMSState {
  events: EventItem[];
  gallery: GalleryItem[];
  news: NewsArticle[];
  testimonials: TestimonialSlot[];
  settings: SiteSettings;
  socialPosts: SocialPost[];
  logs: AdminActivityLog[];
  isAuthenticated: boolean;
  isLiveEditMode: boolean;
  firebaseSyncStatus: FirebaseSyncStatus;
  lastSyncedAt: string | null;
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

function normalizeTestimonialRecord(raw: Partial<TestimonialSlot> & Record<string, unknown>): TestimonialSlot {
  const studentName = String(raw.studentName ?? raw.name ?? raw.label ?? 'Student').trim() || 'Student';
  const experienceText = String(raw.experienceText ?? raw.quote ?? '').trim();
  const cohort = String(raw.cohort ?? raw.yearOrCohort ?? 'Cohort 01').trim() || 'Cohort 01';

  return {
    slotId: Number(raw.slotId ?? 0),
    label: String(raw.label ?? 'Student Graduate').trim() || 'Student Graduate',
    gender: raw.gender === 'girl' ? 'girl' : 'boy',
    status: raw.status === 'ready' ? 'ready' : 'to_supply',
    studentName,
    name: studentName,
    trackOrProgramme: String(raw.trackOrProgramme ?? '60-Session Master Track').trim() || '60-Session Master Track',
    experienceText,
    quote: experienceText,
    avatarUrl: String(raw.avatarUrl ?? '').trim(),
    cohort,
    yearOrCohort: cohort,
    createdAt: raw.createdAt ? String(raw.createdAt) : new Date().toISOString(),
    isDeleted: !!raw.isDeleted,
    deletedAt: raw.deletedAt ?? null,
    deletedBy: raw.deletedBy ? String(raw.deletedBy) : undefined,
  };
}

// Initial state hydrated from local storage / static seed
let state: CMSState = {
  events: loadFromStorage<EventItem[]>(STORAGE_KEYS.EVENTS, EVENTS_DATA),
  gallery: loadFromStorage<GalleryItem[]>(STORAGE_KEYS.GALLERY, GALLERY_ITEMS),
  news: loadFromStorage<NewsArticle[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS_ARTICLES),
  testimonials: loadFromStorage<TestimonialSlot[]>(STORAGE_KEYS.TESTIMONIALS, TESTIMONIAL_SLOTS).map(
    normalizeTestimonialRecord
  ),
  settings: loadFromStorage<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS),
  socialPosts: loadFromStorage<SocialPost[]>(STORAGE_KEYS.SOCIAL, INITIAL_SOCIAL_POSTS),
  logs: loadFromStorage<AdminActivityLog[]>(STORAGE_KEYS.LOGS, [
    {
      id: 'log-init',
      timestamp: new Date().toISOString(),
      action: 'create',
      module: 'system',
      description: 'Connected to Firebase Firestore with real-time sync & cloud persistence.',
    },
  ]),
  isAuthenticated: loadFromStorage<boolean>(STORAGE_KEYS.AUTH, false),
  isLiveEditMode: loadFromStorage<boolean>(STORAGE_KEYS.LIVE_EDIT, false),
  firebaseSyncStatus: 'syncing',
  lastSyncedAt: null,
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
    logs: [newLog, ...state.logs].slice(0, 100),
  };
  saveToStorage(STORAGE_KEYS.LOGS, state.logs);

  try {
    setDoc(doc(db, 'activityLogs', newLog.id), newLog).catch(() => {});
  } catch {
    // Non-blocking for logs
  }
}

// ==========================================
// FIRESTORE REAL-TIME SYNCHRONIZATION ENGINE
// ==========================================
let hasInitializedFirestoreListeners = false;

async function checkAndBootstrapInitialData() {
  try {
    const metaRef = doc(db, 'settings', 'cms_meta');
    const metaSnap = await getDoc(metaRef);

    if (!metaSnap.exists()) {
      // First-time database bootstrap only!
      const batch = writeBatch(db);
      EVENTS_DATA.forEach((ev) => batch.set(doc(db, 'events', ev.id), ev));
      GALLERY_ITEMS.forEach((it) => batch.set(doc(db, 'gallery', it.id), it));
      INITIAL_NEWS_ARTICLES.forEach((art) => batch.set(doc(db, 'news', art.id), art));
      TESTIMONIAL_SLOTS.forEach((t) => batch.set(doc(db, 'testimonials', String(t.slotId)), t));
      INITIAL_SOCIAL_POSTS.forEach((p) => batch.set(doc(db, 'socialPosts', p.id), p));
      batch.set(doc(db, 'settings', 'site_settings'), INITIAL_SITE_SETTINGS);
      batch.set(metaRef, {
        initialized: true,
        seededAt: new Date().toISOString(),
        version: '2.0',
      });
      await batch.commit();
      saveToStorage(STORAGE_KEYS.INITIALIZED, true);
    } else {
      saveToStorage(STORAGE_KEYS.INITIALIZED, true);
    }
  } catch (err) {
    console.warn('Initial database metadata check:', err);
  }
}

function initFirestoreSync() {
  if (hasInitializedFirestoreListeners) return;
  hasInitializedFirestoreListeners = true;

  // Run initialization check in background
  checkAndBootstrapInitialData();

  try {
    // 1. Events Listener (Does NOT auto-seed if empty! Empty means admin intentionally deleted all)
    const eventsPath = 'events';
    onSnapshot(
      collection(db, eventsPath),
      (snapshot) => {
        const remoteEvents: EventItem[] = [];
        snapshot.forEach((d) => remoteEvents.push(d.data() as EventItem));
        state = {
          ...state,
          events: remoteEvents,
          firebaseSyncStatus: 'connected',
          lastSyncedAt: new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.EVENTS, remoteEvents);
        notify();
      },
      (error) => {
        state = { ...state, firebaseSyncStatus: 'error' };
        notify();
        try {
          handleFirestoreError(error, OperationType.LIST, eventsPath);
        } catch {}
      }
    );

    // 2. Gallery Listener
    const galleryPath = 'gallery';
    onSnapshot(
      collection(db, galleryPath),
      (snapshot) => {
        const remoteGallery: GalleryItem[] = [];
        snapshot.forEach((d) => remoteGallery.push(d.data() as GalleryItem));
        state = {
          ...state,
          gallery: remoteGallery,
          firebaseSyncStatus: 'connected',
          lastSyncedAt: new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.GALLERY, remoteGallery);
        notify();
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, galleryPath);
        } catch {}
      }
    );

    // 3. News Listener
    const newsPath = 'news';
    onSnapshot(
      collection(db, newsPath),
      (snapshot) => {
        const remoteNews: NewsArticle[] = [];
        snapshot.forEach((d) => remoteNews.push(d.data() as NewsArticle));
        state = {
          ...state,
          news: remoteNews,
          firebaseSyncStatus: 'connected',
          lastSyncedAt: new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.NEWS, remoteNews);
        notify();
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, newsPath);
        } catch {}
      }
    );

    // 4. Testimonials Listener
    const testimonialsPath = 'testimonials';
    onSnapshot(
      collection(db, testimonialsPath),
      (snapshot) => {
        const remoteTestimonials: TestimonialSlot[] = [];
        snapshot.forEach((d) => remoteTestimonials.push(normalizeTestimonialRecord(d.data() as TestimonialSlot)));
        remoteTestimonials.sort((a, b) => a.slotId - b.slotId);
        state = {
          ...state,
          testimonials: remoteTestimonials,
          firebaseSyncStatus: 'connected',
          lastSyncedAt: new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.TESTIMONIALS, remoteTestimonials);
        notify();
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, testimonialsPath);
        } catch {}
      }
    );

    // 5. Social Posts Listener (Fix: Never auto-seed if empty! Preserves user deletions!)
    const socialPath = 'socialPosts';
    onSnapshot(
      collection(db, socialPath),
      (snapshot) => {
        const remoteSocial: SocialPost[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as SocialPost;
          remoteSocial.push({ ...data, id: data.id || d.id });
        });
        state = {
          ...state,
          socialPosts: remoteSocial,
          firebaseSyncStatus: 'connected',
          lastSyncedAt: new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.SOCIAL, remoteSocial);
        notify();
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, socialPath);
        } catch {}
      }
    );

    // 6. Site Settings Listener
    const settingsPath = 'settings/site_settings';
    onSnapshot(
      doc(db, 'settings', 'site_settings'),
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteSettings = snapshot.data() as SiteSettings;
          state = {
            ...state,
            settings: { ...INITIAL_SITE_SETTINGS, ...remoteSettings },
            firebaseSyncStatus: 'connected',
            lastSyncedAt: new Date().toISOString(),
          };
          saveToStorage(STORAGE_KEYS.SETTINGS, state.settings);
          notify();
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, settingsPath);
        } catch {}
      }
    );
  } catch (err) {
    console.error('Failed to initialize Firestore sync listeners:', err);
    state = { ...state, firebaseSyncStatus: 'offline' };
    notify();
  }
}

// Start listeners immediately
initFirestoreSync();

// CMS Store Methods
export const CMSStore = {
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
    state = { ...state, isAuthenticated: false, isLiveEditMode: false };
    saveToStorage(STORAGE_KEYS.AUTH, false);
    saveToStorage(STORAGE_KEYS.LIVE_EDIT, false);
    logActivity('auth', 'system', 'Admin signed out of dashboard.');
    notify();
  },

  // Live Edit Mode toggle
  toggleLiveEditMode(): boolean {
    if (!state.isAuthenticated) return false;
    const next = !state.isLiveEditMode;
    state = { ...state, isLiveEditMode: next };
    saveToStorage(STORAGE_KEYS.LIVE_EDIT, next);
    logActivity('update', 'system', `Live Edit Mode turned ${next ? 'ON' : 'OFF'}.`);
    notify();
    return next;
  },

  setLiveEditMode(enabled: boolean): void {
    if (!state.isAuthenticated && enabled) return;
    state = { ...state, isLiveEditMode: enabled };
    saveToStorage(STORAGE_KEYS.LIVE_EDIT, enabled);
    notify();
  },

  // --- EVENTS ---
  async addEvent(event: Omit<EventItem, 'id'> & { id?: string }): Promise<EventItem> {
    const newEvent: EventItem = {
      ...event,
      id: event.id || 'event-' + Date.now(),
      createdAt: new Date().toISOString(),
      isDeleted: false,
    };

    state = {
      ...state,
      events: [newEvent, ...state.events],
    };
    saveToStorage(STORAGE_KEYS.EVENTS, state.events);
    logActivity('create', 'events', `Created event: "${newEvent.title}" (${newEvent.status})`);
    notify();

    const docPath = `events/${newEvent.id}`;
    try {
      await setDoc(doc(db, 'events', newEvent.id), newEvent);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }

    return newEvent;
  },

  async updateEvent(id: string, updates: Partial<EventItem>): Promise<void> {
    state = {
      ...state,
      events: state.events.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)),
    };
    saveToStorage(STORAGE_KEYS.EVENTS, state.events);
    logActivity('update', 'events', `Updated event: "${updates.title || id}"`);
    notify();

    const docPath = `events/${id}`;
    try {
      await updateDoc(doc(db, 'events', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  async deleteEvent(id: string): Promise<void> {
    const target = state.events.find((ev) => ev.id === id);
    state = {
      ...state,
      events: state.events.filter((ev) => ev.id !== id),
    };
    saveToStorage(STORAGE_KEYS.EVENTS, state.events);
    logActivity('delete', 'events', `Permanently deleted event: "${target?.title || id}"`);
    notify();

    const docPath = `events/${id}`;
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // --- GALLERY ---
  async addGalleryItem(item: Omit<GalleryItem, 'id'> & { id?: string }): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      ...item,
      id: item.id || 'gal-' + Date.now(),
      createdAt: new Date().toISOString(),
      isDeleted: false,
    };
    state = {
      ...state,
      gallery: [newItem, ...state.gallery],
    };
    saveToStorage(STORAGE_KEYS.GALLERY, state.gallery);
    logActivity(
      'create',
      'gallery',
      `Uploaded photo to gallery: "${newItem.title}" (${newItem.category})`
    );
    notify();

    const docPath = `gallery/${newItem.id}`;
    try {
      await setDoc(doc(db, 'gallery', newItem.id), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }

    return newItem;
  },

  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<void> {
    state = {
      ...state,
      gallery: state.gallery.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    };
    saveToStorage(STORAGE_KEYS.GALLERY, state.gallery);
    logActivity('update', 'gallery', `Updated gallery item: "${updates.title || id}"`);
    notify();

    const docPath = `gallery/${id}`;
    try {
      await updateDoc(doc(db, 'gallery', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const target = state.gallery.find((it) => it.id === id);
    state = {
      ...state,
      gallery: state.gallery.filter((it) => it.id !== id),
    };
    saveToStorage(STORAGE_KEYS.GALLERY, state.gallery);
    logActivity('delete', 'gallery', `Permanently deleted gallery photo: "${target?.title || id}"`);
    notify();

    const docPath = `gallery/${id}`;
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // --- NEWS & ARTICLES ---
  async addNewsArticle(article: Omit<NewsArticle, 'id'> & { id?: string }): Promise<NewsArticle> {
    const newArticle: NewsArticle = {
      ...article,
      id: article.id || 'art-' + Date.now(),
      createdAt: new Date().toISOString(),
      isDeleted: false,
    };
    state = {
      ...state,
      news: [newArticle, ...state.news],
    };
    saveToStorage(STORAGE_KEYS.NEWS, state.news);
    logActivity('create', 'news', `Published news article: "${newArticle.title}"`);
    notify();

    const docPath = `news/${newArticle.id}`;
    try {
      await setDoc(doc(db, 'news', newArticle.id), newArticle);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }

    return newArticle;
  },

  async updateNewsArticle(id: string, updates: Partial<NewsArticle>): Promise<void> {
    state = {
      ...state,
      news: state.news.map((art) => (art.id === id ? { ...art, ...updates } : art)),
    };
    saveToStorage(STORAGE_KEYS.NEWS, state.news);
    logActivity('update', 'news', `Updated news article: "${updates.title || id}"`);
    notify();

    const docPath = `news/${id}`;
    try {
      await updateDoc(doc(db, 'news', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  async deleteNewsArticle(id: string): Promise<void> {
    const target = state.news.find((art) => art.id === id);
    state = {
      ...state,
      news: state.news.filter((art) => art.id !== id),
    };
    saveToStorage(STORAGE_KEYS.NEWS, state.news);
    logActivity('delete', 'news', `Permanently deleted news article: "${target?.title || id}"`);
    notify();

    const docPath = `news/${id}`;
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // --- TESTIMONIALS ---
  async addTestimonial(
    testimonial: Omit<TestimonialSlot, 'slotId'> & { slotId?: number }
  ): Promise<TestimonialSlot> {
    const maxSlot = state.testimonials.reduce((max, t) => Math.max(max, t.slotId), 0);
    const newSlot: TestimonialSlot = normalizeTestimonialRecord({
      ...testimonial,
      slotId: testimonial.slotId || maxSlot + 1,
      createdAt: new Date().toISOString(),
      isDeleted: false,
      name: testimonial.studentName || testimonial.name || testimonial.label,
      quote: testimonial.experienceText || testimonial.quote || '',
      yearOrCohort: testimonial.cohort || testimonial.yearOrCohort || 'Cohort 01',
    });
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

    const docPath = `testimonials/${newSlot.slotId}`;
    try {
      await setDoc(doc(db, 'testimonials', String(newSlot.slotId)), newSlot);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }

    return newSlot;
  },

  async updateTestimonial(slotId: number, updates: Partial<TestimonialSlot>): Promise<void> {
    const updatedTestimonials = state.testimonials.map((t) => {
      if (t.slotId !== slotId) return t;
      const merged = normalizeTestimonialRecord({ ...t, ...updates, slotId });
      return {
        ...merged,
        name: merged.studentName || merged.name || merged.label,
        quote: merged.experienceText || merged.quote || '',
        yearOrCohort: merged.cohort || merged.yearOrCohort || 'Cohort 01',
      };
    });
    state = {
      ...state,
      testimonials: updatedTestimonials,
    };
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, state.testimonials);
    logActivity(
      'update',
      'testimonials',
      `Updated testimonial Slot #${slotId}: "${updates.studentName || updates.label || 'Candidate'}"`
    );
    notify();

    const docPath = `testimonials/${slotId}`;
    try {
      await updateDoc(doc(db, 'testimonials', String(slotId)), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  async deleteTestimonial(slotId: number): Promise<void> {
    state = {
      ...state,
      testimonials: state.testimonials.filter((t) => t.slotId !== slotId),
    };
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, state.testimonials);
    logActivity('delete', 'testimonials', `Permanently deleted testimonial Slot #${slotId}`);
    notify();

    const docPath = `testimonials/${slotId}`;
    try {
      await deleteDoc(doc(db, 'testimonials', String(slotId)));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  },

  // --- SITE SETTINGS ---
  async updateSiteSettings(updates: Partial<SiteSettings>): Promise<void> {
    const updatedSettings = { ...state.settings, ...updates };
    state = {
      ...state,
      settings: updatedSettings,
    };
    saveToStorage(STORAGE_KEYS.SETTINGS, state.settings);
    logActivity('update', 'settings', 'Updated website general configurations & banner.');
    notify();

    const docPath = 'settings/site_settings';
    try {
      await setDoc(doc(db, 'settings', 'site_settings'), updatedSettings, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  },

  // In-page quick section helpers
  async updateHeroSettings(updates: Partial<SiteSettings>): Promise<void> {
    await this.updateSiteSettings(updates);
    logActivity('update', 'settings', 'Updated Hero section content in-place.');
  },

  async updateFooterSettings(updates: Partial<SiteSettings>): Promise<void> {
    await this.updateSiteSettings(updates);
    logActivity('update', 'settings', 'Updated Footer links and details in-place.');
  },

  async updateSocialConfig(updates: Partial<SiteSettings>): Promise<void> {
    await this.updateSiteSettings(updates);
    logActivity('update', 'social', 'Updated social channels and handles configuration.');
  },

  // --- SOCIAL MEDIA POSTS & LIVE FEEDS ---
  async addSocialPost(post: Omit<SocialPost, 'id' | 'createdAt'>): Promise<SocialPost> {
    const newPost: SocialPost = {
      ...post,
      id: 'sp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      isPublished: post.isPublished !== undefined ? post.isPublished : true,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };
    state = {
      ...state,
      socialPosts: [newPost, ...state.socialPosts],
    };
    saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
    logActivity(
      'create',
      'social',
      `Added ${post.platform} social post: "${post.caption.substring(0, 40)}..."`
    );
    notify();

    const docPath = `socialPosts/${newPost.id}`;
    try {
      await setDoc(doc(db, 'socialPosts', newPost.id), newPost);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }

    return newPost;
  },

  async updateSocialPost(id: string, updates: Partial<SocialPost>): Promise<boolean> {
    const exists = state.socialPosts.some((p) => p.id === id);
    if (!exists) return false;
    state = {
      ...state,
      socialPosts: state.socialPosts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    };
    saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
    logActivity('update', 'social', `Updated social post ID #${id}`);
    notify();

    const docPath = `socialPosts/${id}`;
    try {
      await updateDoc(doc(db, 'socialPosts', id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }

    return true;
  },

  async deleteSocialPost(id: string): Promise<boolean> {
    const strId = String(id).trim();
    const post = state.socialPosts.find((p) => String(p.id).trim() === strId);

    // Immediately remove from reactive state and cache
    state = {
      ...state,
      socialPosts: state.socialPosts.filter((p) => String(p.id).trim() !== strId),
    };
    saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
    if (post) {
      logActivity(
        'delete',
        'social',
        `Permanently deleted ${post.platform} post: "${post.caption.substring(0, 30)}..."`
      );
    }
    notify();

    const docPath = `socialPosts/${strId}`;
    try {
      await deleteDoc(doc(db, 'socialPosts', strId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }

    return true;
  },

  async togglePinSocialPost(id: string): Promise<boolean> {
    const strId = String(id).trim();
    const post = state.socialPosts.find((p) => String(p.id).trim() === strId);
    if (!post) return false;
    const newPinned = !post.isPinned;
    return this.updateSocialPost(strId, { isPinned: newPinned });
  },

  async togglePublishSocialPost(id: string): Promise<boolean> {
    const strId = String(id).trim();
    const post = state.socialPosts.find((p) => String(p.id).trim() === strId);
    if (!post) return false;
    const newPub = !post.isPublished;
    return this.updateSocialPost(strId, { isPublished: newPub });
  },

  // --- TRASH & RECYCLE BIN OPERATIONS ---
  async moveToTrash(
    module: 'social' | 'events' | 'gallery' | 'news' | 'testimonials',
    id: string | number
  ): Promise<boolean> {
    const deletedAt = new Date().toISOString();
    const strId = String(id).trim();

    if (module === 'social') {
      const target = state.socialPosts.find((p) => String(p.id).trim() === strId);
      if (!target) return false;
      state = {
        ...state,
        socialPosts: state.socialPosts.map((p) =>
          String(p.id).trim() === strId ? { ...p, isDeleted: true, deletedAt } : p
        ),
      };
      saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
      logActivity('delete', 'social', `Moved social post to Trash: "${target.caption.slice(0, 30)}..."`);
      notify();
      try {
        await setDoc(doc(db, 'socialPosts', strId), { ...target, isDeleted: true, deletedAt }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `socialPosts/${strId}`);
      }
      return true;
    }

    if (module === 'events') {
      const target = state.events.find((e) => e.id === strId);
      if (!target) return false;
      state = {
        ...state,
        events: state.events.map((e) =>
          e.id === strId ? { ...e, isDeleted: true, deletedAt } : e
        ),
      };
      saveToStorage(STORAGE_KEYS.EVENTS, state.events);
      logActivity('delete', 'events', `Moved event to Trash: "${target.title}"`);
      notify();
      try {
        await setDoc(doc(db, 'events', strId), { ...target, isDeleted: true, deletedAt }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `events/${strId}`);
      }
      return true;
    }

    if (module === 'gallery') {
      const target = state.gallery.find((g) => g.id === strId);
      if (!target) return false;
      state = {
        ...state,
        gallery: state.gallery.map((g) =>
          g.id === strId ? { ...g, isDeleted: true, deletedAt } : g
        ),
      };
      saveToStorage(STORAGE_KEYS.GALLERY, state.gallery);
      logActivity('delete', 'gallery', `Moved photo to Trash: "${target.title}"`);
      notify();
      try {
        await setDoc(doc(db, 'gallery', strId), { ...target, isDeleted: true, deletedAt }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `gallery/${strId}`);
      }
      return true;
    }

    if (module === 'news') {
      const target = state.news.find((n) => n.id === strId);
      if (!target) return false;
      state = {
        ...state,
        news: state.news.map((n) =>
          n.id === strId ? { ...n, isDeleted: true, deletedAt } : n
        ),
      };
      saveToStorage(STORAGE_KEYS.NEWS, state.news);
      logActivity('delete', 'news', `Moved article to Trash: "${target.title}"`);
      notify();
      try {
        await setDoc(doc(db, 'news', strId), { ...target, isDeleted: true, deletedAt }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `news/${strId}`);
      }
      return true;
    }

    if (module === 'testimonials') {
      const numId = Number(id);
      const target = state.testimonials.find((t) => t.slotId === numId);
      if (!target) return false;
      state = {
        ...state,
        testimonials: state.testimonials.map((t) =>
          t.slotId === numId ? { ...t, isDeleted: true, deletedAt } : t
        ),
      };
      saveToStorage(STORAGE_KEYS.TESTIMONIALS, state.testimonials);
      logActivity('delete', 'testimonials', `Moved testimonial Slot #${numId} to Trash`);
      notify();
      try {
        await setDoc(doc(db, 'testimonials', strId), { ...target, isDeleted: true, deletedAt }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `testimonials/${strId}`);
      }
      return true;
    }

    return false;
  },

  async restoreFromTrash(
    module: 'social' | 'events' | 'gallery' | 'news' | 'testimonials',
    id: string | number
  ): Promise<boolean> {
    const strId = String(id);

    if (module === 'social') {
      const target = state.socialPosts.find((p) => p.id === strId);
      if (!target) return false;
      state = {
        ...state,
        socialPosts: state.socialPosts.map((p) =>
          p.id === strId ? { ...p, isDeleted: false, deletedAt: null } : p
        ),
      };
      saveToStorage(STORAGE_KEYS.SOCIAL, state.socialPosts);
      logActivity('update', 'social', `Restored social post from Trash: "${target.caption.slice(0, 30)}..."`);
      notify();
      try {
        await setDoc(doc(db, 'socialPosts', strId), { isDeleted: false, deletedAt: null }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `socialPosts/${strId}`);
      }
      return true;
    }

    if (module === 'events') {
      const target = state.events.find((e) => e.id === strId);
      if (!target) return false;
      state = {
        ...state,
        events: state.events.map((e) =>
          e.id === strId ? { ...e, isDeleted: false, deletedAt: null } : e
        ),
      };
      saveToStorage(STORAGE_KEYS.EVENTS, state.events);
      logActivity('update', 'events', `Restored event from Trash: "${target.title}"`);
      notify();
      try {
        await setDoc(doc(db, 'events', strId), { isDeleted: false, deletedAt: null }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `events/${strId}`);
      }
      return true;
    }

    if (module === 'gallery') {
      const target = state.gallery.find((g) => g.id === strId);
      if (!target) return false;
      state = {
        ...state,
        gallery: state.gallery.map((g) =>
          g.id === strId ? { ...g, isDeleted: false, deletedAt: null } : g
        ),
      };
      saveToStorage(STORAGE_KEYS.GALLERY, state.gallery);
      logActivity('update', 'gallery', `Restored photo from Trash: "${target.title}"`);
      notify();
      try {
        await setDoc(doc(db, 'gallery', strId), { isDeleted: false, deletedAt: null }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `gallery/${strId}`);
      }
      return true;
    }

    if (module === 'news') {
      const target = state.news.find((n) => n.id === strId);
      if (!target) return false;
      state = {
        ...state,
        news: state.news.map((n) =>
          n.id === strId ? { ...n, isDeleted: false, deletedAt: null } : n
        ),
      };
      saveToStorage(STORAGE_KEYS.NEWS, state.news);
      logActivity('update', 'news', `Restored article from Trash: "${target.title}"`);
      notify();
      try {
        await setDoc(doc(db, 'news', strId), { isDeleted: false, deletedAt: null }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `news/${strId}`);
      }
      return true;
    }

    if (module === 'testimonials') {
      const numId = Number(id);
      const target = state.testimonials.find((t) => t.slotId === numId);
      if (!target) return false;
      state = {
        ...state,
        testimonials: state.testimonials.map((t) =>
          t.slotId === numId ? { ...t, isDeleted: false, deletedAt: null } : t
        ),
      };
      saveToStorage(STORAGE_KEYS.TESTIMONIALS, state.testimonials);
      logActivity('update', 'testimonials', `Restored testimonial Slot #${numId} from Trash`);
      notify();
      try {
        await setDoc(doc(db, 'testimonials', strId), { isDeleted: false, deletedAt: null }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `testimonials/${strId}`);
      }
      return true;
    }

    return false;
  },

  async permanentlyDelete(
    module: 'social' | 'events' | 'gallery' | 'news' | 'testimonials',
    id: string | number
  ): Promise<boolean> {
    const strId = String(id);
    if (module === 'social') return this.deleteSocialPost(strId);
    if (module === 'events') {
      await this.deleteEvent(strId);
      return true;
    }
    if (module === 'gallery') {
      await this.deleteGalleryItem(strId);
      return true;
    }
    if (module === 'news') {
      await this.deleteNewsArticle(strId);
      return true;
    }
    if (module === 'testimonials') {
      await this.deleteTestimonial(Number(id));
      return true;
    }
    return false;
  },

  getTrashItems(): TrashItem[] {
    const items: TrashItem[] = [];

    state.socialPosts
      .filter((p) => p.isDeleted)
      .forEach((p) => {
        items.push({
          id: p.id,
          module: 'social',
          title: p.caption ? p.caption.slice(0, 60) : 'Social Media Update',
          subtitle: `${p.platform.toUpperCase()} post by ${p.authorName}`,
          deletedAt: p.deletedAt || p.createdAt || new Date().toISOString(),
          platform: p.platform,
          originalData: p,
        });
      });

    state.events
      .filter((e) => e.isDeleted)
      .forEach((e) => {
        items.push({
          id: e.id,
          module: 'events',
          title: e.title,
          subtitle: `${e.date} • ${e.venue}`,
          deletedAt: e.deletedAt || e.createdAt || new Date().toISOString(),
          originalData: e,
        });
      });

    state.gallery
      .filter((g) => g.isDeleted)
      .forEach((g) => {
        items.push({
          id: g.id,
          module: 'gallery',
          title: g.title,
          subtitle: `${g.category} • ${g.year}`,
          deletedAt: g.deletedAt || g.createdAt || new Date().toISOString(),
          originalData: g,
        });
      });

    state.news
      .filter((n) => n.isDeleted)
      .forEach((n) => {
        items.push({
          id: n.id,
          module: 'news',
          title: n.title,
          subtitle: `${n.category} • ${n.date}`,
          deletedAt: n.deletedAt || n.createdAt || new Date().toISOString(),
          originalData: n,
        });
      });

    state.testimonials
      .filter((t) => t.isDeleted)
      .forEach((t) => {
        items.push({
          id: String(t.slotId),
          module: 'testimonials',
          title: t.studentName || t.label,
          subtitle: `Slot #${t.slotId} • ${t.trackOrProgramme || 'Trainee'}`,
          deletedAt: t.deletedAt || t.createdAt || new Date().toISOString(),
          originalData: t,
        });
      });

    return items.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());
  },

  async emptyTrash(module?: 'social' | 'events' | 'gallery' | 'news' | 'testimonials'): Promise<number> {
    const trashList = this.getTrashItems().filter((item) => (!module ? true : item.module === module));
    for (const item of trashList) {
      await this.permanentlyDelete(item.module, item.id);
    }
    logActivity('delete', 'system', `Emptied trash (${trashList.length} items permanently removed).`);
    return trashList.length;
  },

  // --- FILTERED ACTIVE QUERIES (Excludes Trashed Items) ---
  getActiveSocialPosts(): SocialPost[] {
    return state.socialPosts
      .filter((p) => !p.isDeleted && p.isPublished !== false)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  },

  getActiveEvents(statusFilter?: 'upcoming' | 'ongoing' | 'past'): EventItem[] {
    const list = state.events.filter((e) => !e.isDeleted);
    const filtered = statusFilter ? list.filter((e) => e.status === statusFilter) : list;
    return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getActiveGallery(categoryFilter?: string): GalleryItem[] {
    const list = state.gallery.filter((g) => !g.isDeleted);
    return categoryFilter && categoryFilter !== 'all'
      ? list.filter((g) => g.category.toLowerCase() === categoryFilter.toLowerCase())
      : list;
  },

  getActiveNews(): NewsArticle[] {
    return state.news.filter((n) => !n.isDeleted);
  },

  getActiveTestimonials(): TestimonialSlot[] {
    return state.testimonials
      .filter((t) => !t.isDeleted)
      .sort((a, b) => a.slotId - b.slotId);
  },

  // --- QUERY RETRIEVAL METHODS ---
  getEventById(id: string): EventItem | undefined {
    return state.events.find((e) => e.id === id);
  },

  getGalleryById(id: string): GalleryItem | undefined {
    return state.gallery.find((g) => g.id === id);
  },

  getNewsById(id: string): NewsArticle | undefined {
    return state.news.find((n) => n.id === id);
  },

  getSocialPostById(id: string): SocialPost | undefined {
    return state.socialPosts.find((p) => p.id === id);
  },

  getPublishedSocialPosts(): SocialPost[] {
    return this.getActiveSocialPosts();
  },

  getEventsSorted(statusFilter?: 'upcoming' | 'ongoing' | 'past'): EventItem[] {
    return this.getActiveEvents(statusFilter);
  },

  // --- BACKUP & RESTORE ---
  exportBackupJSON(): string {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      institution: 'Jain Genius — The Change Makers',
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

  async importBackupJSON(jsonStr: string): Promise<{ success: boolean; message: string }> {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.data) {
        throw new Error('Invalid backup schema: missing root data property.');
      }
      const { events, gallery, news, testimonials, settings, socialPosts } = parsed.data;

      const batch = writeBatch(db);

      if (events && Array.isArray(events)) {
        state.events = events;
        saveToStorage(STORAGE_KEYS.EVENTS, events);
        events.forEach((ev) => batch.set(doc(db, 'events', ev.id), ev));
      }
      if (gallery && Array.isArray(gallery)) {
        state.gallery = gallery;
        saveToStorage(STORAGE_KEYS.GALLERY, gallery);
        gallery.forEach((it) => batch.set(doc(db, 'gallery', it.id), it));
      }
      if (news && Array.isArray(news)) {
        state.news = news;
        saveToStorage(STORAGE_KEYS.NEWS, news);
        news.forEach((art) => batch.set(doc(db, 'news', art.id), art));
      }
      if (testimonials && Array.isArray(testimonials)) {
        state.testimonials = testimonials;
        saveToStorage(STORAGE_KEYS.TESTIMONIALS, testimonials);
        testimonials.forEach((t) => batch.set(doc(db, 'testimonials', String(t.slotId)), t));
      }
      if (settings) {
        state.settings = settings;
        saveToStorage(STORAGE_KEYS.SETTINGS, settings);
        batch.set(doc(db, 'settings', 'site_settings'), settings);
      }
      if (socialPosts && Array.isArray(socialPosts)) {
        state.socialPosts = socialPosts;
        saveToStorage(STORAGE_KEYS.SOCIAL, socialPosts);
        socialPosts.forEach((p) => batch.set(doc(db, 'socialPosts', p.id), p));
      }

      await batch.commit();

      logActivity('import', 'system', 'Restored website data from uploaded JSON backup into Firestore.');
      notify();
      return {
        success: true,
        message: 'All website information successfully imported, synced to Firestore and restored.',
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to parse JSON backup file.' };
    }
  },

  async resetToFactoryDefaults(): Promise<void> {
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

    try {
      const batch = writeBatch(db);
      EVENTS_DATA.forEach((ev) => batch.set(doc(db, 'events', ev.id), ev));
      GALLERY_ITEMS.forEach((it) => batch.set(doc(db, 'gallery', it.id), it));
      INITIAL_NEWS_ARTICLES.forEach((art) => batch.set(doc(db, 'news', art.id), art));
      TESTIMONIAL_SLOTS.forEach((t) => batch.set(doc(db, 'testimonials', String(t.slotId)), t));
      INITIAL_SOCIAL_POSTS.forEach((p) => batch.set(doc(db, 'socialPosts', p.id), p));
      batch.set(doc(db, 'settings', 'site_settings'), INITIAL_SITE_SETTINGS);
      batch.set(doc(db, 'settings', 'cms_meta'), {
        initialized: true,
        seededAt: new Date().toISOString(),
      });
      await batch.commit();
    } catch (err) {
      console.warn('Batch reset to Firestore:', err);
    }

    logActivity(
      'reset',
      'system',
      'Reset all public website collections and synced factory seeds to Firestore.'
    );
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
    toggleLiveEditMode: CMSStore.toggleLiveEditMode,
    setLiveEditMode: CMSStore.setLiveEditMode,
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
    updateHeroSettings: CMSStore.updateHeroSettings,
    updateFooterSettings: CMSStore.updateFooterSettings,
    updateSocialConfig: CMSStore.updateSocialConfig,
    addSocialPost: CMSStore.addSocialPost,
    updateSocialPost: CMSStore.updateSocialPost,
    deleteSocialPost: CMSStore.deleteSocialPost,
    togglePinSocialPost: CMSStore.togglePinSocialPost,
    togglePublishSocialPost: CMSStore.togglePublishSocialPost,
    // Trash & Recycle Bin
    moveToTrash: CMSStore.moveToTrash,
    restoreFromTrash: CMSStore.restoreFromTrash,
    permanentlyDelete: CMSStore.permanentlyDelete,
    emptyTrash: CMSStore.emptyTrash,
    getTrashItems: CMSStore.getTrashItems,
    // Filtered queries
    getActiveSocialPosts: CMSStore.getActiveSocialPosts,
    getActiveEvents: CMSStore.getActiveEvents,
    getActiveGallery: CMSStore.getActiveGallery,
    getActiveNews: CMSStore.getActiveNews,
    getActiveTestimonials: CMSStore.getActiveTestimonials,
    exportBackupJSON: CMSStore.exportBackupJSON,
    importBackupJSON: CMSStore.importBackupJSON,
    resetToFactoryDefaults: CMSStore.resetToFactoryDefaults,
    getEventById: CMSStore.getEventById,
    getGalleryById: CMSStore.getGalleryById,
    getNewsById: CMSStore.getNewsById,
    getSocialPostById: CMSStore.getSocialPostById,
    getPublishedSocialPosts: CMSStore.getPublishedSocialPosts,
    getEventsSorted: CMSStore.getEventsSorted,
  };
}

// Utility: File to compressed base64 data URL
export function convertImageFileToBase64(
  file: File,
  maxDimension = 1200,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
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
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(readerEvent.target?.result as string);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
