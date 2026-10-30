// Artwork for the hero spiral. Every number and name comes from profile.ts / projects.ts;
// the charts are illustrations of what each system does, not plots of real data.

export const CARD_W = 640;
export const CARD_H = 400;

export type GalaxyCard = { canvas: HTMLCanvasElement; to: string; label: string };

type Ctx = CanvasRenderingContext2D;
type Hues = [string, string, string];

const DISPLAY = '"Archivo Variable", Archivo, system-ui, sans-serif';
const MONO = '"Geist Mono Variable", "Geist Mono", ui-monospace, monospace';

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function backdrop(c: Ctx, [a, b, glow]: Hues, seed: number) {
  const g = c.createLinearGradient(0, 0, CARD_W, CARD_H);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  c.fillStyle = g;
  c.fillRect(0, 0, CARD_W, CARD_H);
  const rand = seeded(seed);
  const light = c.createRadialGradient(CARD_W * rand(), CARD_H * rand(), 0, CARD_W / 2, CARD_H / 2, CARD_W * 0.8);
  light.addColorStop(0, glow);
  light.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = light;
  c.fillRect(0, 0, CARD_W, CARD_H);
}

function display(c: Ctx, text: string, x: number, y: number, size: number, color = '#fff', align: CanvasTextAlign = 'left') {
  c.font = `620 ${size}px ${DISPLAY}`;
  try {
    c.fontStretch = 'expanded';
  } catch {
    /* older canvas implementations ignore font-stretch */
  }
  c.letterSpacing = `${-size * 0.03}px`;
  c.textAlign = align;
  c.fillStyle = color;
  c.fillText(text, x, y);
}

function label(c: Ctx, text: string, x: number, y: number, size = 15, color = 'rgba(255,255,255,0.72)', align: CanvasTextAlign = 'left') {
  c.font = `500 ${size}px ${MONO}`;
  c.fontStretch = 'normal';
  c.letterSpacing = `${size * 0.1}px`;
  c.textAlign = align;
  c.fillStyle = color;
  c.fillText(text.toUpperCase(), x, y);
}

function box(c: Ctx, x: number, y: number, w: number, h: number, fill: string, stroke = 'rgba(255,255,255,0.4)') {
  c.beginPath();
  c.roundRect(x, y, w, h, 8);
  c.fillStyle = fill;
  c.fill();
  c.lineWidth = 1.5;
  c.strokeStyle = stroke;
  c.stroke();
}

function metric(c: Ctx, hues: Hues, seed: number, kicker: string, value: string, lines: string[]) {
  backdrop(c, hues, seed);
  label(c, kicker, 36, 56);
  const size = value.length > 8 ? 74 : 112;
  display(c, value, 32, 214, size);
  lines.forEach((l, i) => {
    c.font = `500 25px ${DISPLAY}`;
    c.fontStretch = 'normal';
    c.letterSpacing = '0px';
    c.textAlign = 'left';
    c.fillStyle = 'rgba(255,255,255,0.86)';
    c.fillText(l, 36, 288 + i * 34);
  });
}

function routeGraph(c: Ctx) {
  backdrop(c, ['#043a3f', '#0a7563', 'rgba(63,214,184,0.55)'], 11);
  label(c, 'SupportPilot', 36, 56);
  label(c, 'LangGraph agent', 604, 56, 15, 'rgba(255,255,255,0.72)', 'right');
  box(c, 36, 170, 150, 66, 'rgba(255,255,255,0.14)');
  display(c, 'Turn', 111, 212, 25, '#fff', 'center');
  const dest = ['Grounded RAG', 'Safe tools', 'Escalation'];
  dest.forEach((d, i) => {
    const y = 88 + i * 94;
    c.strokeStyle = 'rgba(255,255,255,0.65)';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(186, 203);
    c.bezierCurveTo(250, 203, 250, y + 33, 320, y + 33);
    c.stroke();
    box(c, 320, y, 284, 66, i === 0 ? '#3fe6ae' : 'rgba(255,255,255,0.14)');
    display(c, d, 462, y + 42, 25, i === 0 ? '#04302c' : '#fff', 'center');
  });
  label(c, '47-case eval', 36, 368);
}

