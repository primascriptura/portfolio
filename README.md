# Ihor Chivrich — Portfolio

Personal portfolio site for Ihor Chivrich, product designer specialising in fintech, SaaS, and AI startups.

**Live:** https://portfolio-xi-jade-9ts58sbz9e.vercel.app

## Stack

- **Framework:** Next.js 16 App Router + TypeScript
- **Styling:** CSS Modules + CSS Custom Properties (no Tailwind)
- **Fonts:** Libre Baskerville (display) + Inter (body) via `next/font`
- **Theming:** `next-themes` — light/dark, system preference respected
- **Icons:** `@tabler/icons-react`
- **Hosting:** Vercel (free tier)

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Project structure

```
src/
├── app/
│   ├── layout.tsx        # Root shell: html, fonts, Providers — no chrome
│   ├── (site)/           # Live site — route group, URLs unaffected
│   │   ├── page.tsx      # Home (= Work index)
│   │   ├── about/
│   │   ├── playground/
│   │   └── work/[slug]/
│   └── (prototypes)/     # Parallel design directions, real URL segments
│       ├── a/            # /a/* — own layout, nav, data-version="a"
│       └── b/            # /b/* — own layout, nav, data-version="b"
├── components/           # Page-specific components
├── content/
│   └── work/*.mdx        # Case study content — shared across (site)/a/b
├── design-system/
│   ├── tokens.css        # Base design tokens — source of truth
│   ├── versions/         # Per-prototype token overrides ([data-version])
│   │   ├── a.tokens.css
│   │   └── b.tokens.css
│   ├── components/       # Reusable UI primitives (shared)
│   ├── version-a/        # Nav + components unique to Version A
│   └── version-b/        # Nav + components unique to Version B
└── styles/
    └── globals.css       # Reset + base styles, imports all tokens files
```

## Design rules

All styling goes through design tokens in `src/design-system/tokens.css`. No hardcoded values in component CSS files. Every component uses a CSS Module.

## Prototype versions

`/a` and `/b` are two competing visual directions for the site, running in parallel for comparison — see `CLAUDE.md` → "Prototype versions (A/B)" for how the isolation works and how to retire the losing version.
