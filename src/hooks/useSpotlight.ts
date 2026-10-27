import type { PointerEvent } from 'react';

/** Pointer handler that feeds --mx/--my to the `.spotlight` glow on the hovered element. */
export function spotlightHandler(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
