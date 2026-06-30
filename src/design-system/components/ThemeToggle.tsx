'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { IconSun, IconMoon } from '@tabler/icons-react';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Gate every theme-derived value behind `mounted`: the server has no resolved
  // theme, so the first client render must match it to avoid hydration mismatch.
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {mounted ? (
        isDark ? (
          <IconSun size={18} stroke={1.5} />
        ) : (
          <IconMoon size={18} stroke={1.5} />
        )
      ) : (
        <span className={styles.placeholder} aria-hidden="true" />
      )}
    </button>
  );
}
