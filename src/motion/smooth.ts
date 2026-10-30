import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Starts wheel smoothing on GSAP's ticker so scroll, reveals and the hero share one clock. */
export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  const instance = new Lenis({ lerp: 0.12 });
  lenis = instance;
  instance.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target: HTMLElement | number, immediate = false) {
  const reduce = prefersReducedMotion();
  if (lenis) {
    lenis.scrollTo(target, {
      immediate: immediate || reduce,
      force: true,
      // Element targets already honour the html scroll-padding-top that clears the nav.
      duration: 1.25,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY - 48;
  window.scrollTo({ top, behavior: 'auto' });
}

export const setScrollLocked = (locked: boolean) => (locked ? lenis?.stop() : lenis?.start());
