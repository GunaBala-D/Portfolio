import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HIDDEN = { autoAlpha: 0, y: 28, filter: 'blur(8px)' };
const SHOWN = {
  autoAlpha: 1,
  y: 0,
  filter: 'blur(0px)',
  duration: 0.9,
  ease: 'power3.out',
  overwrite: true,
  clearProps: 'opacity,visibility,transform,filter',
};

/**
 * Scroll choreography for a page. Declared with data attributes so sections stay plain markup:
 * [data-choreo] draws its rule, bar and crosshairs in; [data-reveal] blurs up once;
 * children of [data-reveal-group] stagger from left to right by their position in the row.
 */
export function useChoreo(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-choreo]', root).forEach((section) => {
          const rule = section.querySelector('[data-draw-rule]');
          const bar = section.querySelector('[data-draw-bar]');
          const ticks = section.querySelectorAll('[data-draw-tick]');
          if (rule) gsap.set(rule, { scaleX: 0 });
          if (bar) gsap.set(bar, { clipPath: 'inset(0 100% 0 0)' });
          if (ticks.length) gsap.set(ticks, { scale: 0, opacity: 0 });
          ScrollTrigger.create({
            trigger: section,
            start: 'top 92%',
            once: true,
            onEnter: () => {
              const tl = gsap.timeline();
              if (rule) tl.to(rule, { scaleX: 1, duration: 1.1, ease: 'power2.out', clearProps: 'transform' }, 0);
              if (bar) tl.to(bar, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power2.out', clearProps: 'clipPath' }, 0.1);
              if (ticks.length) tl.to(ticks, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(3)', clearProps: 'all' }, 0.35);
            },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal]', root).forEach((el) => {
          if (el.closest('[data-reveal-group]')) return;
          const delay = Number(el.dataset.delay ?? 0) / 1000;
          gsap.set(el, HIDDEN);
          ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => gsap.to(el, { ...SHOWN, delay }),
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal-group]', root).forEach((group) => {
          const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]'));
          gsap.set(items, HIDDEN);
          const box = group.getBoundingClientRect();
          items.forEach((el) => {
            const delay = box.width > 0 ? ((el.getBoundingClientRect().left - box.left) / box.width) * 0.18 : 0;
            ScrollTrigger.create({
              trigger: el,
              start: 'top 88%',
              once: true,
              onEnter: () => gsap.to(el, { ...SHOWN, delay }),
            });
          });
        });
      }, root);

      // Fonts and lazy media change section heights after the triggers are measured.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh);
      return () => {
        window.removeEventListener('load', refresh);
        ctx.revert();
      };
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
