import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';

function useReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Animates the numeric part of a value such as "15,000+" or "~89%" once it scrolls into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  const target = m ? parseFloat(m[2]!.replace(/,/g, '')) : NaN;
  const [ref, inView] = useInView<HTMLSpanElement>({ once: true, rootMargin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return;
    if (reduce) {
      setN(target);
      return;
    }
    const start = performance.now();
    const dur = 1400;
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      setN(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduce]);

  if (!m) return <span className={className}>{value}</span>;
  const decimals = m[2]!.includes('.') ? m[2]!.split('.')[1]!.length : 0;
  const shown = n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {m[1]}
        {shown}
        {m[3]}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

type GaugeProps = { value: number; label: string; display?: string; size?: number };

/** Circular gauge for a percentage metric; the number is always printed, so colour carries no meaning alone. */
export function RadialGauge({ value, label, display, size = 112 }: GaugeProps) {
  const [ref, inView] = useInView<SVGSVGElement>({ once: true, rootMargin: '0px 0px -10% 0px' });
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <figure className="gauge" style={{ width: size }}>
      <svg ref={ref} viewBox="0 0 100 100" className={`gauge__svg ${inView ? 'is-in' : ''}`} aria-hidden="true">
        <circle cx="50" cy="50" r={r} className="gauge__track" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className="gauge__value"
          strokeDasharray={c}
          style={{ ['--off' as string]: `${c * (1 - value / 100)}`, ['--c' as string]: `${c}` }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="gauge__center">
        <span className="gauge__num mono">{display ?? `${value}%`}</span>
      </div>
      {label && <figcaption className="gauge__label">{label}</figcaption>}
    </figure>
  );
}
