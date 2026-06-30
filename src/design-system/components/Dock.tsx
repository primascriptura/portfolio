'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import styles from './Dock.module.css';

const NAV_ITEMS = [
  { label: 'Work', href: '/' },
  { label: 'Playground', href: '/playground' },
  { label: 'About', href: '/about' },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/') {
    // Home doubles as the Work index, so case-study pages count as "Work" too.
    return pathname === '/' || pathname.startsWith('/work');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Dock() {
  const pathname = usePathname();

  return (
    <nav className={styles.dock} aria-label="Primary">
      <Link href="/" className={styles.brand} aria-label="Home">
        IH
      </Link>

      <ul className={styles.links}>
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={styles.link}
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <span className={styles.divider} aria-hidden="true" />

      <ThemeToggle />
    </nav>
  );
}
