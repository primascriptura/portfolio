export interface FeaturedWork {
  slug: string;
  title: string;
  deck: string;
  description: string;
  outcome: string;
  meta: string;
}

export const featuredWork: FeaturedWork[] = [
  {
    slug: 'kiite',
    title: 'Kiite',
    deck: 'A community platform redesign that helped launch a Product Hunt top-5 product and close a funding round.',
    description:
      'Redesigned the core group and community experience for Know Your Group — research, UX, and UI, from first sketch to shipped product.',
    outcome: 'Product Hunt #5 · 50+ communities · funding round closed',
    meta: '2024 · Community platform',
  },
  {
    slug: 'metatable',
    title: 'Metatable',
    deck: "An AI tool's UX rebuilt in a two-week turnaround.",
    description:
      'A full UX redesign of an AI product, taken from research through shipped UI in two weeks.',
    outcome: '2-week full redesign',
    meta: '2025 · AI product',
  },
  {
    slug: 'signflow',
    title: 'SignFlow',
    deck: 'An enterprise UX audit and design system, shipped under NDA.',
    description:
      'A UX audit and design system for an enterprise SaaS product, anonymized per NDA.',
    outcome: 'UX audit + design system',
    meta: '2024 · Enterprise SaaS',
  },
];
