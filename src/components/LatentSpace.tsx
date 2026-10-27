import { useEffect, useRef, useState } from 'react';

// An illustrative 3D embedding space of the domains I work in. A query point moves between clusters
// and links to its top-k nearest neighbours, the same operation a vector search performs.
// Positions are synthetic: this is a visual metaphor, not data.

type RGB = [number, number, number];
type V3 = [number, number, number];

const CLUSTERS: { label: string; color: RGB; c: V3 }[] = [
  { label: 'LLM applications', color: [167, 139, 250], c: [0.58, 0.34, 0.12] },
  { label: 'Retrieval · RAG', color: [34, 211, 238], c: [-0.52, 0.4, -0.22] },
  { label: 'Agent workflows', color: [96, 165, 250], c: [0.04, -0.06, 0.66] },
  { label: 'Classical ML', color: [52, 211, 153], c: [-0.5, -0.46, 0.22] },
  { label: 'Computer vision', color: [251, 191, 36], c: [0.44, -0.44, -0.5] },
];

const K = 5;
const PER_CLUSTER = 46;
const NOISE = 70;

type P = { x: number; y: number; z: number; k: number };

function buildPoints() {
  let s = 20250901;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
  const pts: P[] = [];
  CLUSTERS.forEach((cl, k) => {
    for (let i = 0; i < PER_CLUSTER; i++) {
      pts.push({ x: cl.c[0] + gauss() * 0.15, y: cl.c[1] + gauss() * 0.15, z: cl.c[2] + gauss() * 0.15, k });
    }
  });
  for (let i = 0; i < NOISE; i++) {
    const u = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const r = Math.cbrt(rand()) * 1.05;
    const q = Math.sqrt(1 - u * u);
    pts.push({ x: r * q * Math.cos(t), y: r * u, z: r * q * Math.sin(t), k: -1 });
  }
  // Two nearest neighbours inside each cluster form the faint manifold edges.
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  pts.forEach((p, i) => {
    if (p.k < 0) return;
    const near = pts
      .map((o, j) => ({ j, d: o.k === p.k && j !== i ? (o.x - p.x) ** 2 + (o.y - p.y) ** 2 + (o.z - p.z) ** 2 : Infinity }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    });
  });
  return { pts, edges };
}

const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

