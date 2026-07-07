# CLAUDE.md — Portfolio Design Rules

Read this file at the start of EVERY session. No exceptions.

> Next.js note: this project is on Next 16, which has breaking changes vs. older
> versions. See `AGENTS.md` and `node_modules/next/dist/docs/` before writing
> framework-level code.

## Stack rules
- Framework: Next.js 16 App Router
- Styling: CSS Modules + CSS Custom Properties only
- No Tailwind, no inline styles, no styled-components
- Fonts: next/font/google — Geist (display + body) + Geist Mono

## Design system rules — MANDATORY

### Before writing ANY CSS:
1. Open src/design-system/tokens.css
2. Find the variable you need
3. Use the variable — never the raw value

### FORBIDDEN:
- Hardcoded values: color: #fff, background: black,
  oklch(0.991 0 0) directly in component CSS files
- Arbitrary px values not in the spacing scale:
  margin: 13px, padding: 7px 15px
- Raw font-size numbers: font-size: 18px
- New CSS variables outside tokens.css (exception: per-version overrides
  in src/design-system/versions/*.tokens.css — see "Prototype versions" below)
- Using oklch/hex/rgb values directly in component files

### REQUIRED:
- color: var(--color-text)
- margin-bottom: var(--space-4)
- font-size: var(--text-lg)
- If a value is missing: ADD IT to tokens.css first, then use it
- Every component file uses a CSS Module (.module.css)

## File structure rules
- Reusable UI primitives → src/design-system/components/
- Page-specific components → src/components/
- All design tokens → src/design-system/tokens.css ONLY
  (per-version overrides are the one exception — see below)
- Case studies → src/content/work/*.mdx
- Articles/experiments → src/content/playground/*.mdx
- Live site routes → src/app/(site)/ — a route group, does NOT change
  URLs (/, /about, /work, /playground stay as-is)
- Prototype routes → src/app/(prototypes)/a/ and .../b/ — real URL
  segments (/a, /b), fully isolated route trees

## Theme system
- Controlled by data-theme attribute on <html>
- next-themes handles toggle — never hardcode theme logic
- Light is default (system preference respected)
- All colors must work in BOTH themes

## Prototype versions (A/B)
Two portfolio directions exist side by side for comparison, isolated the
same way theme is: an attribute selector.
- `/a/*` and `/b/*` are separate route trees under src/app/(prototypes)/,
  each with its own layout.tsx that wraps children in
  `<div data-version="a">` (or `"b"`) and mounts that version's own Nav.
- Version-specific tokens → src/design-system/versions/a.tokens.css and
  b.tokens.css, scoped with `[data-version='a'] { }`. These may ONLY
  reassign existing tokens.css variables to other existing values —
  never introduce a raw hardcoded value, same discipline as tokens.css.
- Version-specific components → src/design-system/version-a/ and
  version-b/. Anything NOT under test (ThemeToggle, MDX rendering,
  content data) stays shared in design-system/components/ and content/.
- Content (src/content/) is shared across both versions by default —
  only the shell/nav/layout differs, not the case-study text.
- When one version wins: promote its app/(prototypes)/a/* routes to
  app/(site)/, delete the other version's route folder, tokens file,
  and component folder wholesale. No leftover scaffolding.

## Session log
At end of every session, append to DECISIONS.md:
- What was built
- Key decisions made
- Exact next step (1 action, max 2h)
