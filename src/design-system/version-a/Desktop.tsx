'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import Link from 'next/link';
import {
  IconUser,
  IconFolder,
  IconFlask2,
  IconX,
  IconChevronRight,
} from '@tabler/icons-react';
import {
  DESKTOP_FILES,
  DEFAULT_LAYOUT,
  INITIAL_OPEN,
  PROFILE,
  PLAYGROUND,
  featuredWork,
  type WindowId,
} from './desktop-content';
import styles from './Desktop.module.css';

const ICONS: Record<WindowId, typeof IconUser> = {
  about: IconUser,
  work: IconFolder,
  playground: IconFlask2,
};

const TITLES: Record<WindowId, string> = {
  about: 'About',
  work: 'Selected Work',
  playground: 'Playground',
};

const MOBILE_QUERY = '(max-width: 640px)';

/* ── Window body content (real content only) ───────────────────────────── */
function WindowBody({ id }: { id: WindowId }) {
  if (id === 'about') {
    return (
      <div className={styles.prose}>
        {PROFILE.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className={styles.availability}>{PROFILE.availability}</p>
      </div>
    );
  }

  if (id === 'work') {
    return (
      <ul className={styles.workList}>
        {featuredWork.map((item) => (
          <li key={item.slug}>
            <Link href={`/a/work/${item.slug}`} className={styles.workItem}>
              <span className={styles.workHead}>
                <span className={styles.workTitle}>{item.title}</span>
                <span className={styles.workMeta}>{item.meta}</span>
              </span>
              <span className={styles.workDeck}>{item.deck}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.prose}>
      <p>{PLAYGROUND.blurb}</p>
      <Link href={PLAYGROUND.href} className={styles.textLink}>
        Open Playground →
      </Link>
    </div>
  );
}

/* ── A single floating window ──────────────────────────────────────────── */
interface WindowProps {
  id: WindowId;
  z: number;
  focused: boolean;
  autoFocus: boolean;
  pos: { x: number; y: number };
  boundsRef: React.RefObject<HTMLDivElement | null>;
  onClose: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onMove: (id: WindowId, x: number, y: number) => void;
}

function DesktopWindow({
  id,
  z,
  focused,
  autoFocus,
  pos,
  boundsRef,
  onClose,
  onFocus,
  onMove,
}: WindowProps) {
  const Icon = ICONS[id];
  const winRef = useRef<HTMLElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const titleId = `win-${id}-title`;

  // Move focus into a window only when the user opened it (not the pre-opened one).
  useEffect(() => {
    if (autoFocus) winRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTitlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia(MOBILE_QUERY).matches) return; // no drag on mobile sheets
    if ((e.target as HTMLElement).closest('button')) return; // let the close button be
    const win = winRef.current;
    if (!win) return;
    onFocus(id);
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onTitlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const bounds = boundsRef.current;
    const win = winRef.current;
    if (!bounds || !win) return;
    const maxX = Math.max(0, bounds.clientWidth - win.offsetWidth);
    const maxY = Math.max(0, bounds.clientHeight - win.offsetHeight);
    const nx = Math.min(Math.max(0, e.clientX - drag.current.dx), maxX);
    const ny = Math.min(Math.max(0, e.clientY - drag.current.dy), maxY);
    onMove(id, nx, ny);
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <section
      ref={winRef}
      className={`${styles.window} ${focused ? styles.focused : ''} ${
        dragging ? styles.dragging : ''
      }`}
      style={{ left: pos.x, top: pos.y, width: DEFAULT_LAYOUT[id].w, zIndex: z }}
      aria-labelledby={titleId}
      tabIndex={-1}
      onMouseDown={() => onFocus(id)}
      onFocus={() => onFocus(id)}
    >
      <div
        className={styles.titlebar}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span className={styles.titleLabel} id={titleId}>
          <Icon size={14} stroke={1.75} aria-hidden="true" />
          {TITLES[id]}
        </span>
        <button
          type="button"
          className={styles.close}
          onClick={() => onClose(id)}
          aria-label={`Close ${TITLES[id]}`}
        >
          <IconX size={14} stroke={2} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.windowBody}>
        <WindowBody id={id} />
      </div>
    </section>
  );
}

/* ── The desktop shell ─────────────────────────────────────────────────── */
export function Desktop() {
  const [openOrder, setOpenOrder] = useState<WindowId[]>(INITIAL_OPEN);
  const [positions, setPositions] = useState<Record<WindowId, { x: number; y: number }>>(
    () => ({
      about: { x: DEFAULT_LAYOUT.about.x, y: DEFAULT_LAYOUT.about.y },
      work: { x: DEFAULT_LAYOUT.work.x, y: DEFAULT_LAYOUT.work.y },
      playground: { x: DEFAULT_LAYOUT.playground.x, y: DEFAULT_LAYOUT.playground.y },
    }),
  );
  const [dockOpen, setDockOpen] = useState(true);
  const [autoFocusId, setAutoFocusId] = useState<WindowId | null>(null);

  const boundsRef = useRef<HTMLDivElement>(null);
  const fileRefs = useRef<Partial<Record<WindowId, HTMLButtonElement | null>>>({});

  const focusWindow = useCallback((id: WindowId) => {
    setOpenOrder((order) => {
      if (order[order.length - 1] === id) return order;
      const next = order.filter((w) => w !== id);
      next.push(id);
      return next;
    });
  }, []);

  const openFile = useCallback((id: WindowId) => {
    setAutoFocusId(id);
    setOpenOrder((order) =>
      order.includes(id) ? [...order.filter((w) => w !== id), id] : [...order, id],
    );
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setOpenOrder((order) => order.filter((w) => w !== id));
    // Return focus to the file that opened it.
    fileRefs.current[id]?.focus();
  }, []);

  const moveWindow = useCallback((id: WindowId, x: number, y: number) => {
    setPositions((p) => ({ ...p, [id]: { x, y } }));
  }, []);

  // Esc closes the front-most window.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenOrder((order) => {
        if (order.length === 0) return order;
        const top = order[order.length - 1];
        fileRefs.current[top]?.focus();
        return order.slice(0, -1);
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={styles.desktop} ref={boundsRef}>
      {/* File list — the actual menu of the site. */}
      <div className={styles.fileList} role="group" aria-label="Files">
        {DESKTOP_FILES.map((file) => {
          const Icon = ICONS[file.id];
          const isOpen = openOrder.includes(file.id);
          return (
            <button
              key={file.id}
              type="button"
              ref={(el) => {
                fileRefs.current[file.id] = el;
              }}
              className={styles.file}
              aria-pressed={isOpen}
              onClick={() => openFile(file.id)}
            >
              <span className={styles.fileIcon} aria-hidden="true">
                <Icon size={16} stroke={1.75} />
              </span>
              <span className={styles.fileText}>
                <span className={styles.fileLabel}>{file.label}</span>
                <span className={styles.fileHint}>{file.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating windows, painted back-to-front. */}
      {openOrder.map((id, i) => (
        <DesktopWindow
          key={id}
          id={id}
          z={i + 1}
          focused={i === openOrder.length - 1}
          autoFocus={autoFocusId === id}
          pos={positions[id]}
          boundsRef={boundsRef}
          onClose={closeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
        />
      ))}

      {/* Work-gallery dock — persistent escape hatch to the real case studies. */}
      {dockOpen ? (
        <div className={styles.dock}>
          <div className={styles.dockBar}>
            <span className={styles.dockTitle}>Work Gallery</span>
            <button
              type="button"
              className={styles.close}
              onClick={() => setDockOpen(false)}
              aria-label="Collapse Work Gallery"
            >
              <IconX size={14} stroke={2} aria-hidden="true" />
            </button>
          </div>
          <ul className={styles.dockStrip} aria-label="Work gallery">
            {featuredWork.map((item) => (
              <li key={item.slug}>
                <Link href={`/a/work/${item.slug}`} className={styles.thumb}>
                  <span className={styles.thumbTitle}>{item.title}</span>
                  <span className={styles.thumbMeta}>{item.meta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          type="button"
          className={styles.dockTab}
          onClick={() => setDockOpen(true)}
        >
          <IconChevronRight size={14} stroke={2} aria-hidden="true" />
          Work Gallery
        </button>
      )}
    </div>
  );
}
