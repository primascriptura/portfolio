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
- New CSS variables outside tokens.css
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
- Case studies → src/content/work/*.mdx
- Articles/experiments → src/content/playground/*.mdx

## Theme system
- Controlled by data-theme attribute on <html>
- next-themes handles toggle — never hardcode theme logic
- Light is default (system preference respected)
- All colors must work in BOTH themes

## Session log
At end of every session, append to DECISIONS.md:
- What was built
- Key decisions made
- Exact next step (1 action, max 2h)
