import type { DiagramSpec } from './Diagram';

// Architecture diagrams. Every node and edge reflects a component documented in the project README
// (or, for the work diagram, a resume bullet). Layout coordinates are in viewBox units.

const H = 72;

export const supportPilotArch: DiagramSpec = {
  w: 1120,
  h: 540,
  nodes: [
    { id: 'ui', x: 0, y: 220, w: 140, h: H, label: 'Console', sub: ['React + TS'], kind: 'input' },
    { id: 'api', x: 180, y: 220, w: 140, h: H, label: 'FastAPI', sub: ['rate limit', 'request IDs'], kind: 'code' },
    { id: 'router', x: 360, y: 220, w: 150, h: H, label: 'Router', sub: ['rules → LLM', 'fallback'], kind: 'llm', emphasis: true },
    { id: 'kb', x: 560, y: 24, w: 220, h: H, label: 'Knowledge', sub: ['retrieve 12 → rerank → top 4', 'context → Ollama'], kind: 'llm' },
    { id: 'tools', x: 560, y: 122, w: 220, h: H, label: 'Tools', sub: ['validate · authorise', 'confirm · audit (SQL)'], kind: 'code' },
    { id: 'confirm', x: 560, y: 220, w: 220, h: H, label: 'Confirm', sub: ['runs a pending action', 'after an explicit "yes"'], kind: 'code' },
    { id: 'unknown', x: 560, y: 318, w: 220, h: H, label: 'Unknown', sub: ['capability menu'], kind: 'code' },
    { id: 'esc', x: 560, y: 416, w: 220, h: H, label: 'Escalate', sub: ['create_support_ticket', '→ human agent inbox'], kind: 'human' },
    { id: 'val', x: 830, y: 220, w: 140, h: H, label: 'Validator', sub: ['citation, terms,', 'numbers'], kind: 'code', emphasis: true },
    { id: 'out', x: 1010, y: 220, w: 110, h: H, label: 'Reply', sub: ['+ sources', '+ trace'], kind: 'output' },
  ],
  edges: [
    { from: 'ui', to: 'api', flow: true },
    { from: 'api', to: 'router', flow: true },
    { from: 'router', to: 'kb', fs: 'r', ts: 'l', via: 535, flow: true },
    { from: 'router', to: 'tools', fs: 'r', ts: 'l', via: 535 },
    { from: 'router', to: 'confirm', fs: 'r', ts: 'l' },
    { from: 'router', to: 'unknown', fs: 'r', ts: 'l', via: 535 },
    { from: 'router', to: 'esc', fs: 'r', ts: 'l', via: 535 },
    { from: 'kb', to: 'val', fs: 'r', ts: 'l', via: 805, flow: true },
    { from: 'tools', to: 'val', fs: 'r', ts: 'l', via: 805 },
    { from: 'confirm', to: 'val', fs: 'r', ts: 'l' },
    { from: 'unknown', to: 'val', fs: 'r', ts: 'l', via: 805 },
    { from: 'esc', to: 'val', fs: 'r', ts: 'l', via: 805 },
    { from: 'val', to: 'out', flow: true },
    {
      from: 'val',
      to: 'esc',
      fs: 'b',
      ts: 'b',
      via: 520,
      dashed: true,
      label: 'escalate once if validation fails',
      labelAt: { x: 812, y: 535 },
    },
  ],
};

