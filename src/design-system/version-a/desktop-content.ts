/* View-model for the Version A desktop-OS home. Composes content that
   already exists (featured-work.ts + the site metadata) into the "files"
   the desktop opens. NOT a new content system — no case-study text lives
   here, only labels and the bio, and work is re-exported as-is. */

import { featuredWork } from '@/content/featured-work';

export { featuredWork };

/* Real routes that already exist under /a — every file below maps to one,
   so the OS metaphor never becomes the only path to a section. */
export const PROFILE = {
  name: 'Ihor Khivrych',
  role: 'Product Designer',
  bio: [
    'I’m Ihor Khivrych, a product designer working with fintech, SaaS, and AI startups.',
    'I design and ship — research, UX, UI, and increasingly the code itself. Selected work is in the dock below; open a file to look around.',
  ],
  availability: 'Available for select freelance work.',
} as const;

export type WindowId = 'about' | 'work' | 'playground';

export interface DesktopFile {
  id: WindowId;
  label: string;
  /** Short mono line shown under the label in the finder list. */
  hint: string;
  /** Real destination if the visitor bypasses the OS entirely. */
  href: string;
}

export const DESKTOP_FILES: DesktopFile[] = [
  { id: 'about', label: 'About', hint: 'Who I am, what I do', href: '/a/about' },
  { id: 'work', label: 'Selected Work', hint: '3 case studies', href: '/a' },
  { id: 'playground', label: 'Playground', hint: 'Experiments & notes', href: '/a/playground' },
];

export const PLAYGROUND = {
  blurb:
    'Experiments, prototypes, and process notes — the half-finished things that don’t fit a case study. Still being written.',
  href: '/a/playground',
} as const;

/* Default on-canvas geometry (desktop only; mobile goes full-screen via CSS).
   Deterministic numbers so server and client render identically. */
export interface WindowLayout {
  x: number;
  y: number;
  w: number;
}

/* Kept clear of the file list (top-left, ~256px wide, ~170px tall) and
   spread apart from one another so the two pre-opened windows never start
   stacked on load — see Decisions.md, window-overlap fix. */
export const DEFAULT_LAYOUT: Record<WindowId, WindowLayout> = {
  about: { x: 288, y: 96, w: 384 },
  work: { x: 704, y: 156, w: 400 },
  playground: { x: 460, y: 460, w: 380 },
};

/* Which windows are open on first paint, back-to-front. About is pre-opened
   so the 3-second read needs no click; deterministic for SSR. Desktop
   viewports additionally auto-open Selected Work client-side (see
   Desktop.tsx) so the canvas reads as an active desktop rather than an
   empty one — mobile stays single-sheet so About is never buried under a
   second full-screen window with no way back to the file list. */
export const INITIAL_OPEN: WindowId[] = ['about'];

/** Min viewport width for the Selected Work auto-open, mirrored from the
 * `sm`→desktop switch this file already uses (Desktop.module.css `.desktop`
 * drops the mobile sheet layout above 640px, but windows need real room to
 * sit side by side, hence the wider gate here). */
export const AUTO_OPEN_MIN_WIDTH = 1024;
