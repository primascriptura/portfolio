'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROFILE } from './desktop-content';
import styles from './TopBar.module.css';

const NAV_ITEMS = [
  { label: 'Work', href: '/a' },
  { label: 'Playground', href: '/a/playground' },
  { label: 'About', href: '/a/about' },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/a') {
    return pathname === '/a' || pathname.startsWith('/a/work');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  // Reserve width even before mount so the bar doesn't shift on hydration.
  return (
    <span className={styles.clock} aria-hidden="true">
      {time ?? '--:--'}
    </span>
  );
}

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className={styles.bar}>
      <Link href="/a" className={styles.brand}>
        {PROFILE.name}
      </Link>

      <nav aria-label="Primary" className={styles.nav}>
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

      <div className={styles.utilities}>
        <Clock />
      </div>
    </header>
  );
}