export const documentRiskArch: DiagramSpec = {
  w: 1120,
  h: 500,
  nodes: [
    { id: 'up', x: 0, y: 110, w: 140, h: H, label: 'Upload', sub: ['magic-byte', 'validation'], kind: 'input' },
    { id: 'ext', x: 175, y: 110, w: 150, h: H, label: 'Extraction', sub: ['PyMuPDF · docx', 'OCR fallback'], kind: 'code' },
    { id: 'sec', x: 360, y: 110, w: 150, h: H, label: 'Sections', sub: ['15 entities,', 'section-scoped'], kind: 'code' },
    { id: 'feat', x: 545, y: 110, w: 160, h: H, label: 'Features', sub: ['29 · point-in-time', 'vendor history'], kind: 'code' },
    { id: 'clf', x: 770, y: 10, w: 160, h: H, label: 'LightGBM', sub: ['risk classifier'], kind: 'model' },
    { id: 'ano', x: 770, y: 110, w: 160, h: H, label: 'Isolation Forest', sub: ['+ vendor checks'], kind: 'model' },
    { id: 'rules', x: 770, y: 210, w: 160, h: H, label: 'Compliance', sub: ['15 YAML rules'], kind: 'code' },
    { id: 'score', x: 975, y: 110, w: 145, h: H, label: 'Risk score', sub: ['0–100', 'w 40·25·25·10'], kind: 'output', emphasis: true },
    { id: 'exp', x: 975, y: 250, w: 145, h: H, label: 'Explain', sub: ['SHAP factors', 'LLM: prose only'], kind: 'llm' },
    { id: 'mon', x: 545, y: 290, w: 160, h: H, label: 'Monitoring', sub: ['PSI · KS · χ² drift', 'performance'], kind: 'code', dashed: true },
    { id: 'rev', x: 975, y: 410, w: 145, h: H, label: 'Human review', sub: ['confirm / correct', 'four-eyes check'], kind: 'human' },
    { id: 'retrain', x: 770, y: 410, w: 160, h: H, label: 'Retraining', sub: ['validated labels', '+ drift or decay'], kind: 'code' },
    { id: 'gate', x: 545, y: 410, w: 160, h: H, label: 'Quality gate', sub: ['recall + F1', 'minimums'], kind: 'code' },
    { id: 'reg', x: 360, y: 410, w: 150, h: H, label: 'MLflow registry', sub: ['@production', 'served by API'], kind: 'store' },
  ],
  edges: [
    { from: 'up', to: 'ext', flow: true },
    { from: 'ext', to: 'sec', flow: true },
    { from: 'sec', to: 'feat', flow: true },
    { from: 'feat', to: 'clf', fs: 'r', ts: 'l', via: 738, flow: true },
    { from: 'feat', to: 'ano', fs: 'r', ts: 'l', flow: true },
    { from: 'feat', to: 'rules', fs: 'r', ts: 'l', via: 738, flow: true },
    { from: 'clf', to: 'score', fs: 'r', ts: 'l', via: 953 },
    { from: 'ano', to: 'score', fs: 'r', ts: 'l' },
    { from: 'rules', to: 'score', fs: 'r', ts: 'l', via: 953 },
    { from: 'score', to: 'exp', fs: 'b', ts: 't' },
    { from: 'exp', to: 'rev', fs: 'b', ts: 't' },
    { from: 'rev', to: 'retrain' },
    { from: 'mon', to: 'retrain', fs: 'r', ts: 't', dashed: true },
    { from: 'retrain', to: 'gate' },
    { from: 'gate', to: 'reg' },
  ],
};

