/* View-model for the Version A desktop-OS home. Composes content that
   already exists (featured-work.ts + the site metadata) into the "files"
   the desktop opens. NOT a new content system — no case-study text lives
   here, only labels and the bio, and work is re-exported as-is. */

import { featuredWork } from '@/content/featured-work';

export { featuredWork };

/* Real routes that already exist under /a — every file below maps to one,
   so the OS metaphor never becomes the only path to a section. */
export const PROFILE = {
  name: 'Ihor Chivrich',
  role: 'Product Designer',
  bio: [
    'I’m Ihor Chivrich, a product designer working with fintech, SaaS, and AI startups.',
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

export const DEFAULT_LAYOUT: Record<WindowId, WindowLayout> = {
  about: { x: 34, y: 24, w: 384 },
  work: { x: 452, y: 96, w: 432 },
  playground: { x: 470, y: 120, w: 384 },
};

/* Which windows are open on first paint, back-to-front. About is pre-opened
   so the 3-second read needs no click. */
export const INITIAL_OPEN: WindowId[] = ['about'];
