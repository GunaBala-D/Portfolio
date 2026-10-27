import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the hash target after navigation (including repeat clicks on the same hash),
 * otherwise to the top on a new page. Moves focus to the target so keyboard users land there too.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const prevPath = useRef(pathname);

  useLayoutEffect(() => {
    const samePage = prevPath.current === pathname;
    prevPath.current = pathname;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Wait a frame so a freshly rendered page has its sections in the DOM.
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: samePage && !reduce ? 'smooth' : 'auto', block: 'start' });
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(raf);
    }

    if (!samePage) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      document.getElementById('main')?.focus({ preventScroll: true });
    }
  }, [pathname, hash, key]);

  return null;
}