export const ragArch: DiagramSpec = {
  w: 1120,
  h: 410,
  groups: [
    { x: 0, y: 0, w: 920, h: 150, label: 'Ingestion · background task' },
    { x: 0, y: 260, w: 1120, h: 150, label: 'Question answering · streamed' },
  ],
  nodes: [
    { id: 'up', x: 20, y: 52, w: 140, h: H, label: 'Upload', sub: ['validated'], kind: 'input' },
    { id: 'parse', x: 195, y: 52, w: 150, h: H, label: 'Parse + clean', sub: ['PDF · DOCX · TXT', 'MD · CSV'], kind: 'code' },
    { id: 'chunk', x: 380, y: 52, w: 140, h: H, label: 'Chunk', sub: ['page numbers', 'preserved'], kind: 'code' },
    { id: 'embed', x: 555, y: 52, w: 150, h: H, label: 'Embed', sub: ['sentence-', 'transformers'], kind: 'model' },
    { id: 'pg', x: 950, y: 52, w: 160, h: H, label: 'PostgreSQL', sub: ['history, feedback,', 'processing status'], kind: 'store' },
    { id: 'vdb', x: 760, y: 172, w: 150, h: H, label: 'ChromaDB', sub: ['persistent, local'], kind: 'store', emphasis: true },
    { id: 'q', x: 20, y: 312, w: 140, h: H, label: 'Question', sub: ['chat or search'], kind: 'input' },
    { id: 'ret', x: 195, y: 312, w: 150, h: H, label: 'Retriever', sub: ['top-K +', 'similarity floor'], kind: 'code' },
    { id: 'rr', x: 380, y: 312, w: 140, h: H, label: 'Reranker', sub: ['optional', 'cross-encoder'], kind: 'model', dashed: true },
    { id: 'ctx', x: 555, y: 312, w: 150, h: H, label: 'Context', sub: ['grounded prompt'], kind: 'code' },
    { id: 'llm', x: 760, y: 312, w: 150, h: H, label: 'LLMProvider', sub: ['Ollama | Gemini'], kind: 'llm' },
    { id: 'ans', x: 950, y: 312, w: 160, h: H, label: 'SSE answer', sub: ['+ page / chunk', 'citations'], kind: 'output' },
  ],
  edges: [
    { from: 'up', to: 'parse', flow: true },
    { from: 'parse', to: 'chunk', flow: true },
    { from: 'chunk', to: 'embed', flow: true },
    { from: 'embed', to: 'vdb', fs: 'r', ts: 't', flow: true },
    { from: 'q', to: 'ret', flow: true },
    { from: 'ret', to: 'vdb', fs: 't', ts: 'l', label: 'similarity search', labelAt: { x: 420, y: 196 } },
    { from: 'ret', to: 'rr', flow: true },
    { from: 'rr', to: 'ctx', flow: true },
    { from: 'ctx', to: 'llm', flow: true },
    { from: 'llm', to: 'ans', flow: true },
    { from: 'ans', to: 'pg', fs: 't', ts: 'b', dashed: true },
  ],
};

export const resumeIqArch: DiagramSpec = {
  w: 1120,
  h: 360,
  groups: [
    { x: 0, y: 0, w: 1120, h: 150, label: 'LLM · Groq structured outputs' },
    { x: 0, y: 200, w: 1120, h: 160, label: 'Code · deterministic' },
  ],
  nodes: [
    { id: 's1', x: 10, y: 250, w: 150, h: 76, label: 'Validate', sub: ['NFKC, size bounds', 'injection scan'], kind: 'code' },
    { id: 's2', x: 170, y: 52, w: 150, h: 76, label: 'Requirements', sub: ['atomic,', 'quoted from JD'], kind: 'llm' },
    { id: 's3', x: 330, y: 52, w: 150, h: 76, label: 'Profile & match', sub: ['numbered lines', '→ line refs'], kind: 'llm' },
    { id: 's4', x: 490, y: 250, w: 150, h: 76, label: 'Verify', sub: ['term in cited line?', 'else downgrade'], kind: 'code', emphasis: true },
    { id: 's5', x: 650, y: 250, w: 150, h: 76, label: 'Score & ATS', sub: ['weighted,', 'N/A re-normalised'], kind: 'code', emphasis: true },
    { id: 's6', x: 810, y: 52, w: 150, h: 76, label: 'Recommend', sub: ['gaps, rewrites', 'of real lines'], kind: 'llm' },
    { id: 's7', x: 960, y: 250, w: 150, h: 76, label: 'Finalize', sub: ['rewrite guard,', 'Zod validation'], kind: 'code' },
  ],
  edges: [
    { from: 's1', to: 's2', fs: 'r', ts: 'l', flow: true },
    { from: 's2', to: 's3', flow: true },
    { from: 's3', to: 's4', fs: 'r', ts: 'l', flow: true },
    { from: 's4', to: 's5', flow: true },
    { from: 's5', to: 's6', fs: 'r', ts: 'l', flow: true },
    { from: 's6', to: 's7', fs: 'r', ts: 'l', via: 975, flow: true },
  ],
};

