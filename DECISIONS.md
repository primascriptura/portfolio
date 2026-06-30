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
