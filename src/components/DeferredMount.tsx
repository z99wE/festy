import { useEffect, useState, type ReactNode } from 'react';

interface DeferredMountProps {
  children: ReactNode;
  /** How long to wait after page load before mounting on its own. */
  delayMs?: number;
}

/**
 * Mounts non-critical floating chrome (chat, mascot, newsletter, auth modal)
 * only after the page has loaded and settled, or as soon as the visitor
 * interacts. Their JS chunks are otherwise requested during the initial load
 * and compete with the hero for bandwidth and main-thread time.
 */
export function DeferredMount({ children, delayMs = 5000 }: DeferredMountProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;

    const enable = () => setReady(true);

    const schedule = () => {
      timer = setTimeout(() => {
        const win = window as unknown as {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        };
        if (typeof win.requestIdleCallback === 'function') {
          idleId = win.requestIdleCallback(enable, { timeout: 1500 });
        } else {
          enable();
        }
      }, delayMs);
    };

    window.addEventListener('pointerdown', enable, { once: true, passive: true });
    window.addEventListener('keydown', enable, { once: true });
    window.addEventListener('touchstart', enable, { once: true, passive: true });
    window.addEventListener('scroll', enable, { once: true, passive: true });

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      window.removeEventListener('pointerdown', enable);
      window.removeEventListener('keydown', enable);
      window.removeEventListener('touchstart', enable);
      window.removeEventListener('scroll', enable);
      window.removeEventListener('load', schedule);
      if (timer) clearTimeout(timer);
      if (idleId && 'cancelIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, [delayMs, ready]);

  return ready ? <>{children}</> : null;
}
