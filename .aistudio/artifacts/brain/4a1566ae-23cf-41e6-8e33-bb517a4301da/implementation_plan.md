# Admin Live Customization, In-Page Editing & Cloud Persistence Architecture

A comprehensive dual-mode content management system enabling administrators to customize every frontend section (Hero, Socials, Events, Gallery, Testimonials, News, and Footer) both in-place via live on-page controls and through the centralized Admin Dashboard, backed by permanent Cloud Firestore synchronization with an instant trash and restore mechanism.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification and govern the implementation:

- **Confirmed Mode**: Dual mode — admins can toggle an **In-Page Live Edit Mode** with floating action triggers and contextual edit buttons directly over page components, as well as access the dedicated **Admin Dashboard** for batch management.
- **Confirmed Deletion & Restore Behavior**: Instant removal from public views with a **Trash & Recycle Bin** where deleted items (social posts, events, gallery pictures, announcements) can be viewed, restored with a single click, or permanently purged.
- **Confirmed Scope of Customization**: Every frontend section — **Hero banner & headlines**, **Social media feed & links**, **Events**, **Gallery captures**, **Impact / Testimonials**, **News articles**, and **Footer credits / contacts** — will support live editing and instant cloud persistence.
- **Root-Cause Fix for Cloud Persistence**: Previously, when all items in a collection were deleted, the auto-seeding logic would re-populate the collection on page refresh. We will introduce explicit metadata tracking (`_metadata/seeding_status`) and soft-delete/tombstone flags (`isDeleted: true`, `deletedAt`) so deletions remain permanent across all subsequent browser refreshes, tabs, and client devices.

---

## 1. Overview & Core Concept

### What It Does
Empowers Jain Genius community administrators to modify any visual element or data record across the platform without touching code or relying on manual JSON edits. Changes made—whether rephrasing the Hero headline, changing helpline numbers, updating social media URLs, or removing an outdated Instagram card—save immediately to Cloud Firestore and synchronize in real time across all connected clients.

### Target Audience & Persona
- **Organization Admins & Content Curators**: Need to update announcements, post social feeds, remove expired events, and tweak hero copy without technical complexity.
- **Public Visitors & Youth Members**: Experience a fast, pristine, culturally authentic site reflecting current announcements and active social feeds.

### Key Value
1. **True Cloud Authority**: Deletions and edits persist forever in Cloud Firestore; no resurrected mock posts or unwanted default re-seeding upon refresh.
2. **Effortless In-Context Editing**: Admins can browse the live site naturally, spot a typo in the Hero or an outdated link in the Footer, click the in-page edit button, and save immediately.
3. **Safety & Trash Recovery**: Accidental deletions can be reversed instantly from the Trash drawer without database surgery or data loss.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Admin In-Page Live Edit Flow**:
   - Admin logs in via the floating Admin trigger or `/admin` modal.
   - A discreet **"Live Edit"** floating toolbar appears at the top/bottom right with a switch: `[Viewing Site] <-> [Live Editing On]`.
   - In Live Edit mode, editable sections display refined, non-intrusive dotted outline accents and quick-action tooltips:
     - **Hero Section**: Quick-edit button to modify headline, sub-headline, admission notice banner, and CTA links.
     - **Social Media Grid**: Each post card displays a hover overlay with `[Edit]`, `[Pin]`, and `[Move to Trash]` actions; an "+ Add Social Post" tile allows adding Instagram reels, YouTube videos, X links, and WhatsApp groups directly into the grid.
     - **Events & Gallery**: Direct in-card edit dialogs and "Add Item" prompts.
     - **Footer**: In-place edit trigger for helpline, email, venue address, and designer credit.
   - Clicking any edit trigger opens a streamlined sliding drawer or glassmorphic modal with instant validation and a "Save to Cloud" button.

2. **Deletion & Trash Restore Flow**:
   - Admin clicks `[Delete / Trash]` on a social post, event, or gallery photo.
   - The item immediately animates out with an interactive toast: *"Post moved to Trash. [Undo]"*.
   - The live page updates instantly, and Firestore marks the record as deleted (`isDeleted: true`, `deletedAt: timestamp`).
   - The Admin can open the **"Trash & Recovery Bin"** (accessible from both the live floating bar and Admin Dashboard) to review all deleted items across all modules, restore any item with one click, or choose to permanently erase it.

3. **Admin Dashboard Flow**:
   - Full overview with tabbed management: *Overview*, *Hero & Site Settings*, *Social Media Feed*, *Events*, *Gallery*, *News*, *Testimonials*, *Trash Bin*, and *Audit Logs*.
   - One-click cloud status indicator displaying connection latency and real-time Firestore sync status.

