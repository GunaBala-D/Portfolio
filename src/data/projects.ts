// Project content is taken from each repository's README (fetched Oct 2026) and the resume.
// Numbers are quoted with the qualifiers the READMEs give them. Do not round them up or drop the context.

export type StageKind = 'input' | 'code' | 'model' | 'llm' | 'store' | 'human' | 'output';

export type Stage = { label: string; detail: string; kind: StageKind };

export type Metric = { value: string; label: string };

export type Note = { title: string; body: string };

export type Screenshot = { src: string; alt: string; caption: string; width: number; height: number };

export type Project = {
  slug: string;
  name: string;
  alias?: string;
  index: string;
  tagline: string;
  cardProblem: string;
  cardHighlight: Metric;
  status: string;
  tags: string[];
  repo: string;
  demo?: string;
  seo: string;
  overview: string;
  problem: string[];
  solution: string;
  architectureCaption: string;
  stages: Stage[];
  implementation: { area: string; detail: string }[];
  decisions: Note[];
  reliability: Note[];
  metrics?: Metric[];
  metricsNote?: string;
  contribution: string;
  findings: string[];
  limitations: string[];
  screenshots?: Screenshot[];
  weights?: { title: string; caption: string; rows: { label: string; value: number }[] };
  comparison?: {
    title: string;
    caption: string;
    columns: string[];
    rows: { name: string; values: string[]; selected?: boolean }[];
  };
};

