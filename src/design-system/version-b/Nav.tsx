'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/design-system/components';
import styles from './Nav.module.css';

const NAV_ITEMS = [
  { label: 'Work', href: '/b' },
  { label: 'Playground', href: '/b/playground' },
  { label: 'About', href: '/b/about' },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/b') {
    return pathname === '/b' || pathname.startsWith('/b/work');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();

  return (
    <header className={styles.bar}>
      <Link href="/b" className={styles.brand} aria-label="Home">
        Ihor Khivrych
      </Link>

      <nav aria-label="Primary">
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
      </nav>

      <ThemeToggle />
    </header>
  );
}
