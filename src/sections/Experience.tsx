import { ArchitectureFigure } from '../components/diagram/ArchitectureFigure';
import { workSystemsArch } from '../components/diagram/specs';
import { CountUp, RadialGauge } from '../components/Metrics';
import { Reveal } from '../components/Reveal';
import { SectionBar } from '../components/Section';
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
    <section className="section" id="experience" data-choreo aria-labelledby="experience-title">
      <span className="section__rule" data-draw-rule aria-hidden="true" />
      <div className="frame">
        <span className="tick tick--half tick--tl" data-draw-tick aria-hidden="true" />
        <span className="tick tick--half tick--tr" data-draw-tick aria-hidden="true" />
        <SectionBar index="02" label="Experience" note={current?.period} />

        <div className="xp-band">
          <div className="section__head section__head--center">
            <Reveal as="p" className="hud-label accent-ink">
              Currently at Srikesh Infotech
            </Reveal>
            <Reveal as="h2" className="h-section" id="experience-title">
              Applied AI/ML for <span className="serif">internal business operations</span>.
            </Reveal>
            <Reveal as="p" className="lede">
              LLM, retrieval and anomaly-detection systems at Srikesh Infotech, alongside production ERP work.
            </Reveal>
          </div>
        </div>

        {current?.highlights && (
          <ul role="list" className="ruled stats" data-reveal-group>
            {current.highlights.map((h) => (
              <li key={h.label} className="stat" data-reveal>
                <CountUp value={h.value} className="stat__value display" />
                <span className="stat__label">{h.label}</span>
              </li>
            ))}
            <li className="stat stat--gauge" data-reveal>
              <RadialGauge value={89} display="~89%" label="" size={86} />
              <span className="stat__label">anomaly-detection F1 after grid and random search tuning</span>
            </li>
          </ul>
        )}

        <Reveal className="tl-wrap">
          <Timeline />
        </Reveal>

        {current && (
          <article className="role">
            <div className="card-bar role__bar">
              <p className="hud-label muted">Current role</p>
              <p className="hud-label faint">{current.period}</p>
            </div>
            <div className="role__grid">
              <div className="role__main">
                <Reveal as="h3" className="role__title">
                  {current.title}
                </Reveal>
                <Reveal as="p" className="role__company">
                  {current.company}
                  {current.location && <span className="faint"> · {current.location}</span>}
                </Reveal>
                <Reveal as="p" className="role__summary">
                  {current.summary}
                </Reveal>
                <ul className="role__points">
                  {current.points.map((pt) => (
                    <Reveal as="li" key={pt}>
                      {pt}
                    </Reveal>
                  ))}
                </ul>
              </div>

              <aside className="evalcard" aria-labelledby="anomaly-eval-title">
                <Reveal className="evalcard__inner">
                  <p className="hud-label muted">Evaluation</p>
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
                    <span className="evalcard__impact-value display">40–50%</span>
                    <span>
                      estimated reduction in manual triage time after re-architecting a script-based ML tool into a
                      FastAPI microservice on AWS EC2
                    </span>
                  </div>
                </Reveal>
              </aside>
            </div>

            <Reveal className="role__figure">
              <ArchitectureFigure
                spec={workSystemsArch}
                title="Systems I built at Srikesh Infotech"
                caption="Two flows from my resume: OCR-digitised documents grounding LLM responses through pgvector retrieval, and anomaly detection whose findings a LangGraph agent explains using similar past incidents from ChromaDB, connected to external tools through MCP."
                stages={WORK_STAGES}
                hasDashed
              />
            </Reveal>

            {current.stack && (
              <ul className="tags role__stack" aria-label="Technologies used in this role">
                {current.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </article>
        )}

        <div className="ruled earlier" data-reveal-group>
          {earlier.map((r) => (
            <article key={r.company} className="earlier__item" data-reveal>
              <div className="card-bar">
                <p className="hud-label muted">Earlier</p>
                <p className="hud-label faint">{r.period}</p>
              </div>
              <div className="earlier__body">
                <h3 className="h-card">{r.title}</h3>
                <p className="role__company">{r.company}</p>
                <ul className="role__points">
                  {r.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
          <article className="earlier__item" data-reveal>
            <div className="card-bar">
              <p className="hud-label muted">Education</p>
              <p className="hud-label faint">{education.period}</p>
            </div>
            <div className="earlier__body">
              <h3 className="h-card">{education.degree}</h3>
              <p className="role__company">
                {education.school} <span className="faint">· {education.location}</span>
              </p>
              <p className="role__summary">{education.note}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