function citations(c: Ctx) {
  backdrop(c, ['#141a55', '#4c6ef5', 'rgba(141,162,251,0.6)'], 23);
  label(c, 'Enterprise RAG', 36, 56);
  box(c, 196, 84, 408, 62, 'rgba(255,255,255,0.92)', 'transparent');
  c.fillStyle = '#141a55';
  c.fillRect(220, 110, 280, 9);
  c.fillRect(220, 126, 170, 7);
  box(c, 36, 166, 470, 128, 'rgba(10,14,60,0.62)');
  [0.92, 0.78, 0.86, 0.42].forEach((w, i) => {
    c.fillStyle = 'rgba(255,255,255,0.78)';
    c.fillRect(60, 190 + i * 22, 420 * w, 8);
  });
  ['1', '2'].forEach((n, i) => {
    box(c, 60 + 410 * 0.42 + 14 + i * 40, 247, 32, 28, '#ffc14d', 'transparent');
    display(c, n, 60 + 410 * 0.42 + 30 + i * 40, 268, 19, '#141a55', 'center');
  });
  display(c, 'Ollama ⇄ Gemini', 36, 352, 34);
}

function anomalies(c: Ctx) {
  backdrop(c, ['#3a0f0a', '#b83a24', 'rgba(255,138,112,0.5)'], 37);
  label(c, 'Anomaly detection', 36, 56);
  const rand = seeded(90210);
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(6.283 * rand());
  for (let i = 0; i < 260; i++) {
    c.fillStyle = 'rgba(255,235,225,0.72)';
    c.beginPath();
    c.arc(330 + gauss() * 95, 200 + gauss() * 46, 3.2, 0, 7);
    c.fill();
  }
  [[92, 110], [560, 118], [120, 292], [566, 276], [476, 92]].forEach(([x, y]) => {
    c.fillStyle = '#ffc14d';
    c.beginPath();
    c.arc(x!, y!, 7, 0, 7);
    c.fill();
    c.strokeStyle = '#ffc14d';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(x!, y!, 18, 0, 7);
    c.stroke();
  });
  label(c, 'Isolation Forest + LOF', 36, 368);
}

function clusters(c: Ctx) {
  backdrop(c, ['#07262c', '#14a3c7', 'rgba(76,199,230,0.5)'], 41);
  label(c, 'Vector retrieval', 36, 56);
  const rand = seeded(424242);
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(6.283 * rand());
  const groups: [number, number, string][] = [
    [160, 150, '#ffc14d'],
    [440, 130, '#ff7ab8'],
    [320, 250, '#f2f1ee'],
    [520, 280, '#5ee089'],
    [120, 300, '#b69cff'],
  ];
  let near: [number, number][] = [];
  groups.forEach(([x, y, color], g) => {
    for (let i = 0; i < 44; i++) {
      const px = x + gauss() * 34;
      const py = y + gauss() * 26;
      if (g === 2 && i < 5) near.push([px, py]);
      c.fillStyle = color;
      c.beginPath();
      c.arc(px, py, 3, 0, 7);
      c.fill();
    }
  });
  near = near.slice(0, 5);
  const q: [number, number] = [340, 188];
  near.forEach(([x, y]) => {
    c.strokeStyle = '#fff';
    c.lineWidth = 1.6;
    c.beginPath();
    c.moveTo(q[0], q[1]);
    c.lineTo(x, y);
    c.stroke();
  });
  c.fillStyle = '#fff';
  c.beginPath();
  c.arc(q[0], q[1], 8, 0, 7);
  c.fill();
  label(c, '1,000+ records · pgvector', 36, 368);
}

