import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../motion/smooth';

type Item = { id: string; label: string };

const QUIET = 0.42;
const DOCKED = 0.53;
const QUIET_ALPHA = 0.32;
const LINE = 16;
const BAR_Y = 69;
const PASSED_Y = 104;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const quad = (a: number, c: number, b: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

/**
 * Section names at the screen's right edge. Upcoming names wait quietly at the bottom; as a section
 * arrives its letters detach one by one, run up the ruler and land in that section's sticky bar.
 * Passed names step aside into a quiet list. Entirely scroll-driven, so scrolling back reverses it.
 */
export function SectionIndex({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    if (!host || prefersReducedMotion()) return;
    const rows: { el: HTMLElement; dx: number }[][] = [];
    const probe = document.createElement('span');
    probe.className = 'sindex__probe';
    host.appendChild(probe);

    const measure = (text: string) => {
      probe.textContent = text;
      return probe.getBoundingClientRect().width;
    };

    const build = () => {
      host.querySelectorAll('.sindex__letter').forEach((n) => n.remove());
      rows.length = 0;
      items.forEach((item) => {
        const text = item.label.toUpperCase();
        const total = measure(text);
        const row = Array.from(text).map((ch, i) => {
          const el = document.createElement('span');
          el.className = 'sindex__letter';
          el.textContent = ch;
          host.appendChild(el);
          return { el, dx: total - measure(text.slice(0, i)) };
        });
        rows.push(row);
      });
    };

    let raf = 0;
    const paint = () => {
      raf = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const frameW = Math.min(1280, vw - 160);
      const dockRight = (vw + frameW) / 2 - 40;
      const quietRight = vw - 66;
      const railX = vw - 34;
      const start = vh * 0.46;
      const end = 54;

      const progress = items.map((item, i) => {
        if (i === 0) return 1;
        const sec = document.getElementById(item.id);
        if (!sec) return 0;
        return clamp01((start - sec.getBoundingClientRect().top) / (start - end));
      });

      rows.forEach((row, r) => {
        const p = progress[r]!;
        // How many later sections have arrived: 0 = this is current, 1 = just passed, and so on.
        let depth = 0;
        for (let j = r + 1; j < progress.length; j++) depth += ease(progress[j]!);
        const out = clamp01(depth);

        const scaleLanded = lerp(DOCKED, QUIET, out);
        const rightLanded = lerp(dockRight, quietRight, out);
        const yLanded = depth < 1 ? lerp(BAR_Y, PASSED_Y, out) : PASSED_Y + (depth - 1) * LINE;
        // The hero name is already on screen as the wordmark, so it only appears once passed.
        const alphaLanded = r === 0 ? out * QUIET_ALPHA : lerp(1, QUIET_ALPHA, out);
        const yWaiting = vh - 30 - (items.length - 1 - r) * LINE;

        const n = row.length;
        const stagger = Math.min(0.045, 0.5 / n);

        row.forEach(({ el, dx }, k) => {
          // The last letter leaves first, so the word unspools up the rail.
          const order = n - 1 - k;
          const u = clamp01((p - stagger * order) / (1 - stagger * (n - 1)));
          const x0 = quietRight - dx * QUIET;
          const x1 = rightLanded - dx * scaleLanded;
          let x: number;
          let y: number;
          let rot = 0;
          let scale: number;
          let alpha = 0.8;
          if (u <= 0) {
            x = x0;
            y = yWaiting;
            scale = QUIET;
            alpha = QUIET_ALPHA;
          } else if (u >= 1) {
            x = x1;
            y = yLanded;
            scale = scaleLanded;
            alpha = alphaLanded;
          } else if (u < 0.2) {
            const t = u / 0.2;
            x = quad(x0, railX, railX, t);
            y = quad(yWaiting, yWaiting, yWaiting - 70, t);
            rot = -90 * ease(t);
            scale = lerp(QUIET, 0.8, t);
          } else if (u < 0.8) {
            const t = (u - 0.2) / 0.6;
            x = railX;
            y = lerp(yWaiting - 70, yLanded + 70, ease(t));
            rot = -90;
            scale = 0.8;
          } else {
            const t = (u - 0.8) / 0.2;
            x = quad(railX, railX, x1, t);
            y = quad(yLanded + 70, yLanded, yLanded, t);
            rot = -90 * (1 - ease(t));
            scale = lerp(0.8, scaleLanded, t);
          }
          el.style.opacity = alpha.toFixed(3);
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - 17).toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        });
      });
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const rebuild = () => {
      build();
      paint();
    };
    rebuild();
    document.fonts?.ready.then(rebuild);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      host.innerHTML = '';
    };
  }, [items]);

  return <div ref={root} className="sindex" aria-hidden="true" />;
}