export const visionArch: DiagramSpec = {
  w: 1120,
  h: 450,
  groups: [{ x: 0, y: 0, w: 1120, h: 150, label: 'CameraWorker · one thread per camera' }],
  nodes: [
    { id: 'cam', x: 15, y: 52, w: 145, h: H, label: 'Camera', sub: ['webcam · RTSP', 'video file'], kind: 'input' },
    { id: 'yolo', x: 195, y: 52, w: 145, h: H, label: 'YOLOv8n', sub: ['person boxes', 'conf ≥ 0.50'], kind: 'model' },
    { id: 'track', x: 375, y: 52, w: 145, h: H, label: 'ByteTrack', sub: ['stable track_id'], kind: 'model' },
    { id: 'face', x: 555, y: 52, w: 160, h: H, label: 'InsightFace', sub: ['SCRFD → ArcFace', '512-d embedding'], kind: 'model' },
    { id: 'match', x: 750, y: 52, w: 160, h: H, label: 'Matcher', sub: ['cosine ≥ 0.45', 'else UNKNOWN'], kind: 'code' },
    { id: 'event', x: 945, y: 52, w: 160, h: H, label: 'Event engine', sub: ['30 s cooldown', 'per track'], kind: 'code', emphasis: true },
    { id: 'store', x: 720, y: 220, w: 170, h: H, label: 'PostgreSQL', sub: ['events + snapshot', 'on new events only'], kind: 'store' },
    { id: 'ws', x: 945, y: 350, w: 160, h: H, label: '/ws/live', sub: ['WebSocket', 'broadcast'], kind: 'code' },
    { id: 'api', x: 440, y: 220, w: 170, h: H, label: 'FastAPI', sub: ['REST + MJPEG', 'stream'], kind: 'code' },
    { id: 'ui', x: 440, y: 350, w: 230, h: H, label: 'React dashboard', sub: ['live boxes, events,', 'analytics'], kind: 'output' },
  ],
  edges: [
    { from: 'cam', to: 'yolo', flow: true },
    { from: 'yolo', to: 'track', flow: true },
    { from: 'track', to: 'face', flow: true },
    { from: 'face', to: 'match', flow: true },
    { from: 'match', to: 'event', flow: true },
    { from: 'event', to: 'store', fs: 'b', ts: 'r' },
    { from: 'event', to: 'ws', fs: 'b', ts: 't', flow: true, label: 'run_coroutine_threadsafe', labelAt: { x: 850, y: 338 } },
    { from: 'ws', to: 'ui', fs: 'l', ts: 'r', flow: true },
    { from: 'api', to: 'store', dashed: true },
    { from: 'ui', to: 'api', fs: 't', ts: 'b', dashed: true },
  ],
};

