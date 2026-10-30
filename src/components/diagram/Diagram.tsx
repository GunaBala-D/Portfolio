import { useId, type ReactNode } from 'react';
import type { StageKind } from '../../data/projects';
import { useInView } from '../../hooks/useInView';

export type Side = 'l' | 'r' | 't' | 'b';

export type DNode = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string | string[];
  kind: StageKind;
  tag?: string;
  dashed?: boolean;
  emphasis?: boolean;
};

export type DEdge = {
  from: string;
  to: string;
  fs?: Side;
  ts?: Side;
  /** Coordinate of the elbow (x for horizontal links, y for vertical ones). */
  via?: number;
  dashed?: boolean;
  flow?: boolean;
  label?: string;
  labelAt?: { x: number; y: number };
};

export type DGroup = { x: number; y: number; w: number; h: number; label: string };

export type DiagramSpec = {
  w: number;
  h: number;
  nodes: DNode[];
  edges: DEdge[];
  groups?: DGroup[];
  /** Multiplier for all text sizes; card art uses a larger value so it stays legible when scaled down. */
  textScale?: number;
  /** Hide the kind tag row (used by compact card art). */
  compact?: boolean;
};

const KIND_TAG: Record<StageKind, string> = {
  input: 'INPUT',
  code: 'CODE',
  model: 'MODEL',
  llm: 'LLM',
  store: 'STORE',
  human: 'HUMAN',
  output: 'OUTPUT',
};

type Pt = { x: number; y: number };

function anchor(n: DNode, side: Side): Pt {
  switch (side) {
    case 'l':
      return { x: n.x, y: n.y + n.h / 2 };
    case 'r':
      return { x: n.x + n.w, y: n.y + n.h / 2 };
    case 't':
      return { x: n.x + n.w / 2, y: n.y };
    case 'b':
      return { x: n.x + n.w / 2, y: n.y + n.h };
  }
}

function autoSides(a: DNode, b: DNode): [Side, Side] {
  const dx = b.x + b.w / 2 - (a.x + a.w / 2);
  const dy = b.y + b.h / 2 - (a.y + a.h / 2);
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? ['r', 'l'] : ['l', 'r'];
  return dy >= 0 ? ['b', 't'] : ['t', 'b'];
}

const isH = (s: Side) => s === 'l' || s === 'r';

function routePoints(p1: Pt, p2: Pt, s1: Side, s2: Side, via?: number): Pt[] {
  if (isH(s1) && isH(s2)) {
    if (Math.abs(p1.y - p2.y) < 0.5) return [p1, p2];
    const mx = via ?? (p1.x + p2.x) / 2;
    return [p1, { x: mx, y: p1.y }, { x: mx, y: p2.y }, p2];
  }
  if (!isH(s1) && !isH(s2)) {
    if (Math.abs(p1.x - p2.x) < 0.5) return [p1, p2];
    const my = via ?? (p1.y + p2.y) / 2;
    return [p1, { x: p1.x, y: my }, { x: p2.x, y: my }, p2];
  }
  if (isH(s1)) return [p1, { x: p2.x, y: p1.y }, p2];
  return [p1, { x: p1.x, y: p2.y }, p2];
}

/** Polyline → path with rounded corners. */
function toPath(pts: Pt[], radius = 10): string {
  const first = pts[0]!;
  let d = `M${first.x} ${first.y}`;
  for (let i = 1; i < pts.length; i++) {
    const cur = pts[i]!;
    const next = pts[i + 1];
    if (!next) {
      d += ` L${cur.x} ${cur.y}`;
      break;
    }
    const prev = pts[i - 1]!;
    const lenIn = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    const lenOut = Math.hypot(next.x - cur.x, next.y - cur.y);
    const r = Math.min(radius, lenIn / 2, lenOut / 2);
    const inX = cur.x - ((cur.x - prev.x) / (lenIn || 1)) * r;
    const inY = cur.y - ((cur.y - prev.y) / (lenIn || 1)) * r;
    const outX = cur.x + ((next.x - cur.x) / (lenOut || 1)) * r;
    const outY = cur.y + ((next.y - cur.y) / (lenOut || 1)) * r;
    d += ` L${inX} ${inY} Q${cur.x} ${cur.y} ${outX} ${outY}`;
  }
  return d;
}