export const projects: Project[] = [
  {
    slug: 'supportpilot',
    name: 'SupportPilot',
    alias: 'Customer Support Agent',
    index: '01',
    tagline:
      'A local-first support agent that answers from documents with citations, acts on orders through permission-checked tools, and hands off to a human when it should.',
    cardProblem:
      'Plain support chatbots invent policies, cannot act on real data, and never hand off. This LangGraph agent routes each turn to grounded RAG, safe tools or escalation.',
    cardHighlight: { value: '47-case eval', label: '100% routing and tool-call accuracy, 0% hallucination rate' },
    status: 'Runs fully local on Ollama · sample data for a fictional store',
    tags: ['LangGraph', 'RAG', 'Ollama', 'FastAPI', 'ChromaDB', 'React + TS'],
    repo: 'https://github.com/GunaBala-D/Customer_support_Agent',
    seo: 'SupportPilot case study: a LangGraph customer-support agent with grounded RAG, citation mapping, permission-checked tools, human escalation and a 47-case evaluation harness.',
    overview:
      'SupportPilot is a customer-support and operations agent that runs entirely on a local machine. A local LLM served by Ollama answers policy questions from retrieved documents with citations, looks up and manages orders through tools that check permissions, and opens a support ticket for a human when the conversation calls for it. The sample knowledge base and orders belong to a fictional store.',
    problem: [
      'Support teams answer the same questions and run the same lookups all day, and a plain chatbot fails at that work in three ways.',
      'It invents policies. It cannot act on real data. And it never hands off when it is out of its depth.',
    ],
    solution:
      'Each turn goes through a LangGraph state machine. A router sends it to a knowledge branch (retrieve, rerank, build context, generate), a tools branch (validate, authorise, confirm, audit), a confirmation branch, an escalation branch or a capability menu. Every answer then passes a validator that can reject it and escalate.',
    architectureCaption:
      'The router picks one branch per turn, and every branch converges on the validator before anything reaches the user.',
    stages: [
      { label: 'React + TS console', detail: 'Chat, inspector panel, agent inbox, admin', kind: 'input' },
      { label: 'FastAPI', detail: 'Rate limiting, request IDs, JWT roles', kind: 'code' },
      { label: 'Router', detail: 'Regex rules first; LLM JSON-mode classification as fallback', kind: 'llm' },
      { label: 'Knowledge branch', detail: 'Retrieve 12 → rerank → top 4 → context → Ollama', kind: 'model' },
      { label: 'Tools branch', detail: 'Validate · authorise · confirm · audit over SQL', kind: 'code' },
      { label: 'Escalate', detail: 'create_support_ticket into the human agent inbox', kind: 'human' },
      { label: 'Validator', detail: 'Citation, grounding and number checks before replying', kind: 'code' },
    ],
    implementation: [
      { area: 'Agent', detail: 'LangGraph graph with router, knowledge, tools, confirm, escalate and unknown nodes; short-term memory per conversation (last order ID, pending confirmation, counters).' },
      { area: 'Retrieval', detail: 'Loaders for PDF, DOCX, Markdown and TXT; ~800-character chunks with 120 characters of overlap and heading paths; nomic-embed-text embeddings in ChromaDB.' },
      { area: 'Reranking', detail: 'Fetch 12 candidates, re-score as 0.5 × cosine similarity + 0.5 × query-term coverage, keep those above RAG_MIN_SCORE, return the top 4.' },
      { area: 'Tools', detail: 'get_order_status, get_order_items, get_customer_details, check_refund_eligibility, create_support_ticket and cancel_order, all through one run_tool executor.' },
      { area: 'Backend', detail: 'Python 3.12, FastAPI, SQLAlchemy 2, Alembic migrations, SQLite or PostgreSQL, optional Redis cache.' },
      { area: 'Interface', detail: 'React 18 + TypeScript console with chat, a "How this was handled" panel, an agent inbox, and admin settings for swapping the LLM and database.' },
    ],
    decisions: [
      {
        title: 'Rules first, LLM second',
        body: 'Regexes handle the high-precision cases (human requests, cancellations, order references). The LLM only classifies when rules are inconclusive, and its output is checked against the intent list. Order IDs are extracted by regex, never by the model.',
      },
      {
        title: 'The model never writes citations',
        body: 'The prompt asks for [n] markers, which are mapped back to chunks that were actually in the prompt. Markers pointing at chunks that do not exist are dropped.',
      },
      {
        title: 'Tool answers come from templates',
        body: 'Order dates, tracking numbers and totals are rendered from templates rather than generated, so a small model cannot paraphrase them wrongly. The LLM is reserved for classification fallback and grounded knowledge answers.',
      },
      {
        title: 'A lower threshold, on purpose',
        body: 'Raising RAG_MIN_SCORE from 0.30 to 0.50 lifted precision@k from 68% to 76%, but cut source recall from 100% to 96% and caused a false refusal. The threshold stays at 0.30 and the validator acts as the safety net.',
      },
    ],
    reliability: [
      { title: 'No evidence, no generation', body: 'If no chunk passes the threshold, the LLM is not called. The grounded prompt must reply INSUFFICIENT_CONTEXT when the context does not cover the question.' },
      { title: 'Validator', body: 'Answers need a citation, at least 60% of their content terms must appear in the context, and every number must appear in the context.' },
      { title: 'Destructive-action gate', body: 'cancel_order refuses without an explicit confirmation on the following turn. Ownership checks return the same message for "not yours" and "does not exist", so order IDs cannot be probed.' },
      { title: 'Escalation', body: 'After one failure the agent offers a human. After a second in a row it opens a ticket automatically.' },
      { title: 'Observability', body: 'Each reply stores latency, LLM, retrieval and tool timings, chunk counts and scores, plus structured events and an X-Request-ID. No chain-of-thought is stored.' },
      { title: 'Security', body: 'JWT login with scrypt-hashed passwords, roles re-read from the database on every request, per-IP rate limits, and parameterised SQL. Personal data is never cached.' },
    ],
    metrics: [
      { value: '100%', label: 'Routing accuracy' },
      { value: '100%', label: 'Tool-call accuracy' },
      { value: '100%', label: 'Citation correctness' },
      { value: '0%', label: 'Hallucination rate' },
      { value: '93–96%', label: 'Answer correctness (phrase match)' },
      { value: '68%', label: 'Retrieval precision@k' },
      { value: '~3 s', label: 'p95 latency per turn' },
      { value: '178', label: 'pytest tests' },
    ],
    metricsNote:
      'Measured with llama3.2:3b and nomic-embed-text on 47 evaluation cases (28 answerable, 7 unanswerable, 12 tool and multi-turn flows) on a CPU-only Windows PC. LLM sampling is not fully deterministic, so results vary slightly between runs.',
    contribution:
      'Independent project published on my GitHub. I designed and built the agent graph, retrieval pipeline, tool layer, evaluation harness, backend and console.',
    findings: [
      'Precision@k was the weak metric. nomic-embed-text scores unrelated chunks around 0.55 cosine, so a 0.30 blended threshold lets 4 chunks through even when 1 is enough.',
      'Testing against a real model found bugs that offline test doubles missed: numbered-list answers wrongly rejected as "unsupported numbers", and an embedding-server outage that produced a generic error. Each fix has a regression test.',
      'The grounding check is lexical. It catches invented numbers and off-context answers, but not a fluent answer that reuses context words to say something false.',
    ],
    limitations: [
      'Routing rules are English-only regexes.',
      'No streaming responses; a 3B model on CPU can take several seconds per answer.',
      'Docker images and the PostgreSQL and Redis containers have not been run. The CI workflow commands were run locally but have not yet run on GitHub.',
    ],
  },
  {
    slug: 'document-risk-engine',
    name: 'Document Risk Engine',
    alias: 'Document Risk Analysis',
    index: '02',
    tagline:
      'An end-to-end ML system that reads vendor contracts, predicts risk, flags anomalies and policy violations, explains why, and learns from validated human review.',
    cardProblem:
      'Manual contract review is slow and inconsistent. This pipeline triages contracts with ML, YAML policy rules and anomaly detection, and keeps a human in charge of the decision.',
    cardHighlight: { value: '0.946', label: 'HIGH+CRITICAL recall on a 600-contract synthetic test set' },
    status: 'All data is synthetic · CI passes on GitHub Actions',
    tags: ['LightGBM', 'SHAP', 'MLflow', 'Isolation Forest', 'FastAPI', 'Ollama'],
    repo: 'https://github.com/GunaBala-D/Document_risk_analysis',
    seo: 'Document Risk Engine case study: contract risk classification with LightGBM, SHAP explanations, YAML compliance rules, anomaly detection, MLflow quality gates and drift monitoring.',
    overview:
      'The Document Risk Engine answers one question for a procurement or compliance analyst: is this contract risky, why, and what should I do about it? It covers extraction, feature engineering, classification, anomaly detection, policy rules, explainability, human review, monitoring and gated retraining. All contracts are generated from fictional vendors, so every metric describes the synthetic corpus, not real contracts.',
    problem: [
      'Organisations sign thousands of vendor contracts. An analyst has to find the commercial terms, check them against procurement policy, compare them with the vendor’s history, and decide whether to escalate.',
      'Missing a contract with unlimited liability or 180-day payment terms is costly. Reviewing every routine contract in full is wasteful.',
    ],
    solution:
      'Three independent signals (an ML classifier, anomaly detection and deterministic compliance rules) combine into a 0–100 risk score. SHAP explains the model, and a local LLM only turns that structured evidence into prose. Reviewers confirm or correct each result, a second person validates their feedback, and only validated labels are used for retraining.',
    architectureCaption:
      'Three independent signals feed one weighted score. The LLM sits off the critical path and only explains evidence it is given.',
    stages: [
      { label: 'Upload & validation', detail: 'Size limit, extension allow-list, magic-byte sniffing', kind: 'input' },
      { label: 'Text extraction', detail: 'PyMuPDF / python-docx; Tesseract OCR for pages without a text layer', kind: 'code' },
      { label: 'Sections & entities', detail: '15 fields, each searched inside its own section first', kind: 'code' },
      { label: 'Feature engineering', detail: '29 features, including point-in-time vendor history', kind: 'code' },
      { label: 'Three signals', detail: 'LightGBM classifier · Isolation Forest + vendor checks · 15 YAML rules', kind: 'model' },
      { label: 'Risk score 0–100', detail: 'Weights 40 / 25 / 25 / 10, plus guardrail floors', kind: 'output' },
      { label: 'SHAP + LLM narrative', detail: 'TreeExplainer factors; Ollama explains structured evidence only', kind: 'llm' },
      { label: 'Human review', detail: 'Confirm or correct, then four-eyes validation', kind: 'human' },
    ],
    implementation: [
      { area: 'Extraction', detail: 'PyMuPDF and python-docx; pages with fewer than 50 characters are rasterised at 300 dpi and OCR’d with Tesseract. Regex extraction is scoped to its section, with support for Lakh/Crore amounts and DD/MM dates.' },
      { area: 'Features', detail: '29 declared features (version fv3) across contract terms, point-in-time vendor history, behaviour, text signals and policy indicators. The same builder runs in training and serving.' },
      { area: 'Modelling', detail: 'Four model families × three imbalance strategies with 5-fold StratifiedKFold and RandomizedSearchCV, then multi-class threshold tuning on out-of-fold predictions. LightGBM with SMOTE was selected.' },
      { area: 'MLOps', detail: 'MLflow tracking and registry with @staging, @production and @previous aliases, plus a quality gate in YAML. The API refuses a model whose feature version differs from the serving code.' },
      { area: 'Monitoring', detail: 'Data drift (PSI + KS / χ²), prediction drift, performance against validated labels, and service health, built with numpy/scipy and stored in PostgreSQL.' },
      { area: 'Application', detail: 'FastAPI with role-based API keys, SQLAlchemy 2 + Alembic, and a React + TypeScript dashboard with hand-built SVG charts. Docker Compose and GitHub Actions CI.' },
    ],
    decisions: [
      {
        title: 'The LLM never decides risk',
        body: 'Ollama receives only structured evidence (score, violations, anomalies, SHAP factors), never contract text. Its output is constrained to a JSON schema and post-checked, and the system works fully without it.',
      },
      {
        title: 'Accuracy is never the selection criterion',
        body: 'The selected model has the best cross-validated macro-F1 among those that meet the recall constraints, and the simpler family wins within 0.01. Threshold tuning raised HIGH+CRITICAL recall from 0.873 to 0.946 at the same macro-F1.',
      },
      {
        title: 'Policy is configuration, not a model',
        body: 'The 15 compliance rules are declarative YAML with severity and remediation, so a policy change is an edit rather than a retrain. Missing facts raise a data-quality warning instead of a violation.',
      },
      {
        title: 'Drift alone never retrains',
        body: 'Retraining runs only with at least 50 new validated labels and either data drift or measured degradation. Candidates must pass the same frozen test set and quality gate.',
      },
    ],
    reliability: [
      { title: 'Quality gate', body: 'Minimum macro-F1 0.75, PR-AUC 0.80, HIGH+CRITICAL recall 0.90, CRITICAL recall 0.70 and escalation recall 0.95, plus regression limits. Of 9 classifier versions, 2 passed, including against two deliberately corrupted candidates.' },
      { title: 'Degraded mode', body: 'If a score component is unavailable, the remaining components are re-weighted and the result is marked degraded. A database outage returns 503 and an OCR failure returns 422 with the reason.' },
      { title: 'Four-eyes review', body: 'Reviewers cannot validate their own feedback. Consistency flags, such as a label below HIGH despite a CRITICAL violation, go to a risk manager.' },
      { title: 'Tested invariants', body: '136 tests, including SHAP additivity against the real model output, Ollama, classifier and database outages, and a check that raw document text is never stored.' },
    ],
    metrics: [
      { value: '0.867', label: 'macro-F1 (test)' },
      { value: '0.946', label: 'HIGH+CRITICAL recall' },
      { value: '0.981', label: 'ROC-AUC (OvR macro)' },
      { value: '0.914', label: 'PR-AUC (macro)' },
      { value: '99.5–100%', label: 'Field extraction accuracy' },
      { value: '0.939', label: 'Isolation Forest ROC-AUC' },
      { value: '2 / 9', label: 'Model versions passed the gate' },
      { value: '136', label: 'pytest tests' },
    ],
    metricsNote:
      'Production model v7 (LightGBM with SMOTE and tuned decision weights) on a frozen test set of 600 synthetic contracts. Extraction accuracy was measured on 3,000 synthetic contracts. Templated text makes both far easier than real contracts.',
    contribution:
      'Independent project published on my GitHub. I built the synthetic data generator, ML pipeline, MLOps workflow, API and dashboard.',
    findings: [
      'In the retraining demo, a policy change produced concept drift (macro-F1 on validated labels fell to 0.39 against 0.87). Retraining triggered, but the candidate was rejected. Policy changes are better handled by editing rules than by retraining on a few dozen labels.',
      'The default score weights beat 76% of 1,771 alternative combinations on rank correlation (Spearman 0.906), but fixed level thresholds under-call risk (level macro-F1 0.577).',
      'The anomaly flag is deliberately conservative: precision 1.00 and recall 0.15 at the 97th percentile.',
    ],
    limitations: [
      'Synthetic data: the model learns the labelling policy, not analyst judgement.',
      'The CRITICAL class is small (45 test contracts), so its recall estimates carry roughly 6–7 points of standard error.',
      'Rule-based extraction will not generalise to arbitrary real contract layouts. The full Docker Compose stack has not been run end to end.',
    ],
    weights: {
      title: 'Risk score composition',
      caption: 'Starting weights from configs/risk_scoring.yaml. Missing components are re-weighted and the result is marked degraded.',
      rows: [
        { label: 'ML expected severity', value: 40 },
        { label: 'Anomaly', value: 25 },
        { label: 'Compliance (noisy-OR of rule severities)', value: 25 },
        { label: 'Business exposure', value: 10 },
      ],
    },
    comparison: {
      title: 'Model selection (5-fold cross-validation, tuned)',
      caption: 'Selection used the best CV macro-F1 among models meeting the recall constraints, not accuracy. LightGBM was selected even though logistic regression had higher CRITICAL recall.',
      columns: ['macro-F1', 'HIGH+CRIT recall', 'CRITICAL recall'],
      rows: [
        { name: 'Logistic regression', values: ['0.788', '0.924', '0.848'] },
        { name: 'Random forest (SMOTE)', values: ['0.834', '0.921', '0.781'] },
        { name: 'XGBoost (SMOTE)', values: ['0.835', '0.921', '0.764'] },
        { name: 'LightGBM (SMOTE)', values: ['0.852', '0.930', '0.736'], selected: true },
      ],
    },
    screenshots: [
      { src: '/images/drisk-02_document_risk_summary.jpg', alt: 'Document Risk Engine dashboard showing a contract scored 75 out of 100 (HIGH), with a score breakdown by ML model, anomaly detection, compliance rules and business exposure, class probabilities, and a per-stage analysis-flow timing rail.', caption: 'Risk summary, score composition and per-stage timings', width: 800, height: 500 },
      { src: '/images/drisk-03_explainability_shap_llm.jpg', alt: 'Explainability view with a diverging SHAP factor chart next to a locally generated LLM narrative grounded in the structured evidence.', caption: 'SHAP factors and the grounded local-LLM narrative', width: 800, height: 500 },
      { src: '/images/drisk-01_overview.jpg', alt: 'Overview page of the Document Risk Engine with KPIs, an upload area, risk distribution and top rule hits.', caption: 'Overview: KPIs, upload, risk distribution and top rule hits', width: 800, height: 500 },
    ],
  },
  {
    slug: 'enterprise-rag',
    name: 'Enterprise RAG Knowledge Assistant',
    alias: 'Enterprises-RAG',
    index: '03',
    tagline:
      'Upload documents, ask questions in natural language, and get streamed answers cited to the exact page and chunk they came from.',
    cardProblem:
      'LLM answers over internal documents are only useful when you can check them. This full-stack RAG platform returns source citations with every answer, plus a retrieval debug panel.',
    cardHighlight: { value: 'Ollama ⇄ Gemini', label: 'LLM provider selectable per conversation behind one interface' },
    status: 'Full-stack reference implementation · local or Docker',
    tags: ['RAG', 'FastAPI', 'ChromaDB', 'PostgreSQL', 'Ollama', 'Gemini'],
    repo: 'https://github.com/GunaBala-D/Enterprises-RAG',
    seo: 'Enterprise RAG Knowledge Assistant case study: page-aware chunking, ChromaDB retrieval, streaming SSE answers with citations, swappable Ollama and Gemini providers, and an evaluation harness.',
    overview:
      'A Retrieval-Augmented Generation platform with a FastAPI backend, a React and TypeScript frontend, PostgreSQL and ChromaDB. Users upload documents, watch them move through processing, search the knowledge base semantically, and chat with an assistant whose answers are grounded in, and cited to, those documents.',
    problem: [
      'An LLM answering from internal documents is only trustworthy if every claim can be traced back to a source, and if it declines when the answer is not there.',
      'Teams also need to see why an answer came out the way it did: what was retrieved, how similar it was, and which model produced it.',
    ],
    solution:
      'A background ingestion pipeline parses, cleans, chunks, embeds and indexes each document, recording every step. At query time, the retriever searches ChromaDB, filters by similarity threshold, optionally reranks, and builds a grounded prompt. The answer streams over Server-Sent Events with citations taken directly from retrieval metadata.',
    architectureCaption:
      'Ingestion and question-answering share one vector store. Retrieval and generation depend only on the VectorStore and LLMProvider interfaces.',
    stages: [
      { label: 'Upload', detail: 'PDF, DOCX, TXT, MD and CSV, validated', kind: 'input' },
      { label: 'Parse & clean', detail: 'Page numbers preserved for PDF citations', kind: 'code' },
      { label: 'Chunk', detail: 'Configurable CHUNK_SIZE and CHUNK_OVERLAP', kind: 'code' },
      { label: 'Embed', detail: 'sentence-transformers, run locally', kind: 'model' },
      { label: 'ChromaDB', detail: 'Persistent local vector store', kind: 'store' },
      { label: 'Retrieve', detail: 'Top-K → similarity threshold → optional reranker', kind: 'code' },
      { label: 'Generate', detail: 'Grounded prompt → Ollama or Gemini', kind: 'llm' },
      { label: 'Stream + cite', detail: 'SSE answer with page- and chunk-level sources', kind: 'output' },
    ],
    implementation: [
      { area: 'Ingestion', detail: 'Runs as a background task: validate → parse → clean → chunk → embed → index. Each step is recorded in document_processing_status for a live status view.' },
      { area: 'Retrieval', detail: 'Clean query → embed → ChromaDB top-K → similarity threshold. Reranking is off by default; ENABLE_RERANKING=true swaps in the cross-encoder ms-marco-MiniLM-L-6-v2 with no other code changes.' },
      { area: 'Generation', detail: 'A grounded system prompt tells the model to answer only from the retrieved context, decline when the answer is absent, and distinguish facts from assumptions.' },
      { area: 'Backend', detail: 'FastAPI, Pydantic, async SQLAlchemy and PostgreSQL for conversations and feedback. Every response uses a uniform success/error envelope, and stack traces never reach the client.' },
      { area: 'Frontend', detail: 'React, TypeScript, Vite, Tailwind CSS, Radix primitives and TanStack Query: documents, semantic search, and chat with a provider switcher.' },
      { area: 'Evaluation', detail: 'scripts/evaluate_rag.py reports retrieval hit rate, average context relevance, answer groundedness and latency on a question set.' },
    ],
    decisions: [
      {
        title: 'Two interfaces, swappable implementations',
        body: 'The RAG pipeline depends only on VectorStore and LLMProvider. Adding pgvector, Qdrant or another LLM means implementing one class and registering it in a factory.',
      },
      {
        title: 'Citations from metadata, not from the model',
        body: 'The sources returned to the client come straight from retrieval metadata, so citations cannot be fabricated by generation.',
      },
      {
        title: 'Reranking as an opt-in flag',
        body: 'The reranker ships as a passthrough so the default path stays fast and dependency-light. The cross-encoder is a configuration change, not a code change.',
      },
      {
        title: 'Secrets stay on the server',
        body: 'The Gemini key is read only by the backend and never appears in any API response. Authentication is wired into every route and switched on with AUTH_ENABLED.',
      },
    ],
    reliability: [
      { title: 'Grounding', body: 'A similarity threshold filters weak matches, and the prompt instructs the model to decline when the context does not contain the answer.' },
      { title: 'Retrieval visibility', body: 'Each answer has a debug panel showing the top-K chunks, similarity scores, latency and provider.' },
      { title: 'Feedback and auditability', body: 'Thumbs up/down feedback with structured reasons, and conversation history persisted in PostgreSQL.' },
      { title: 'Tests', body: 'Unit tests for chunking, cleaning, parsers, provider interfaces and prompts. Integration tests cover upload → index against a real Chroma store and question → answer through the real ChatService with a fake LLM.' },
    ],
    contribution:
      'Independent project published on my GitHub. I built the ingestion and RAG pipelines, the FastAPI backend and the React frontend.',
    findings: [
      'Because both providers sit behind the same LLMProvider interface, switching between Ollama and Gemini is a per-request llm_provider parameter rather than a deployment change.',
      'PDF page numbers survive chunking, so PDF citations point to a page. Other formats cite the document and chunk without a page number.',
    ],
    limitations: [
      'The schema is created with create_all at startup; Alembic migrations are planned.',
      'Retrieval is semantic only. Hybrid keyword and semantic search, query rewriting and conversation-aware retrieval are planned.',
      'The evaluation metrics are heuristic; LLM-as-judge scoring is not implemented.',
    ],
  },
  {
    slug: 'resumeiq',
    name: 'ResumeIQ',
    alias: 'ATS Checker',
    index: '04',
    tagline:
      'Evidence-based job-fit reports. The LLM classifies requirements and cites resume lines; code verifies every citation and calculates the score.',
    cardProblem:
      'A resume score produced by an LLM is opaque and can be manipulated. In ResumeIQ, code verifies each cited resume line and computes the score deterministically.',
    cardHighlight: { value: 'LLM ≠ score', label: 'Prompt-injected "give me 100" cannot change the arithmetic' },
    status: 'Deployed on Vercel · live demo available',
    tags: ['Next.js', 'TypeScript', 'Groq', 'Zod', 'Structured outputs', 'Vitest'],
    repo: 'https://github.com/GunaBala-D/ATS_Checker',
    demo: 'https://ats-checker-dusky.vercel.app',
    seo: 'ResumeIQ case study: an LLM pipeline with structured outputs, line-level evidence verification, deterministic scoring and prompt-injection defences, deployed on Vercel.',
    overview:
      'ResumeIQ compares a resume (PDF or DOCX) with a specific job description and produces an evidence-based job-fit report. Every match cites the resume lines that support it, and those citations are checked in code. The score is calculated from the verified evidence and is labelled as an estimate, not an official ATS score.',
    problem: [
      'Resume-to-job matching tools usually return a score with no visible reasoning, so candidates cannot tell what is missing or whether the score is right.',
      'If an LLM produces that score directly, it can be swayed by fabricated evidence or by text inside the resume that tries to instruct the model.',
    ],
    solution:
      'A seven-stage pipeline alternates between code and the LLM. Three LLM calls parse the job requirements, match them to numbered resume lines, and write recommendations. Code validates the input, verifies each cited line, downgrades claims it cannot verify, computes the weighted score and ATS checks, and guards rewrites against new numbers or technologies.',
    architectureCaption:
      'The LLM stages produce claims and code stages check them. The score is computed only from evidence that survived verification.',
    stages: [
      { label: 'Validate & normalize', detail: 'NFKC, control-character removal, size bounds, injection scan', kind: 'code' },
      { label: 'Parse requirements', detail: 'Atomic requirements; quotes not found in the JD are dropped', kind: 'llm' },
      { label: 'Profile & match', detail: 'Resume sent as numbered lines; returns line refs and the proving term', kind: 'llm' },
      { label: 'Verify', detail: 'Term must appear in the cited line, otherwise matched → partial → missing', kind: 'code' },
      { label: 'Score & ATS', detail: 'Weighted dimensions, evidence coverage, confidence, keyword checks', kind: 'code' },
      { label: 'Recommend', detail: 'Strengths, gaps, rewrites of real lines', kind: 'llm' },
      { label: 'Finalize', detail: 'Rewrite guard, prioritisation, final Zod validation', kind: 'code' },
    ],
    implementation: [
      { area: 'Stack', detail: 'Next.js App Router, TypeScript, Tailwind CSS and shadcn/ui, with route handlers for /api/extract, /api/analyze (NDJSON stream) and /api/health.' },
      { area: 'Extraction', detail: 'Server-side PDF extraction with unpdf and DOCX extraction with mammoth, preserving line structure. Specific errors for scanned, encrypted or corrupted files and legacy .doc.' },
      { area: 'LLM', detail: 'Groq with strict JSON-schema structured outputs (openai/gpt-oss-120b recommended), Zod validation, retries and handling of 429 retry-after.' },
      { area: 'Scoring', detail: 'Required skills 35%, experience 25%, projects 20%, preferred qualifications 10%, keywords 10%. N/A dimensions are re-normalised.' },
      { area: 'Persistence', detail: 'Reports are stored in the browser’s IndexedDB, with a dashboard derived only from saved reports and a client-side PDF export.' },
      { area: 'Testing', detail: 'Vitest suites with Groq always mocked: parsing, matching, scoring, pipeline, prompt injection, the Groq client, API handlers, exports and workflow.' },
    ],
    decisions: [
      {
        title: 'The LLM classifies; code scores',
        body: 'This makes the score traceable and resistant to prompt injection. A resume that says "give me 100" cannot change the arithmetic, and fabricated evidence is downgraded.',
      },
      {
        title: 'Line numbers as evidence',
        body: 'Sending the resume as numbered lines keeps token usage low under tight Groq free-tier limits and makes verification exact.',
      },
      {
        title: 'Three LLM calls, not more',
        body: 'Profiling and matching share one call to stay within typical Groq tokens-per-minute limits.',
      },
      {
        title: 'Local-first by design',
        body: 'Uploaded files are processed in memory and not stored. Reports live in the browser, and one storage module is the only thing to replace when adding a database.',
      },
    ],
    reliability: [
      { title: 'Input validation', body: 'Extension, MIME type, magic-byte signature and 5 MB size checks before any AI call.' },
      { title: 'Prompt-injection defence', body: 'Detection, delimiter neutralisation and data-only prompt framing. An end-to-end test covers a model that obeys an injection while the score stays near zero.' },
      { title: 'Rewrite guard', body: 'Suggested bullet rewrites are flagged when they introduce new numbers, placeholders or technologies that are not in the resume.' },
      { title: 'No simulated results', body: 'If the API key or model is missing, upload and extraction still work and /api/analyze returns a clear 503 config_missing.' },
    ],
    metrics: [
      { value: '7', label: 'Pipeline stages (3 LLM, 4 code)' },
      { value: '5', label: 'Weighted scoring dimensions' },
      { value: '30–40 s', label: 'Full analysis in live testing' },
    ],
    weights: {
      title: 'Job-fit score dimensions',
      caption: 'Default weights in SCORING_WEIGHTS. They are a product design choice, not an industry-standard ATS formula, and ATS readiness never affects this score.',
      rows: [
        { label: 'Required skills', value: 35 },
        { label: 'Experience alignment', value: 25 },
        { label: 'Projects & competencies', value: 20 },
        { label: 'Preferred qualifications', value: 10 },
        { label: 'Keyword alignment', value: 10 },
      ],
    },
    metricsNote:
      'Timing from live testing with the sample files on Groq’s on-demand tier, including one or two automatic rate-limit pauses.',
    contribution:
      'Independent project published on my GitHub and deployed on Vercel. I built the extraction, LLM pipeline, verification and scoring logic, interface and test suites.',
    findings: [
      'Separating judgement (LLM) from arithmetic (code) produced a score that can be explained line by line, which an LLM-generated number cannot be.',
      'Free-tier rate limits shaped the architecture: fewer, larger structured calls and line-number references instead of quoted text.',
    ],
    limitations: [
      'OCR is not included: scanned PDFs are detected and explained, not read.',
      'Evidence verification is lexical. It proves the cited term exists in the line, not that the model’s judgement is correct.',
      'History is per browser, and the rate limiter is in memory per instance.',
    ],
  },
  {
    slug: 'ai-vision-monitor',
    name: 'AI Vision Monitor',
    alias: 'Real-Time Person Detection',
    index: '05',
    tagline:
      'Real-time person detection, tracking and known/unknown face recognition, with debounced alerts streamed to a live dashboard.',
    cardProblem:
      'Per-frame detection floods operators with alerts. This pipeline tracks each person, matches faces against a threshold, and raises one event per person per cooldown.',
    cardHighlight: { value: '23 → 4', label: 'per-frame classifications collapsed into alerts on a 1,394-frame video' },
    status: 'Portfolio demo for authorised monitoring only · CPU inference',
    tags: ['YOLOv8', 'ByteTrack', 'InsightFace', 'OpenCV', 'FastAPI', 'WebSocket'],
    repo: 'https://github.com/GunaBala-D/AI-Vision-Monitor',
    seo: 'AI Vision Monitor case study: YOLOv8 person detection, ByteTrack tracking, InsightFace recognition with a similarity threshold, cooldown-debounced events and live WebSocket streaming.',
    overview:
      'A computer-vision and full-stack application. Point it at a webcam, RTSP camera or video file, and it detects people, tracks them across frames, matches faces against registered known people, and raises a KNOWN_PERSON or UNKNOWN_PERSON event with an annotated snapshot. Everything streams to a React dashboard over WebSocket. It is intended for authorised monitoring environments only.',
    problem: [
      'Running a detector on every frame produces a new alert for the same person many times per second, which is unusable for anyone watching the feed.',
      'Identity matching also has to be conservative. Claiming a known identity on a weak match is worse than reporting an unknown person.',
    ],
    solution:
      'Each camera runs its own worker thread. Frames go through YOLOv8n detection, ByteTrack tracking, then InsightFace face detection and 512-d embeddings matched by cosine similarity. A cooldown-gated event engine creates an event and snapshot only for a genuinely new sighting, and extends the existing event otherwise.',
    architectureCaption:
      'Tracking provides a stable ID per person, so the event engine can debounce by track instead of by frame.',
    stages: [
      { label: 'Camera source', detail: 'Webcam, RTSP or video file; every Nth frame (default 2)', kind: 'input' },
      { label: 'YOLOv8n', detail: 'Person boxes with confidence ≥ 0.50', kind: 'model' },
      { label: 'ByteTrack', detail: 'Stable track_id per person across frames', kind: 'model' },
      { label: 'InsightFace', detail: 'SCRFD face detection → ArcFace 512-d embedding', kind: 'model' },
      { label: 'Match', detail: 'Cosine similarity ≥ 0.45 → KNOWN, otherwise UNKNOWN or NO_FACE', kind: 'code' },
      { label: 'Event engine', detail: '30 s cooldown per track: extend the event or alert fresh', kind: 'code' },
      { label: 'PostgreSQL + snapshot', detail: 'Only on a genuinely new event', kind: 'store' },
      { label: 'Live dashboard', detail: 'WebSocket events and an MJPEG stream with box overlays', kind: 'output' },
    ],
    implementation: [
      { area: 'Vision', detail: 'YOLOv8n (Ultralytics) on CPU, ByteTrack via the trackers package, and the InsightFace buffalo_l pack (SCRFD detection, ArcFace embeddings).' },
      { area: 'Concurrency', detail: 'A CameraWorker thread per camera with its own asyncio loop and database engine. Results reach FastAPI’s main loop through asyncio.run_coroutine_threadsafe for WebSocket broadcast.' },
      { area: 'Recognition', detail: 'FaceDetector, FaceEmbedder and FaceMatcher interfaces. None imports YOLO or each other, so each can be swapped independently.' },
      { area: 'Backend', detail: 'FastAPI, async SQLAlchemy 2.0, Alembic, asyncpg and PostgreSQL 16, with REST routes for people, cameras, events and analytics.' },
      { area: 'Frontend', detail: 'React 18, TypeScript, Vite, Tailwind, TanStack Query and Recharts: live monitor, people, events review, cameras and analytics.' },
      { area: 'Configuration', detail: 'DETECTION_CONFIDENCE, FACE_MATCH_THRESHOLD, PROCESS_EVERY_N_FRAMES and UNKNOWN_ALERT_COOLDOWN are set in .env. The settings page is intentionally read-only.' },
    ],
    decisions: [
      {
        title: 'Unknown stays unknown',
        body: 'The matcher never claims an identity below the configured similarity threshold. Exact-boundary cases are covered by unit tests.',
      },
      {
        title: 'Debounce by track, not by frame',
        body: 'Repeat sightings within the cooldown extend an event’s last_seen_at instead of creating a row, and snapshots are saved only for new events.',
      },
      {
        title: 'Shaped for worker processes',
        body: 'The capture → pipeline → publish split mirrors a separate worker process, so moving off in-process threads is a deployment change rather than a rewrite.',
      },
      {
        title: 'Brute-force search at demo scale',
        body: 'Embeddings are stored as FLOAT[] and searched with NumPy, which is fine for a handful of registered people. pgvector with an ANN index is the documented next step at real scale.',
      },
    ],
    reliability: [
      { title: 'Privacy by default', body: 'Face embeddings are never returned by the API, only counts. RTSP credentials are masked in every response, and a log-redaction filter covers passwords, tokens, camera URIs and embeddings.' },
      { title: 'Synthetic test identities', body: 'End-to-end recognition tests use AI-generated faces, not real people’s biometric data.' },
      { title: 'Measured, not estimated', body: 'FPS and detection and recognition latency in the UI come from what the pipeline actually measured via a metrics endpoint.' },
      { title: 'Tests', body: '85 tests: unit tests for every pipeline building block without model weights or a GPU, plus real-HTTP integration tests against the database.' },
    ],
    metrics: [
      { value: '90–205 ms', label: 'YOLOv8n person detection per frame' },
      { value: '100–125 ms', label: 'Face detection + embedding' },
      { value: '1.5–3.3', label: 'FPS end to end per camera (CPU)' },
      { value: '85', label: 'pytest tests' },
    ],
    metricsNote:
      'Measured live on the development machine, CPU only, single camera, with PROCESS_EVERY_N_FRAMES=2. Expect variation by hardware and a drop with several concurrent cameras.',
    contribution:
      'Independent project published on my GitHub, built phase by phase with a verification script and tests for each phase.',
    findings: [
      'Sharing one database session across threads and event loops broke the naive version. Giving each worker its own loop and engine fixed it.',
      'Static analysis of the Dockerfile caught a path bug: a flattened WORKDIR would have silently sent snapshots and model weights outside the mounted volumes.',
    ],
    limitations: [
      'CPU inference runs at roughly 1–4 FPS per camera. That suits a demo, not high-frame-rate production monitoring.',
      'The Docker build has not been tested end to end, and there is no automatic purge job for snapshot retention yet.',
      'Alert delivery is wired directly to the WebSocket broadcast, not yet behind a pluggable provider.',
    ],
  },
];

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