export function LatentSpace() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { pts, edges } = buildPoints();
    const proj = pts.map(() => ({ x: 0, y: 0, z: 0, s: 1 }));
    let w = 0;
    let h = 0;
    let rotY = 0.6;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let target = 1;
    let q: V3 = [...CLUSTERS[1]!.c];
    let lastSwitch = performance.now();
    let raf = 0;
    let visible = true;
    let startedAt = performance.now();

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!raf) draw(performance.now());
    };

    const project = (x: number, y: number, z: number, cosY: number, sinY: number, cosX: number, sinX: number) => {
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      const fov = 2.8;
      const s = fov / (fov + z2);
      const scale = Math.min(w, h) * 0.4;
      return { x: w / 2 + x1 * s * scale, y: h / 2 + y1 * s * scale, z: z2, s };
    };

    const depthAlpha = (z: number) => Math.max(0.12, Math.min(1, 0.62 - z * 0.45));

    function draw(now: number) {
      ctx!.clearRect(0, 0, w, h);
      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;
      const ry = rotY + tiltX;
      const rx = 0.32 + tiltY;
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);

      // Orbit rings give the space a sense of volume.
      ctx!.lineWidth = 1;
      for (let ring = 0; ring < 3; ring++) {
        ctx!.beginPath();
        for (let i = 0; i <= 72; i++) {
          const t = (i / 72) * Math.PI * 2;
          const a = Math.cos(t) * 1.08;
          const b = Math.sin(t) * 1.08;
          const [x, y, z] = ring === 0 ? [a, 0, b] : ring === 1 ? [a, b, 0] : [0, a, b];
          const p = project(x, y, z, cosY, sinY, cosX, sinX);
          if (i === 0) ctx!.moveTo(p.x, p.y);
          else ctx!.lineTo(p.x, p.y);
        }
        ctx!.strokeStyle = 'rgba(148,163,255,0.07)';
        ctx!.stroke();
      }

      pts.forEach((p, i) => {
        proj[i] = project(p.x, p.y, p.z, cosY, sinY, cosX, sinX);
      });

      // Manifold edges
      ctx!.lineWidth = 0.8;
      for (const [a, b] of edges) {
        const pa = proj[a]!;
        const pb = proj[b]!;
        const cl = CLUSTERS[pts[a]!.k]!;
        const al = depthAlpha((pa.z + pb.z) / 2) * (pts[a]!.k === target ? 0.4 : 0.18);
        ctx!.strokeStyle = rgba(cl.color, al);
        ctx!.beginPath();
        ctx!.moveTo(pa.x, pa.y);
        ctx!.lineTo(pb.x, pb.y);
        ctx!.stroke();
      }

      // Query point eases toward the active cluster; switch clusters every few seconds.
      if (!reduce && now - lastSwitch > 4200) {
        target = (target + 1) % CLUSTERS.length;
        lastSwitch = now;
        setActive(target);
      }
      const tc = CLUSTERS[target]!.c;
      const wob = reduce ? 0 : Math.sin(now / 900) * 0.04;
      const goal: V3 = [tc[0] * 0.78 + wob, tc[1] * 0.78 - wob, tc[2] * 0.78 + 0.08];
      q = [q[0] + (goal[0] - q[0]) * 0.035, q[1] + (goal[1] - q[1]) * 0.035, q[2] + (goal[2] - q[2]) * 0.035];

      const nn = pts
        .map((p, i) => ({ i, d: (p.x - q[0]) ** 2 + (p.y - q[1]) ** 2 + (p.z - q[2]) ** 2 }))
        .sort((a, b) => a.d - b.d)
        .slice(0, K);
      const nnSet = new Set(nn.map((n) => n.i));
      const qp = project(q[0], q[1], q[2], cosY, sinY, cosX, sinX);

      // Points, far to near
      const order = proj.map((_, i) => i).sort((a, b) => proj[b]!.z - proj[a]!.z);
      for (const i of order) {
        const p = pts[i]!;
        const pp = proj[i]!;
        const al = depthAlpha(pp.z);
        const r = (p.k < 0 ? 1 : 1.7) * pp.s * (nnSet.has(i) ? 1.8 : 1);
        const color: RGB = p.k < 0 ? [148, 163, 200] : CLUSTERS[p.k]!.color;
        ctx!.fillStyle = rgba(color, p.k < 0 ? al * 0.45 : al * (p.k === target ? 1 : 0.7));
        ctx!.beginPath();
        ctx!.arc(pp.x, pp.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Retrieval links: query → top-k
      const tcol = CLUSTERS[target]!.color;
      for (const n of nn) {
        const pp = proj[n.i]!;
        const grad = ctx!.createLinearGradient(qp.x, qp.y, pp.x, pp.y);
        grad.addColorStop(0, 'rgba(255,255,255,0.85)');
        grad.addColorStop(1, rgba(tcol, 0.55));
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.moveTo(qp.x, qp.y);
        ctx!.lineTo(pp.x, pp.y);
        ctx!.stroke();
        ctx!.strokeStyle = rgba(tcol, 0.8);
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(pp.x, pp.y, 5 * pp.s, 0, Math.PI * 2);
        ctx!.stroke();
      }

      // Query glyph with a soft pulse
      const pulse = reduce ? 0.5 : ((now - startedAt) % 2200) / 2200;
      const glow = ctx!.createRadialGradient(qp.x, qp.y, 0, qp.x, qp.y, 34);
      glow.addColorStop(0, 'rgba(255,255,255,0.35)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(qp.x, qp.y, 34, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = `rgba(255,255,255,${(1 - pulse) * 0.6})`;
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      ctx!.arc(qp.x, qp.y, 6 + pulse * 18, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.fillStyle = '#ffffff';
      ctx!.beginPath();
      ctx!.arc(qp.x, qp.y, 4, 0, Math.PI * 2);
      ctx!.fill();

      // Cluster labels
      ctx!.font = '500 11px "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';
      CLUSTERS.forEach((cl, k) => {
        const c = project(cl.c[0] * 1.32, cl.c[1] * 1.32, cl.c[2] * 1.32, cosY, sinY, cosX, sinX);
        const al = Math.max(0.25, depthAlpha(c.z)) * (k === target ? 1 : 0.6);
        const text = cl.label.toUpperCase();
        // Keep labels inside the canvas on narrow screens.
        const lx = Math.min(Math.max(c.x, 18), w - ctx!.measureText(text).width - 8);
        const ly = Math.min(Math.max(c.y, 56), h - 60);
        ctx!.fillStyle = rgba(cl.color, al);
        ctx!.beginPath();
        ctx!.arc(lx - 8, ly - 4, 2.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = `rgba(226,230,255,${al.toFixed(3)})`;
        ctx!.fillText(text, lx, ly);
      });

      if (!reduce) rotY += 0.0016;
    }

    const loop = (now: number) => {
      draw(now);
      raf = visible && !reduce ? requestAnimationFrame(loop) : 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible && !raf && !reduce) {
        lastSwitch = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      targetTiltX = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
      targetTiltY = ((e.clientY - r.top) / r.height - 0.5) * 0.3;
    };
    const onLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    if (!reduce) raf = requestAnimationFrame(loop);
    else draw(performance.now());
    startedAt = performance.now();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const cl = CLUSTERS[active]!;
  return (
    <div className="latent">
      <div ref={wrapRef} className="latent__stage">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Illustrative 3D embedding space with five clusters for my work areas: LLM applications, retrieval and RAG, agent workflows, classical ML and computer vision. A query point retrieves its five nearest neighbours."
        />
      </div>
      <div className="latent__hud" aria-hidden="true">
        <span className="latent__chip mono">
          <i className="latent__live" /> embedding space
        </span>
        <span className="latent__chip mono">top-k = {K}</span>
      </div>
      <div className="latent__query mono" aria-hidden="true">
        <span className="latent__q-label">query →</span>
        <span className="latent__q-target" style={{ color: `rgb(${cl.color.join(',')})` }} key={active}>
          {cl.label}
        </span>
      </div>
    </div>
  );
}