type Props = {
  spec: DiagramSpec;
  title: string;
  description?: string;
  className?: string;
  decorative?: boolean;
  children?: ReactNode;
};

export function Diagram({ spec, title, description, className, decorative, children }: Props) {
  const uid = useId().replace(/:/g, '');
  const [ref, inView] = useInView<SVGSVGElement>({ rootMargin: '0px 0px -10% 0px' });
  const t = spec.textScale ?? 1;
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  let flowIndex = 0;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${spec.w} ${spec.h}`}
      className={`dg ${inView ? 'is-active' : ''} ${className ?? ''}`}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-labelledby={decorative ? undefined : `${uid}-t ${description ? `${uid}-d` : ''}`.trim()}
      focusable="false"
    >
      {!decorative && <title id={`${uid}-t`}>{title}</title>}
      {!decorative && description && <desc id={`${uid}-d`}>{description}</desc>}
      <defs>
        <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1 L9 5 L0 9" fill="none" stroke="var(--line-strong)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id={`${uid}-arrow-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1 L9 5 L0 9" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {spec.groups?.map((g) => (
        <g key={g.label} className="dg-group">
          <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={14} />
          <text x={g.x + 14} y={g.y + 20 * t} fontSize={10.5 * t}>
            {g.label}
          </text>
        </g>
      ))}

      {spec.edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const [as, bs] = autoSides(a, b);
        const s1 = e.fs ?? as;
        const s2 = e.ts ?? bs;
        const d = toPath(routePoints(anchor(a, s1), anchor(b, s2), s1, s2, e.via));
        const delay = e.flow ? flowIndex++ * 0.45 : 0;
        return (
          <g key={`${e.from}-${e.to}-${i}`} className={`dg-edge ${e.dashed ? 'is-dashed' : ''} ${e.flow ? 'is-flow' : ''}`}>
            <path
              d={d}
              className="dg-edge__line"
              markerEnd={`url(#${uid}-arrow${e.flow ? '-a' : ''})`}
            />
            {e.flow && <path d={d} className="dg-edge__pulse" pathLength={100} style={{ animationDelay: `${delay}s` }} />}
            {e.label && e.labelAt && (
              <text x={e.labelAt.x} y={e.labelAt.y} className="dg-edge__label" fontSize={10.5 * t}>
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {spec.nodes.map((n) => {
        const subs = n.sub === undefined ? [] : Array.isArray(n.sub) ? n.sub : [n.sub];
        const tagH = spec.compact ? 0 : 16 * t;
        const lineH = 15 * t;
        const blockH = tagH + 17 * t + subs.length * lineH;
        const top = n.y + (n.h - blockH) / 2;
        return (
          <g
            key={n.id}
            className={`dg-node ${n.dashed ? 'is-dashed' : ''} ${n.emphasis ? 'is-emphasis' : ''}`}
            data-kind={n.kind}
          >
            <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={10} className="dg-node__box" />
            {!spec.compact && (
              <text x={n.x + 14} y={top + 10 * t} className="dg-node__tag" fontSize={9.5 * t}>
                {n.tag ?? KIND_TAG[n.kind]}
              </text>
            )}
            <text x={n.x + 14} y={top + tagH + 13 * t} className="dg-node__label" fontSize={14 * t}>
              {n.label}
            </text>
            {subs.map((s, i) => (
              <text key={s} x={n.x + 14} y={top + tagH + 13 * t + (i + 1) * lineH} className="dg-node__sub" fontSize={11.5 * t}>
                {s}
              </text>
            ))}
          </g>
        );
      })}
      {children}
    </svg>
  );
}
