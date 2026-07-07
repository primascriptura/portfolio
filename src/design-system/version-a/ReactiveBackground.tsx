'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import styles from './ReactiveBackground.module.css';

/* Monospace-glyph halftone field. Texture, never spectacle:
   - sits behind everything (pointer-events: none on the canvas)
   - low-contrast duotone read from the live theme tokens
   - drifts slowly on its own; brightens locally near the cursor with a
     smooth falloff
   - prefers-reduced-motion → one static frame, no loop, no cursor tracking. */

const CELL = 18; // px grid pitch — coarse enough to stay cheap on mid hardware
const RAMP = ' .·:-+*coxX#'; // sparse → dense
const RADIUS = 190; // cursor influence radius, px
const DRAW_THRESHOLD = 0.14; // skip near-empty cells (keeps glyph count down)
const BASE_ALPHA = 0.16; // idle texture ceiling
const CURSOR_ALPHA = 0.5; // brightest a cell gets under the cursor
const ACCENT_EVERY = 23; // sparse accent specks, deterministic (no RNG)

function parseRGB(value: string): [number, number, number] {
  const m = value.match(/-?\d+(\.\d+)?/g);
  if (!m || m.length < 3) return [128, 128, 128];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

export function ReactiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Resolve theme colors off real elements so var() chains are computed to rgb.
    const textRGB = parseRGB(getComputedStyle(canvas).color);
    const probe = document.createElement('span');
    probe.style.color = 'var(--color-accent)';
    probe.style.position = 'absolute';
    canvas.parentElement?.appendChild(probe);
    const accentRGB = parseRGB(getComputedStyle(probe).color);
    probe.remove();

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Canvas can't read CSS vars; a generic mono is fine for texture.
      ctx.font = `${CELL}px ui-monospace, 'Geist Mono', monospace`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
    };

    // pointer state; null = no cursor (touch / idle) → ambient only
    let px = -1e5;
    let py = -1e5;
    let hasCursor = false;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      hasCursor = true;
    };
    const onLeave = () => {
      hasCursor = false;
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const rad2 = RADIUS * RADIUS;

      for (let r = 0; r < rows; r++) {
        const y = r * CELL;
        for (let c = 0; c < cols; c++) {
          const x = c * CELL;

          // Smooth, slowly drifting base field (two offset sine waves).
          const base =
            0.5 +
            0.25 * Math.sin(x * 0.021 + y * 0.014 + t) +
            0.25 * Math.sin(x * 0.011 - y * 0.026 - t * 0.7);

          let v = base * 0.55; // idle field stays faint

          if (hasCursor) {
            const dx = x - px;
            const dy = y - py;
            const d2 = dx * dx + dy * dy;
            if (d2 < rad2) {
              const f = 1 - Math.sqrt(d2) / RADIUS;
              v += f * f * 0.9; // smooth quadratic falloff
            }
          }

          if (v <= DRAW_THRESHOLD) continue;
          if (v > 1) v = 1;

          const rampIndex = Math.min(
            RAMP.length - 1,
            Math.floor(v * (RAMP.length - 1)),
          );
          const glyph = RAMP[rampIndex];
          if (glyph === ' ') continue;

          const alpha = BASE_ALPHA + v * (CURSOR_ALPHA - BASE_ALPHA);
          const isAccent = (r * 7 + c) % ACCENT_EVERY === 0 && v > 0.55;
          const [cr, cg, cb] = isAccent ? accentRGB : textRGB;
          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`;
          ctx.fillText(glyph, x, y);
        }
      }
    };

    let raf = 0;
    const loop = (now: number) => {
      render(now * 0.00016); // slow ambient drift
      raf = requestAnimationFrame(loop);
    };

    resize();

    if (reduceMotion) {
      render(0); // single calm static frame
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerleave', onLeave);
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      if (reduceMotion) render(0);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [resolvedTheme]);

  return (
    <div className={styles.layer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
