import { useInView } from '../../hooks/useInView';

// The README reports 23 per-frame classifications collapsing into 4 alerts on a 1,394-frame video.
// The counts are real; how the 23 are spread across the 4 groups is illustrative.
const GROUPS = [6, 5, 7, 5];

export function VisionCardArt() {
  const [ref, inView] = useInView<SVGSVGElement>({ once: true, rootMargin: '0px 0px -10% 0px' });
  const ticks: { x: number; g: number; i: number }[] = [];
  const groupSpans: { x1: number; x2: number }[] = [];
  let x = 18;
  let n = 0;
  GROUPS.forEach((count, g) => {
    const start = x;
    for (let i = 0; i < count; i++) {
      ticks.push({ x, g, i: n++ });
      x += 15;
    }
    groupSpans.push({ x1: start - 4, x2: x - 11 });
    x += 26;
  });

  return (
    <svg ref={ref} viewBox="0 0 520 250" className={`vision-art ${inView ? 'is-active' : ''}`} aria-hidden="true">
      <text x="18" y="26" className="vision-art__label">
        PER-FRAME CLASSIFICATIONS · 23
      </text>
      <line x1="10" x2="510" y1="88" y2="88" className="vision-art__axis" />
      {ticks.map((t) => (
        <rect
          key={t.i}
          x={t.x}
          y={50}
          width={7}
          height={38}
          rx={2}
          className="vision-art__tick"
          style={{ transitionDelay: `${t.i * 35}ms` }}
        />
      ))}
      {groupSpans.map((s, i) => (
        <path
          key={i}
          d={`M${(s.x1 + s.x2) / 2} 98 V 150`}
          className="vision-art__link"
          style={{ transitionDelay: `${900 + i * 120}ms` }}
        />
      ))}
      <text x="18" y="244" className="vision-art__label">
        ALERTS AFTER 30 S COOLDOWN · 4
      </text>
      {groupSpans.map((s, i) => (
        <g key={i} className="vision-art__event" style={{ transitionDelay: `${1000 + i * 120}ms` }}>
          <rect x={s.x1} y={156} width={s.x2 - s.x1} height={52} rx={9} />
          <text x={s.x1 + 10} y={187}>
            EVENT {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
