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
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home (= Work index)
│   ├── about/
│   ├── playground/
│   └── work/[slug]/
├── components/           # Page-specific components
├── content/
│   └── work/*.mdx        # Case study content
├── design-system/
│   ├── tokens.css        # All design tokens — source of truth
│   └── components/       # Reusable UI primitives
└── styles/
    └── globals.css       # Reset + base styles
```

## Design rules

All styling goes through design tokens in `src/design-system/tokens.css`. No hardcoded values in component CSS files. Every component uses a CSS Module.