export const workSystemsArch: DiagramSpec = {
  w: 1120,
  h: 390,
  groups: [
    { x: 0, y: 0, w: 1120, h: 140, label: 'Retrieval-grounded LLM answers' },
    { x: 0, y: 170, w: 1120, h: 220, label: 'Anomaly monitoring' },
  ],
  nodes: [
    { id: 'docs', x: 15, y: 46, w: 150, h: H, label: 'Source documents', sub: ['to digitise'], kind: 'input' },
    { id: 'ocr', x: 200, y: 46, w: 150, h: H, label: 'OCR', sub: ['pdfplumber,', 'pytesseract'], kind: 'code' },
    { id: 'chunk', x: 385, y: 46, w: 140, h: H, label: 'Chunking', sub: ['documents → chunks'], kind: 'code' },
    { id: 'pgv', x: 560, y: 46, w: 160, h: H, label: 'pgvector', sub: ['1,000+ accounting +', 'operational records'], kind: 'store', emphasis: true },
    { id: 'rr', x: 755, y: 46, w: 140, h: H, label: 'Re-ranking', sub: ['retrieval precision'], kind: 'code' },
    { id: 'llm', x: 930, y: 46, w: 175, h: H, label: 'LLM response', sub: ['Claude ⇄ Ollama', 'interchangeable'], kind: 'llm' },
    { id: 'logs', x: 15, y: 214, w: 150, h: H, label: 'Log events', sub: ['15,000+ per day'], kind: 'input' },
    { id: 'iso', x: 200, y: 214, w: 210, h: H, label: 'Isolation Forest + LOF', sub: ['unsupervised; grid +', 'random search tuning'], kind: 'model', emphasis: true },
    { id: 'dash', x: 200, y: 310, w: 210, h: 64, label: 'Live dashboard', sub: ['real-time monitoring'], kind: 'output' },
    { id: 'agent', x: 460, y: 214, w: 190, h: H, label: 'LangGraph agent', sub: ['grounded anomaly', 'explanations'], kind: 'llm' },
    { id: 'chroma', x: 700, y: 214, w: 180, h: H, label: 'ChromaDB', sub: ['similar past', 'incidents'], kind: 'store' },
    { id: 'mcp', x: 930, y: 214, w: 175, h: H, label: 'MCP', sub: ['external tools', '+ data sources'], kind: 'code' },
  ],
  edges: [
    { from: 'docs', to: 'ocr', flow: true },
    { from: 'ocr', to: 'chunk', flow: true },
    { from: 'chunk', to: 'pgv', flow: true },
    { from: 'pgv', to: 'rr', flow: true },
    { from: 'rr', to: 'llm', flow: true },
    { from: 'logs', to: 'iso', flow: true },
    { from: 'iso', to: 'dash', fs: 'b', ts: 't' },
    { from: 'iso', to: 'agent', flow: true },
    { from: 'agent', to: 'chroma' },
    { from: 'chroma', to: 'mcp', dashed: true },
  ],
};

// ---------- Compact card art ----------

const C = { textScale: 1.2, compact: true } as const;

export const supportPilotCard: DiagramSpec = {
  ...C,
  w: 520,
  h: 300,
  nodes: [
    { id: 'r', x: 0, y: 122, w: 112, h: 56, label: 'Router', kind: 'llm', emphasis: true },
    { id: 'k', x: 170, y: 4, w: 160, h: 44, label: 'Knowledge', kind: 'llm' },
    { id: 't', x: 170, y: 68, w: 160, h: 44, label: 'Tools', kind: 'code' },
    { id: 'c', x: 170, y: 128, w: 160, h: 44, label: 'Confirm', kind: 'code' },
    { id: 'u', x: 170, y: 188, w: 160, h: 44, label: 'Unknown', kind: 'code' },
    { id: 'e', x: 170, y: 252, w: 160, h: 44, label: 'Escalate', kind: 'human' },
    { id: 'v', x: 388, y: 122, w: 132, h: 56, label: 'Validator', kind: 'code', emphasis: true },
  ],
  edges: [
    { from: 'r', to: 'k', fs: 'r', ts: 'l', via: 140, flow: true },
    { from: 'r', to: 't', fs: 'r', ts: 'l', via: 140 },
    { from: 'r', to: 'c', fs: 'r', ts: 'l' },
    { from: 'r', to: 'u', fs: 'r', ts: 'l', via: 140 },
    { from: 'r', to: 'e', fs: 'r', ts: 'l', via: 140 },
    { from: 'k', to: 'v', fs: 'r', ts: 'l', via: 360, flow: true },
    { from: 't', to: 'v', fs: 'r', ts: 'l', via: 360 },
    { from: 'c', to: 'v', fs: 'r', ts: 'l' },
    { from: 'u', to: 'v', fs: 'r', ts: 'l', via: 360 },
    { from: 'e', to: 'v', fs: 'r', ts: 'l', via: 360 },
  ],
};

