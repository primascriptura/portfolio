# DECISIONS — Portfolio

A running log of what was built and why. Append at the end of every session.

---

## Session 1 — Complete Foundation (2026-06-22)

### What was built
- Scaffolded Next.js (App Router, TypeScript, `--src-dir`, `@/*` alias, no Tailwind,
  ESLint) at `Sites/portfolio`. Landed on Next 16.2.9 + React 19.
- Installed: `next-themes`, MDX stack (`@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`,
  `@types/mdx`), `@tabler/icons-react`.
- Folder structure: `src/app/{work,work/[slug],playground,playground/[slug],about}`
  route stubs, `src/design-system/{tokens.css,components}`, `src/components`,
  `src/content/{work,playground}`, `src/styles`, `public/fonts`.
- Empty placeholder case studies: `src/content/work/{kiite,metatable,signflow}.mdx`.
- `src/design-system/tokens.css` — monochromatic token system (exact spec values).
- `src/styles/globals.css` — reset + base styles, imports tokens.
- `src/app/layout.tsx` — Libre Baskerville (display) + Inter (body) via `next/font`,
  `data-theme` theming through a `Providers` client wrapper (next-themes).
- `ThemeToggle` design-system component (sun/moon, hydration-safe `mounted` guard).
- `src/app/page.tsx` — minimal proof-of-concept: "IH" hero + "Product Designer",
  top-right ThemeToggle. CSS Module, zero hardcoded values.

### Key decisions
- **Next 16, not 15.** `create-next-app@latest` resolves to 16.2.9. Font/metadata/
  App Router APIs used here are unchanged from 15, so the spec patterns carry over.
- **`Providers` client boundary.** `next-themes` requires a client component;
  isolated in `src/app/providers.tsx` so the root layout stays a server component.
- **Generated `app/globals.css` deleted** in favor of the canonical
  `src/styles/globals.css` referenced by the spec.

### Exact next step (1 action, max 2h)
Build the persistent site chrome: a `Header`/nav design-system component
(Work · Playground · About + ThemeToggle) and a shared page layout wrapper, so
the route stubs become navigable shells.

---

## Session 2 — Navigation: IA model + floating dock (2026-06-30)

### What was built
- **IA / navigation model decided** (recorded in design-second-brain
  `projects/portfolio-site/Decisions.md`): flat hierarchy, 7 routes. Home doubles
  as the Work index (no separate `/work` index while cases < 5). Playground = a
  faceted hub with a "graduation rule" (a content type gets its own nav item only
  at ≥3 real entries). Driven by recruiter/decision-maker mental model:
  Proof → Cases → Differentiator → Contact.
- **`Dock` design-system component** (`src/design-system/components/Dock.{tsx,module.css}`)
  — floating, bottom-centered, compact, semi-transparent glass pill:
  `[IH] · Work · Playground · About · ☾`. Text labels (not icons). `usePathname`
  drives active state via `aria-current="page"`; Home/`/work/*` count as "Work".
- Added glass tokens to `tokens.css` (`--color-glass-bg`, `--color-glass-border`,
  `--blur-glass`) for both themes — required because no semi-transparent surface
  token existed.
- Mounted `<Dock />` in root `layout.tsx` (persistent across routes). Removed the
  duplicate `ThemeToggle` from Home — it now lives in the dock.
- Gave `/about` and `/playground` minimal placeholder shells via a shared
  `src/components/placeholder.module.css`, so routes are navigable, not blank.

### Key decisions
- **Floating dock, not a top header.** Per Igor's references (mobile-style,
  centered, compact, semi-transparent). One pattern serves desktop + mobile.
- **Text labels over icons.** Icons for non-standard sections (Playground) are
  ambiguous for recruiters; words scan instantly.
- **Brand wordmark hidden < 480px.** Space is tight on phones and "Work" already
  links home, so the `IH` mark is redundant there.

### Verified
Dev server (Turbopack, :3100). Checked: Home (Work active), Playground nav +
active-state move, light/dark theme glass, mobile 375px (floating with edge
margins, wordmark dropped). No console errors.

### Exact next step (1 action, max 2h)
Build the Home hero + featured-work section: positioning line (Identity.md
Variant B, trimmed) + 3 case cards (Kiite / Metatable / SignFlow), each with an
outcome one-liner. This turns Home into the real Work index the dock points to.

