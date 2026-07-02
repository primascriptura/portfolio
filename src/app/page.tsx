import Link from 'next/link';
import { featuredWork } from '@/content/featured-work';
import styles from './page.module.css';

const SHIP_ITEMS = [
  {
    command: '/design-and-ship',
    label: 'One person, idea to shipped UI — no Figma handoff',
  },
  {
    command: '/claude-code-native',
    label: 'This site, and increasingly client work, built directly in code',
  },
  {
    command: '/fast-turnarounds',
    label: 'Full product redesigns in weeks, not quarters',
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>IH</p>
        <h1 className={styles.headline}>
          Product designer for fintech, SaaS, and AI startups. I design and
          ship — research, UX, UI, and increasingly the code itself, built
          almost entirely with Claude and Claude Code instead of Figma.
        </h1>
        <p className={styles.sub}>
          Kiite, Metatable, SignFlow — built inside Design Teleport, a
          two-person studio.
        </p>
      </header>

      <section aria-labelledby="work-label">
        <p id="work-label" className={styles.eyebrow}>
          Selected work
        </p>
        <ul className={styles.workList}>
          {featuredWork.map((item) => (
            <li key={item.slug}>
              <Link href={`/work/${item.slug}`} className={styles.card}>
                <div className={styles.cardHead}>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <span className={styles.cardMeta}>{item.meta}</span>
                </div>
                <p className={styles.cardDeck}>{item.deck}</p>
                <p className={styles.cardDescription}>{item.description}</p>
                <p className={styles.cardOutcome}>{item.outcome}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ship-label" className={styles.shipSection}>
        <p id="ship-label" className={styles.eyebrow}>
          How I ship
        </p>
        <ul className={styles.shipList}>
          {SHIP_ITEMS.map((item) => (
            <li key={item.command} className={styles.shipItem}>
              <span className={styles.shipCommand}>{item.command}</span>
              <span className={styles.shipLabel}>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.closing}>
        <p>
          Let&apos;s talk about what you&apos;re building —{' '}
          <Link href="/about">more about me</Link>.
        </p>
      </footer>
    </main>
  );
}