export const documentRiskCard: DiagramSpec = {
  ...C,
  w: 520,
  h: 260,
  nodes: [
    { id: 'doc', x: 0, y: 104, w: 104, h: 52, label: 'Contract', kind: 'input' },
    { id: 'f', x: 134, y: 104, w: 104, h: 52, label: 'Features', kind: 'code' },
    { id: 'm', x: 270, y: 14, w: 128, h: 48, label: 'LightGBM', kind: 'model' },
    { id: 'a', x: 270, y: 106, w: 128, h: 48, label: 'Anomaly', kind: 'model' },
    { id: 'r', x: 270, y: 198, w: 128, h: 48, label: 'Rules', kind: 'code' },
    { id: 's', x: 428, y: 100, w: 92, h: 60, label: 'Score', kind: 'output', emphasis: true },
  ],
  edges: [
    { from: 'doc', to: 'f', flow: true },
    { from: 'f', to: 'm', fs: 'r', ts: 'l', via: 254, flow: true },
    { from: 'f', to: 'a', fs: 'r', ts: 'l', flow: true },
    { from: 'f', to: 'r', fs: 'r', ts: 'l', via: 254, flow: true },
    { from: 'm', to: 's', fs: 'r', ts: 'l', via: 413 },
    { from: 'a', to: 's', fs: 'r', ts: 'l' },
    { from: 'r', to: 's', fs: 'r', ts: 'l', via: 413 },
  ],
};

export const ragCard: DiagramSpec = {
  ...C,
  w: 520,
  h: 250,
  nodes: [
    { id: 'd', x: 0, y: 14, w: 104, h: 48, label: 'Docs', kind: 'input' },
    { id: 'c', x: 134, y: 14, w: 104, h: 48, label: 'Chunks', kind: 'code' },
    { id: 'v', x: 268, y: 14, w: 132, h: 48, label: 'ChromaDB', kind: 'store', emphasis: true },
    { id: 'q', x: 0, y: 186, w: 104, h: 48, label: 'Question', kind: 'input' },
    { id: 'k', x: 134, y: 186, w: 104, h: 48, label: 'Top-K', kind: 'code' },
    { id: 'l', x: 268, y: 186, w: 104, h: 48, label: 'LLM', kind: 'llm' },
    { id: 'a', x: 402, y: 186, w: 118, h: 48, label: 'Answer [1]', kind: 'output' },
  ],
  edges: [
    { from: 'd', to: 'c', flow: true },
    { from: 'c', to: 'v', flow: true },
    { from: 'q', to: 'k', flow: true },
    { from: 'k', to: 'v', fs: 't', ts: 'b', via: 124 },
    { from: 'k', to: 'l', flow: true },
    { from: 'l', to: 'a', flow: true },
  ],
};

export const resumeIqCard: DiagramSpec = {
  ...C,
  w: 520,
  h: 250,
  nodes: [
    { id: 'r', x: 0, y: 40, w: 112, h: 48, label: 'Resume', kind: 'input' },
    { id: 'j', x: 0, y: 160, w: 112, h: 48, label: 'Job desc.', kind: 'input' },
    { id: 'm', x: 144, y: 98, w: 104, h: 52, label: 'LLM', kind: 'llm' },
    { id: 'v', x: 280, y: 98, w: 104, h: 52, label: 'Verify', kind: 'code', emphasis: true },
    { id: 's', x: 416, y: 98, w: 104, h: 52, label: 'Score', kind: 'output', emphasis: true },
    { id: 'd', x: 268, y: 200, w: 128, h: 44, label: 'Downgrade', kind: 'code', dashed: true },
  ],
  edges: [
    { from: 'r', to: 'm', fs: 'r', ts: 'l', via: 128, flow: true },
    { from: 'j', to: 'm', fs: 'r', ts: 'l', via: 128 },
    { from: 'm', to: 'v', flow: true },
    { from: 'v', to: 's', flow: true },
    { from: 'v', to: 'd', fs: 'b', ts: 't', dashed: true },
  ],
};

export const ARCH_SPECS: Record<string, { spec: DiagramSpec; hasDashed: boolean }> = {
  supportpilot: { spec: supportPilotArch, hasDashed: true },
  'document-risk-engine': { spec: documentRiskArch, hasDashed: true },
  'enterprise-rag': { spec: ragArch, hasDashed: true },
  resumeiq: { spec: resumeIqArch, hasDashed: false },
  'ai-vision-monitor': { spec: visionArch, hasDashed: true },
};
