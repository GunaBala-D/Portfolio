import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTarget } from '../motion/smooth';

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
        scrollToTarget(el, !samePage);
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(raf);
    }

    if (!samePage) {
      scrollToTarget(0, true);
      document.getElementById('main')?.focus({ preventScroll: true });
    }
  }, [pathname, hash, key]);

  return null;
}