function scoreBars(c: Ctx) {
  backdrop(c, ['#4a1405', '#f26b1d', 'rgba(255,179,71,0.6)'], 53);
  label(c, 'ResumeIQ', 36, 56);
  display(c, 'LLM ≠ score', 34, 142, 62);
  [0.86, 0.64, 0.74, 0.48].forEach((w, i) => {
    const y = 186 + i * 40;
    c.fillStyle = 'rgba(0,0,0,0.25)';
    c.fillRect(36, y, 568, 18);
    c.fillStyle = i === 0 ? '#fff' : 'rgba(255,255,255,0.72)';
    c.fillRect(36, y, 568 * w, 18);
  });
  label(c, 'Deterministic arithmetic', 36, 372);
}

function detections(c: Ctx) {
  backdrop(c, ['#0c1410', '#1f4d33', 'rgba(94,224,137,0.28)'], 67);
  c.strokeStyle = 'rgba(255,255,255,0.07)';
  c.lineWidth = 1;
  for (let x = 0; x < CARD_W; x += 40) {
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, CARD_H);
    c.stroke();
  }
  for (let y = 0; y < CARD_H; y += 40) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(CARD_W, y);
    c.stroke();
  }
  label(c, 'AI Vision Monitor', 36, 56);
  [[70, 110, 130, 190], [250, 90, 112, 210], [410, 136, 170, 150]].forEach(([x, y, w, h], i) => {
    c.fillStyle = 'rgba(94,224,137,0.14)';
    c.fillRect(x!, y!, w!, h!);
    c.strokeStyle = '#5ee089';
    c.lineWidth = 2.5;
    c.strokeRect(x!, y!, w!, h!);
    c.fillStyle = '#5ee089';
    c.fillRect(x!, y! - 22, 74, 22);
    label(c, `0${i + 1}`, x! + 8, y! - 6, 14, '#07170d');
  });
  display(c, '23 → 4', 36, 366, 44);
  label(c, 'YOLO + OpenCV', 604, 366, 15, 'rgba(255,255,255,0.72)', 'right');
}

function gauges(c: Ctx) {
  backdrop(c, ['#22104f', '#8b5cf6', 'rgba(192,143,255,0.55)'], 71);
  label(c, 'Unsupervised evaluation', 36, 56);
  const items: [string, number][] = [
    ['Precision', 90],
    ['Recall', 88],
    ['F1', 89],
  ];
  items.forEach(([name, v], i) => {
    const x = 118 + i * 202;
    const y = 206;
    c.lineWidth = 15;
    c.strokeStyle = 'rgba(255,255,255,0.18)';
    c.beginPath();
    c.arc(x, y, 70, 0, 7);
    c.stroke();
    c.strokeStyle = '#fff';
    c.beginPath();
    c.arc(x, y, 70, -1.571, -1.571 + (6.283 * v) / 100);
    c.stroke();
    display(c, `~${v}%`, x, y + 11, 29, '#fff', 'center');
    label(c, name, x, 322, 14, 'rgba(255,255,255,0.8)', 'center');
  });
  label(c, 'After grid and random search', 36, 372);
}

function agent(c: Ctx) {
  backdrop(c, ['#2a0a22', '#e0368f', 'rgba(255,122,184,0.5)'], 83);
  label(c, 'Agent workflow', 36, 56);
  const nodes: [number, number, string][] = [
    [70, 110, 'Anomaly'],
    [330, 110, 'ChromaDB'],
    [70, 230, 'LangGraph'],
    [330, 230, 'MCP tools'],
  ];
  c.strokeStyle = 'rgba(255,255,255,0.72)';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(170, 150);
  c.lineTo(170, 230);
  c.moveTo(310, 262);
  c.lineTo(330, 262);
  c.moveTo(250, 240);
  c.lineTo(350, 180);
  c.stroke();
  nodes.forEach(([x, y, t], i) => {
    box(c, x, y, 240, 66, i === 2 ? '#fff' : 'rgba(255,255,255,0.16)');
    display(c, t, x + 120, y + 42, 24, i === 2 ? '#2a0a22' : '#fff', 'center');
  });
  label(c, 'Explains anomalies from past incidents', 36, 368, 14);
}

