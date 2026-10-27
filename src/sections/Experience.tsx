import { ArchitectureFigure } from '../components/diagram/ArchitectureFigure';
import { workSystemsArch } from '../components/diagram/specs';
import { CountUp, RadialGauge } from '../components/Metrics';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { Timeline } from '../components/Timeline';
import { anomalyMetrics, education, experience } from '../data/profile';
import type { Stage } from '../data/projects';

const WORK_STAGES: Stage[] = [
  { label: 'OCR ingestion', detail: 'pdfplumber and pytesseract digitise source documents', kind: 'code' },
  { label: 'Chunking → pgvector', detail: '1,000+ accounting and operational records in PostgreSQL', kind: 'store' },
  { label: 'Re-ranking', detail: 'Improves retrieval precision before generation', kind: 'code' },
  { label: 'LLM response', detail: 'Anthropic Claude and self-hosted Ollama as interchangeable backends', kind: 'llm' },
  { label: 'Isolation Forest + LOF', detail: 'Unsupervised anomaly detection over 15,000+ daily log events', kind: 'model' },
  { label: 'Live dashboard', detail: 'Real-time monitoring of detected anomalies', kind: 'output' },
  { label: 'LangGraph agent', detail: 'Explains anomalies using similar past incidents from ChromaDB; MCP connects tools and data', kind: 'llm' },
];

export function Experience() {
  const [current, ...earlier] = experience;
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <SectionHead
          index="02"
          label="Experience"
          id="experience-title"
          title={<>Applied AI/ML for <span className="grad-text">internal business operations</span>.</>}
          lede="LLM, retrieval and anomaly-detection systems at Srikesh Infotech, alongside production ERP work."
        />

        <Reveal className="tl-wrap">
          <Timeline />
        </Reveal>

        {current && (
          <Reveal as="article" className="role role--current glass glass--edge">
            <header className="role__head">
              <div>
                <h3 className="role__title">{current.title}</h3>
                <p className="role__company">
                  {current.company}
                  {current.location && <span className="muted"> · {current.location}</span>}
                </p>
              </div>
              <p className="role__period mono">{current.period}</p>
            </header>
            <p className="role__summary">{current.summary}</p>

            {current.highlights && (
              <ul role="list" className="role__highlights">
                {current.highlights.map((h) => (
                  <li key={h.label}>
                    <CountUp value={h.value} className="mono" />
                    {h.label}
                  </li>
                ))}
              </ul>
            )}

            <div className="role__grid">
              <ul className="role__points">
                {current.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>

              <aside className="evalcard glass" aria-labelledby="anomaly-eval-title">
                <p className="eyebrow">Evaluation</p>
                <h4 id="anomaly-eval-title" className="evalcard__title">
                  Unsupervised anomaly detection
                </h4>
                <p className="evalcard__sub">Isolation Forest + Local Outlier Factor over 15,000+ daily log events</p>
                <ul role="list" className="evalcard__gauges">
                  {anomalyMetrics.map((m) => (
                    <li key={m.label}>
                      <RadialGauge value={m.value} display={`~${m.value}%`} label={m.label} size={92} />
                    </li>
                  ))}
                </ul>
                <p className="evalcard__note">
                  Approximate values after grid and random search tuning, as reported on my resume.
                </p>
                <div className="evalcard__impact">
                  <span className="mono">40–50%</span>
                  <span>estimated reduction in manual triage time after re-architecting a script-based ML tool into a FastAPI microservice on AWS EC2</span>
                </div>
              </aside>
            </div>

            <div className="role__figure">
              <ArchitectureFigure
                spec={workSystemsArch}
                title="Systems I built at Srikesh Infotech"
                caption="Two flows from my resume: OCR-digitised documents grounding LLM responses through pgvector retrieval, and anomaly detection whose findings a LangGraph agent explains using similar past incidents from ChromaDB, connected to external tools through MCP."
                stages={WORK_STAGES}
                hasDashed
              />
            </div>

            {current.stack && (
              <ul className="tags role__stack" aria-label="Technologies used in this role">
                {current.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        )}

        <div className="timeline">
          {earlier.map((r) => (
            <Reveal as="article" key={r.company} className="role role--compact">
              <header className="role__head">
                <div>
                  <h3 className="role__title">{r.title}</h3>
                  <p className="role__company">{r.company}</p>
                </div>
                <p className="role__period mono">{r.period}</p>
              </header>
              <ul className="role__points">
                {r.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </Reveal>
          ))}
          <Reveal as="article" className="role role--compact">
            <header className="role__head">
              <div>
                <h3 className="role__title">{education.degree}</h3>
                <p className="role__company">
                  {education.school} <span className="muted">· {education.location}</span>
                </p>
              </div>
              <p className="role__period mono">{education.period}</p>
            </header>
            <p className="role__summary">{education.note}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
