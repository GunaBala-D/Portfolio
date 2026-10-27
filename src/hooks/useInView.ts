import { useEffect, useRef, useState } from 'react';

type Options = { rootMargin?: string; threshold?: number; once?: boolean };

/** Tracks whether an element is in the viewport. With `once`, it stays true after the first entry. */
export function useInView<T extends Element>({ rootMargin = '0px', threshold = 0, once = false }: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView] as const;
}