function stack(c: Ctx) {
  backdrop(c, ['#1d2e05', '#7bb51c', 'rgba(166,224,74,0.5)'], 97);
  label(c, 'Backend & deployment', 36, 56);
  ['FastAPI', 'AWS EC2', 'Docker', 'PostgreSQL'].forEach((t, i) => {
    const y = 88 + i * 66;
    box(c, 36, y, 568, 54, i === 0 ? '#f2f1ee' : 'rgba(0,0,0,0.26)', 'rgba(255,255,255,0.36)');
    display(c, t, 58, y + 37, 26, i === 0 ? '#1d2e05' : '#fff');
  });
  label(c, '40–50% less manual triage (est.)', 36, 378, 14);
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

function cover(c: Ctx, img: HTMLImageElement, focusY = 0) {
  const s = Math.max(CARD_W / img.naturalWidth, CARD_H / img.naturalHeight);
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  c.drawImage(img, (CARD_W - w) / 2, (CARD_H - h) * focusY, w, h);
}

export async function buildCards(): Promise<GalaxyCard[]> {
  await Promise.all([
    document.fonts.load(`620 40px ${DISPLAY}`),
    document.fonts.load(`500 15px ${MONO}`),
  ]).catch(() => undefined);

  const make = (to: string, label: string, draw: (c: Ctx) => void): GalaxyCard | null => {
    const canvas = document.createElement('canvas');
    canvas.width = CARD_W;
    canvas.height = CARD_H;
    const c = canvas.getContext('2d');
    if (!c) return null;
    draw(c);
    return { canvas, to, label };
  };

  const [shot1, shot2, shot3, portrait] = await Promise.all([
    loadImage('/images/drisk-01_overview.jpg'),
    loadImage('/images/drisk-02_document_risk_summary.jpg'),
    loadImage('/images/drisk-03_explainability_shap_llm.jpg'),
    loadImage('/images/guna-bala-cutout-720.png'),
  ]);

  const risk = '/projects/document-risk-engine';
  const cards = [
    make('/projects/supportpilot', 'SupportPilot', routeGraph),
    shot1 && make(risk, 'Document Risk Engine', (c) => cover(c, shot1)),
    make('/#experience', 'Accounting Co-Pilot', (c) =>
      metric(c, ['#0a2a66', '#2f7bf5', 'rgba(127,176,255,0.6)'], 101, 'Accounting Co-Pilot', '7', ['internal teams adopted', 'the Co-Pilot I built'])),
    make('/projects/enterprise-rag', 'Enterprise RAG', citations),
    make('/#experience', 'Anomaly detection', anomalies),
    portrait &&
      make('/#about', 'About Guna', (c) => {
        backdrop(c, ['#f2a516', '#b83a24', 'rgba(255,214,120,0.9)'], 7);
        cover(c, portrait, 0.14);
      }),
    make('/projects/resumeiq', 'ResumeIQ', scoreBars),
    shot2 && make(risk, 'Document Risk Engine', (c) => cover(c, shot2)),
    make(risk, 'Document Risk Engine', (c) =>
      metric(c, ['#0a3a2a', '#02da96', 'rgba(63,230,174,0.5)'], 113, 'Document Risk Engine', '0.946', ['HIGH+CRITICAL recall on a', '600-contract synthetic test set'])),
    make('/projects/ai-vision-monitor', 'AI Vision Monitor', detections),
    make('/#experience', 'Vector retrieval', clusters),
    make('/#experience', 'Model evaluation', gauges),
    shot3 && make(risk, 'Document Risk Engine', (c) => cover(c, shot3, 0.1)),
    make('/#experience', 'Agent workflow', agent),
    make('/#experience', 'Log events', (c) =>
      metric(c, ['#3a2600', '#f2a516', 'rgba(255,193,77,0.6)'], 127, 'Live operations', '15,000+', ['daily log events scored', 'for anomalies'])),
    make('/#experience', 'Backend & deployment', stack),
  ];
  return cards.filter((c): c is GalaxyCard => !!c);
}