### Visual Identity & Anti-Slop Principles
- **Color Palette**: Respects the cultural institution aesthetic: Archival warm alabaster background (`#FBF9F5` / `#FAF8F5`), refined stone borders (`#E7E5E4`), deep antique charcoal text (`#1C1917`), and auspicious saffron/bronze accents (`#D97706`, `#B45309`).
- **Zero-Pill Restraint**: Metadata (dates, categories, author handles) rendered as crisp unboxed text with subtle typographic separators (`·` or `/`), never floating generic pills.
- **Admin Overlays**: Elegant slate/zinc neutral overlays (`bg-stone-900/90 text-stone-100`) with high contrast, sharp geometric borders, and crisp iconography (Lucide icons).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Soft-Delete with Trash Bin vs. Hard Cloud Deletion
- **Chosen Approach**: Soft deletion with a standardized `isDeleted: boolean`, `deletedAt: string`, and `deletedBy: string` schema, coupled with an active Trash view in both the live bar and dashboard.
- **Why**: Allows instant undo, accidental deletion recovery, and audit tracking. Ensures Firestore queries filter out deleted items cleanly (`isDeleted != true`) without breaking references. Permanent purge is available in the Trash view when admins truly wish to delete the document permanently via Firestore `deleteDoc`.
- **Alternatives Considered**: Hard deletion only (`deleteDoc`). Rejected because the user specifically requested *"instant removal with trash restore option"*.

### Decision 2: Prevention of Accidental Auto-Seed Overwrites
- **Chosen Approach**: Introduce a dedicated Firestore configuration flag `settings/cms_initialization` that records `seeded: true`. When a collection becomes empty because an admin deliberately trashed or removed all items, the application checks this flag and NEVER re-seeds sample items.
- **Why**: Eliminates the bug where deleting all social media cards caused the hardcoded initial data to reappear on page reload.

### Decision 3: Dual In-Page & Dashboard Architecture
- **Chosen Approach**: A unified `LiveEditContext` with a floating Admin Bar that wraps the entire application. When enabled, each section component conditionally renders contextual edit trigger buttons. Clicking them invokes dedicated section editor modals wired to the same `cmsStore` methods used by the full Admin Dashboard.
- **Why**: Provides maximum convenience for visual adjustments while preserving full bulk management in the dashboard.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND APPLICATION                            │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 Admin Floating Action Bar                      │   │
│   │   [Mode: Live Edit / Preview]  [Trash Bin (count)]  [Dashboard] │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Editable Sections (Hero, Socials, Events, Gallery, Footer)    │   │
│   │   ├── Section Content Display (filters out isDeleted == true)  │   │
│   │   └── In-Page Contextual Edit / Trash Triggers (when Admin)   │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                   │                                    │
│                                   ▼                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │           Unified CMS Store & State Management                 │   │
│   │    - updateSection(section, data)                              │   │
│   │    - moveToTrash(collection, id)                               │   │
│   │    - restoreFromTrash(collection, id)                          │   │
│   │    - permanentlyDelete(collection, id)                         │   │
│   │    - Real-time onSnapshot listeners                            │   │
│   └────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Real-time bi-directional sync
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        CLOUD FIRESTORE DB                              │
│                                                                        │
│   ├── /settings/site_settings     (Hero text, banner, footer, socials) │
│   ├── /settings/cms_meta          (Initialization flags to stop seeds) │
│   ├── /socialPosts/{postId}       (Social media items + isDeleted)     │
│   ├── /events/{eventId}           (Events data + isDeleted)            │
│   ├── /gallery/{galleryId}        (Gallery items + isDeleted)          │
│   ├── /news/{articleId}           (News articles + isDeleted)          │
│   ├── /testimonials/{slotId}      (Testimonials + isDeleted)           │
│   └── /activityLogs/{logId}       (Audit trail of all edits & trashing)│
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Enhancements

1. **Base Trashing Attributes Added to All Dynamic Entities**:
   ```typescript
   interface TrashableEntity {
     isDeleted?: boolean;       // When true, hidden from public views
     deletedAt?: string | null; // ISO timestamp
     deletedBy?: string;        // Admin user / email
   }
   ```
2. **SiteSettings Document**:
   Stores all Hero headlines, sub-taglines, admission banners, helpline numbers, email addresses, social handles/URLs, and footer credits.
3. **Firestore Security Rules**:
   Ensure `isDeleted`, `deletedAt`, and soft/hard deletes are fully permitted for site operations while maintaining strict type validations and sanitization.

### Execution Phases Following User Approval
1. **Schema & Firestore Rules Update**: Update `firebase-blueprint.json` and `firestore.rules` to permit trash fields, initialize seed guards, and deploy rules.
2. **CMS Store Overhaul (`cmsStore.ts`)**: Implement seed protection flags, soft-delete (`moveToTrash`), restore (`restoreFromTrash`), permanent purge, and live section updates.
3. **In-Page Live Edit Components**: Build `AdminLiveBar`, `InPageEditOverlay`, and section-specific quick editor sheets for Hero, Socials, Events, Gallery, Testimonials, News, and Footer.
4. **Trash & Recovery Bin Modal**: Build an interactive modal allowing admins to browse trashed items across modules, restore them instantly, or empty trash.
5. **Frontend Integration**: Hook up all main views (`Hero`, `SocialFeed`, `Events`, `Gallery`, `Footer`) to display live edit triggers when admin mode is active.
6. **Verification & Testing**: Verify that deleting social posts or modifying Hero/Footer content persists across browser refreshes and tab reloads without reverting.