---

## Session 3 — Font decision: Geist + Geist Mono (2026-07-02)

### What was built
- Built a standalone comparison tool at `font-lab/index.html` (outside `src/`,
  not part of the Next build) — a realistic case-study specimen page (styled
  with the real design tokens) plus a floating tweak panel to switch between
  three candidate pairings live: Satoshi; Inter + Libre Baskerville Regular
  Italic; Geist + Geist Mono. Served via a `font-lab` entry in
  `~/.claude/launch.json` (python `http.server`).
- **Decision: Geist + Geist Mono**, applied to the real site:
  - `src/app/layout.tsx` — swapped `Libre_Baskerville` + `Inter` for `Geist`
    + `Geist_Mono` (both from `next/font/google`; confirmed available in this
    Next 16.2.9 install). Loader `variable` names reused as-is
    (`--font-body`, `--font-mono`) so no downstream CSS needed to change names.
  - `src/design-system/tokens.css` — `--font-body: 'Geist', system-ui,
    sans-serif`; `--font-display` now just aliases `var(--font-body)` (no
    separate display face — Geist covers both roles); `--font-mono: 'Geist
    Mono', 'Courier New', monospace` (was JetBrains Mono).
  - `CLAUDE.md` stack rule updated to match.
- Verified: `tsc --noEmit` clean; `next/font/google` font-data confirmed
  `Geist`/`Geist Mono` present; the already-running dev server (another
  session, port 3100) hot-reloaded on save — confirmed via curl that
  `<body>` now carries the Geist/Geist Mono variable classes, HTTP 200, no
  compile errors.

### Key decisions
- **One family for display + body, mono reserved for numerals/labels.**
  Geist Mono is scoped to eyebrows, meta labels (ROLE/TEAM/TIMELINE/STACK),
  and stat numbers — not general UI text. Matches the Claude Code /
  build-in-public positioning better than an editorial serif accent.
- **`--font-display` aliases `--font-body`** instead of loading Geist twice
  under two variable names — same font file, avoids a duplicate font request.

### Exact next step (1 action, max 2h)
Build the Home hero + featured-work section (see Session 2's next step —
still the actual next build task; this session was a font decision only).

### Cleanup (same session)
Deleted `font-lab/` now that Geist + Geist Mono is locked in and applied —
its job was done, keeping it around would just be a stray comparison tool
sitting in the repo. Removed its `font-lab` entry from `~/.claude/launch.json`
too.

---

## Session 4 — Nav to top + real Home (hero + featured work) (2026-07-02)

### What was built
- **Dock repositioned**: `src/design-system/components/Dock.module.css` —
  `bottom` swapped for `top` (same floating glass pill, same component,
  just anchored to the top of the viewport instead of the bottom).
