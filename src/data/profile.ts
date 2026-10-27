// Every fact here comes from Guna_Bala_Resume.pdf or links supplied by Guna.
// Keep it that way: do not add claims that are not in those sources.

export const profile = {
  name: 'Guna Bala D',
  role: 'AI/ML Engineer',
  location: 'Puducherry, India',
  email: 'gunad202004@gmail.com',
  github: 'https://github.com/GunaBala-D',
  githubLabel: 'github.com/GunaBala-D',
  linkedin: 'https://linkedin.com/in/guna-bala-a00457374',
  linkedinLabel: 'linkedin.com/in/guna-bala-a00457374',
  resume: '/Guna_Bala_Resume.pdf',
  certificatesFolder:
    'https://drive.google.com/drive/folders/1CkISYgDStHFL7hvkpxCzDoI9zJ3jHg-t?usp=sharing',
  languages: ['Tamil (Native)', 'English (Professional Proficiency)'],
};

export type Highlight = { value: string; label: string };

export type Role = {
  company: string;
  title: string;
  period: string;
  location?: string;
  summary: string;
  highlights?: Highlight[];
  points: string[];
  stack?: string[];
};

export const experience: Role[] = [
  {
    company: 'Srikesh Infotech (SKIT)',
    title: 'AI/ML Engineer',
    period: 'Sep 2025 — Present',
    location: 'Puducherry, India',
    summary:
      'Building LLM, retrieval and anomaly-detection systems for internal business operations, and maintaining production Odoo ERP modules alongside AI/ML work.',
    highlights: [
      { value: '7', label: 'internal teams adopted the Accounting Co-Pilot' },
      { value: '1,000+', label: 'accounting and operational records grounding RAG answers' },
      { value: '15,000+', label: 'daily log events scored for anomalies' },
    ],
    points: [
      'Built an internal Accounting Co-Pilot using Anthropic Claude and self-hosted Ollama as interchangeable LLM backends for natural-language queries over live business records.',
      'Designed a RAG pipeline on PostgreSQL/pgvector to ground LLM responses in 1,000+ accounting and operational records, using document chunking and re-ranking to improve retrieval precision.',
      'Built an OCR pipeline (pdfplumber, pytesseract) to digitize source documents for ingestion into the retrieval system.',
      'Developed a LangGraph agentic workflow that retrieves similar past incidents from ChromaDB to ground anomaly explanations, integrating Model Context Protocol (MCP) to connect the agent to external tools and data sources.',
      'Built an unsupervised anomaly-detection pipeline (Isolation Forest, Local Outlier Factor) over 15,000+ daily log events, tuned with grid and random search, surfacing results in a live dashboard for real-time monitoring.',
      'Re-architected a script-based ML tool into a production FastAPI microservice with modular inference endpoints on AWS EC2, reducing manual triage time by an estimated 40–50%.',
      'Maintained production Odoo ERP modules (Python, Odoo ORM, OWL) alongside AI/ML development.',
    ],
    stack: [
      'Anthropic Claude',
      'Ollama',
      'PostgreSQL / pgvector',
      'ChromaDB',
      'LangGraph',
      'MCP',
      'scikit-learn',
      'FastAPI',
      'AWS EC2',
      'Odoo',
    ],
  },
  {
    company: 'Twilight IT Solution',
    title: 'Web Development Intern',
    period: 'Jun 2025',
    summary: 'Front-end development internship.',
    points: [
      'Built a customer-facing website using HTML, CSS and JavaScript, translating design requirements into a responsive, cross-browser front end.',
      'Implemented interactive UI components and page layouts with vanilla JavaScript.',
    ],
    stack: ['HTML', 'CSS', 'JavaScript'],
  },
];

// Anomaly-detection metrics as stated on the resume (approximate, hence the "~").
export const anomalyMetrics = [
  { label: 'Precision', value: 90 },
  { label: 'Recall', value: 88 },
  { label: 'F1', value: 89 },
];

export const education = {
  school: 'Rajiv Gandhi College of Engineering and Technology',
  degree: 'B.Tech in Information Technology',
  note: 'Graduated with A Grade',
  period: '2021 — 2025',
  location: 'Puducherry, India',
};

export type Certification = { name: string; issuer: string; date?: string; href?: string };

export const certifications: Certification[] = [
  {
    name: 'Building with the Claude API',
    issuer: 'Anthropic · Claude Academy',
    href: profile.certificatesFolder,
  },
  {
    name: 'Introduction to Model Context Protocol',
    issuer: 'Anthropic · Claude Academy',
    href: profile.certificatesFolder,
  },
  { name: 'Claude Code 101', issuer: 'Anthropic · Claude Academy', href: profile.certificatesFolder },
  { name: 'Apply AI at Work Pathway', issuer: 'OpenAI Academy', date: 'Sep 2026' },
  { name: 'Introduction to Large Language Models', issuer: 'Google' },
  { name: 'AWS for Beginners', issuer: 'AWS' },
];

export type SkillGroup = { title: string; note: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    title: 'Generative AI & LLM applications',
    note: 'Provider-agnostic LLM integration, prompting and structured outputs',
    items: [
      'Anthropic Claude',
      'Ollama',
      'Gemini',
      'Prompt Engineering',
      'LLM Integration',
      'Model Context Protocol (MCP)',
    ],
  },
  {
    title: 'Retrieval & agent workflows',
    note: 'Grounded answers with citations, routing and tool use',
    items: [
      'RAG',
      'Embeddings',
      'Semantic Search',
      'Chunking',
      'Re-ranking',
      'Hybrid Search',
      'LangGraph',
      'Agentic Workflows',
    ],
  },
  {
    title: 'Machine learning',
    note: 'Classical ML, anomaly detection and evaluation',
    items: [
      'scikit-learn',
      'Pandas',
      'NumPy',
      'Supervised & Unsupervised Learning',
      'Isolation Forest',
      'Local Outlier Factor',
      'Feature Engineering',
      'Model Evaluation',
      'Hyperparameter Tuning',
    ],
  },
  {
    title: 'Deep learning & computer vision',
    note: 'Detection and real-time video pipelines',
    items: ['PyTorch', 'YOLO', 'OpenCV'],
  },
  {
    title: 'Backend & data',
    note: 'Services that put models behind reliable APIs',
    items: [
      'Python',
      'SQL',
      'FastAPI',
      'REST APIs',
      'Microservices',
      'Async Programming',
      'PostgreSQL',
      'pgvector',
      'ChromaDB',
    ],
  },
  {
    title: 'Cloud & tooling',
    note: 'Deployment, packaging and document ingestion',
    items: ['AWS (EC2)', 'Docker', 'Git / GitHub', 'OCR (pdfplumber, pytesseract)'],
  },
];