- **Explored two Home concepts** as throwaway routes (`/concepts/work-led`,
  `/concepts/masthead`) to compare a narrow single-column layout against a
  bolder asymmetric "magazine" layout before committing either to the real
  page. Masthead was rejected on sight (didn't land visually) and deleted.
  `work-led` became the base for the real Home, then the `/concepts` route
  itself was deleted once merged — no leftover scaffolding.
- **`src/content/featured-work.ts`** — new shared data source (title, deck,
  description, outcome, meta per case) for Kiite, Metatable, SignFlow, based
  on Project-Audit.md facts. Feeds the Home cards now; will feed
  `/work/[slug]` later.
- **`src/app/page.tsx` + `page.module.css`** rebuilt from the bare
  wordmark-only placeholder into the real Home: trimmed Identity.md
  positioning line as the H1 (left-aligned, narrow `--max-w-text` column —
  jakub.kr-width, not full-bleed), a "Selected work" eyebrow + the 3 case
  cards (bordered, hover lift), a short "How I ship" coda (2-3 slash-command
  style lines reinforcing the Claude-Code-not-Figma positioning, kept
  generic/truthful rather than quoting invented per-project prompts), and a
  quiet closing line linking to About.
- Verified in-browser: light/dark, desktop (1400px) and mobile (375px), no
  console errors, Dock doesn't overlap content at either anchor.

### Key decisions
- **Dock stays exactly as-is on Home** (no scroll-aware hiding, no "navless"
  jakub.kr treatment) — the site has real sub-pages jakub.kr doesn't, so
  wayfinding stays available everywhere, including Home.
- **Narrow single column, not a 3-up grid** — cards stack full-width in a
  ~640px column per Igor's explicit ask to match jakub.kr's reading width.
- **No fabricated project imagery or prompts** — no real Kiite/Metatable/
  SignFlow screenshots exist yet, so cards stay text-only rather than faking
  placeholder visuals; the "How I ship" coda states general practice, not
  invented project-specific prompt transcripts.

### Exact next step (1 action, max 2h)
Build `/work/[slug]` case study pages (currently `return null` stubs) using
`featured-work.ts` as the index data and the real Design Teleport case-study
text as the long-form source to adapt.

---

## Session 5 — Parallel A/B prototype architecture (2026-07-07)

### What was built
- **Live site moved into a route group**: `src/app/page.tsx`, `about/`,
  `work/`, `playground/` → `src/app/(site)/` via `git mv` (route groups
  don't add a URL segment, so `/`, `/about`, `/work`, `/playground` are
  unchanged). New `(site)/layout.tsx` owns `<Dock />`, which moved out of
  root `layout.tsx`. Root layout is now a pure shell: html, fonts,
  Providers, globals import — no chrome.
- **Two parallel prototype route trees**: `src/app/(prototypes)/a/` and
  `.../b/`, real URL segments (`/a`, `/b`) so they can never collide with
  each other or with `(site)`. Each has its own `layout.tsx` that wraps
  children in `<div data-version="a|b">` and mounts a version-specific
  `Nav`. Route shape mirrors the live site (`page`, `about`, `work`,
  `work/[slug]`, `playground`, `playground/[slug]`) so nothing 404s.
- **Token isolation via `data-version` attribute** — the same mechanism
  already used for `data-theme`. `src/design-system/versions/a.tokens.css`
  and `b.tokens.css`, scoped `[data-version='a'] { }` / `[data-version='b']`,
  both always imported in `globals.css` alongside base `tokens.css`.
  Placeholder overrides only (A: display font → mono, tighter tracking;
  B: wider text column) — real values land once each direction is
  actually designed.
- **Version-specific Nav components**: `design-system/version-a/Nav.tsx`
  (top-left corner cluster, plain text, no pill — nod to itsmarga.me's
  unconventional placement) and `version-b/Nav.tsx` (full-width sticky
  bar with a bottom rule — nod to jkane.co's clean grid). Both reuse the
  shared `ThemeToggle`. Structurally distinct from each other and from
  the live site's `Dock` so isolation is visible, not just declared.
- Both `/a` and `/b` Home pages pull from the shared `featuredWork` data
  (`src/content/featured-work.ts`) — content stays single-sourced;
  only the shell/nav/layout differs between versions.
- `CLAUDE.md` and `README.md` updated: documented the `(site)` /
  `(prototypes)` split, the `versions/*.tokens.css` exception to the
  "no new CSS variables outside tokens.css" rule, and the exit strategy.

### Key decisions
- **Real URL segments, not bare route groups.** `(a)`/`(b)` as route
  groups alone would both resolve to `/work` — silent collision. `/a`
  and `/b` as real segments make collision structurally impossible.
- **`data-version` mirrors `data-theme` exactly.** Same attribute-scoping
  mechanism the codebase already trusts for theming, extended one level.
  No new pattern to learn, no risk of one version's tokens leaking into
  another even though all CSS ships in one bundle.
- **Content stays shared, shell forks.** Only the presentation layer
  (nav, layout, type/color overrides) is duplicated per version; MDX
  case studies and `featured-work.ts` are not. Reduces what has to be
  kept in sync while the two directions are being compared.
- **Placeholder token overrides, not real art direction.** This session
  scaffolds the mechanism only — halftone textures, the vshslv.com hero
  device, and jkane.co's actual grid proportions are separate, later
  design work, not implied by this architecture pass.

### Verified
Dev server (Turbopack). Checked: `/`, `/about`, `/work`, `/playground`
(live site, unchanged behavior, Dock still floating/centered) and `/a`,
`/b` (own nav, own token overrides visibly applied, no bleed into each
other or into the live site), light/dark theme on all of them, mobile
375px. No console errors.

### Exact next step (1 action, max 2h)
Pick up Session 4's still-open task — build `/work/[slug]` case studies
on the live site — OR start real art direction for Version A's hero
(vshslv.com-style signature device) now that it has a route to live in.

---

## Session 5 — Version A homepage: desktop-OS entrance (2026-07-07)

### What was built
- Version A `/a` home is now a simulated desktop OS (Generate-stage first draft),
  mirroring the edoardolunardi.dev composition: persistent full-width top bar,
  left finder-style file list, floating windows, bottom work-gallery dock, all
  over a cursor-reactive monospace-halftone background.
- New components under `design-system/version-a/`:
  - `TopBar.tsx` — full-width sticky chrome. Wordmark (name) left, real Primary
    nav center (Work/Playground/About → the actual routes), ThemeToggle + live
    mono clock right. **Replaces** the old corner `Nav` (Nav.tsx/.module.css
    deleted — no leftover scaffolding).
  - `ReactiveBackground.tsx` — canvas halftone of mono glyphs. Slow ambient
    sine-drift; local brightening near the cursor with quadratic falloff;
    theme-aware (reads `--color-text`/`--color-accent` off live elements);
    `prefers-reduced-motion` → single static frame, no loop, no cursor tracking;
    `pointer-events:none` so clicks pass through; skips sub-threshold cells to
    hold frame rate.
  - `Desktop.tsx` — window manager: openable/closable/focusable/draggable
    windows (About pre-opened so the 3-second read needs no click), z-order
    focus, Esc closes front-most and returns focus to its file button, cascade
    default layout, collapsible work-gallery dock (collapses to a reopen tab —
    never fully hidden).
  - `desktop-content.ts` — view-model composing EXISTING content only
    (`featured-work.ts` + site bio); no new content system, no invented sections.
- Tokens: added `--color-accent`/`--color-accent-hover` (light+dark) and
  `--topbar-h` to `tokens.css`; `a.tokens.css` reassigns `--color-interactive`
  to the accent so the one chromatic color is used strictly for
  interactive/active states in Version A only. Live site stays achromatic.

### Key decisions
- **Theme-aware, not force-dark.** The brief wants a dark foundation, but
  CLAUDE.md requires both themes work. Resolved by driving everything off
  semantic tokens — dark theme gives the intended hero look, light stays valid.
- **Nav must survive at every width.** The TopBar nav is the real, crawlable,
  no-JS route path to every section, so it is NOT hidden on mobile (only the
  clock is dropped). Files/windows are the OS layer; nav + dock are the escape
  hatches, satisfying "reachable in ≤2 clicks" and the JS-off fallback.
- **Accent added to tokens.css, opted-in per version.** The monochromatic
  system stays intact for the live site; Version A opts in via existing
  reassign-only override discipline.
- **Files = buttons, work/dock = real links.** File entries open in-page
  windows (real `<button>`, Enter/Space/Esc); case studies are real `<Link>`s
  in both the Selected Work window and the dock.

### Verified
- `tsc --noEmit`: no errors in project source (only a stale `.next/types`
  validator line about a nonexistent root page — generated noise, not ours).
- `eslint` on all new files: clean.
- Live dev server (another chat's, watching this folder) recompiled cleanly
  (`✓ Compiled`, no errors); `GET /a` → 200; SSR HTML contains the
  `data-version="a"` shell, Primary nav, all three files, the pre-opened About
  window (labelled, bio present), and the Work Gallery dock with Kiite /
  Metatable / SignFlow as real links.
- **NOT verified (environment blocker):** could not capture a screenshot or run
  the live keyboard/reduced-motion pass — the preview harness is hard-mapped to
  the port another chat's dev server holds, and the Chrome extension was
  disconnected this session. Visual + interaction QA still owed.

### Exact next step (1 action, max 2h)
Open `/a` in a real browser: screenshot at desktop width vs the reference for
structural fidelity, tab through keyboard-only (every file + nav item operable,
Esc closes windows), and toggle reduced-motion to confirm the background
degrades to a static frame. Fix any drift found — this is the owed audit pass.
