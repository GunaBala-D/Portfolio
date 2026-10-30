import { Link } from 'react-router-dom';
import { Award, External } from '../components/Icons';
import { Section } from '../components/Section';
import { certifications, profile } from '../data/profile';

const PRINCIPLES = [
  {
    title: 'Models judge, code decides',
    body: 'Language models classify, rank and explain. Anything that must be exact, such as scores, citations, order totals and risk levels, is computed deterministically.',
    evidence: [
      { slug: 'resumeiq', name: 'ResumeIQ' },
      { slug: 'document-risk-engine', name: 'Document Risk Engine' },
    ],
  },
  {
    title: 'Grounded, or it declines',
    body: 'Answers must trace back to retrieved sources. Without enough evidence the system declines or escalates to a human rather than improvising.',
    evidence: [
      { slug: 'supportpilot', name: 'SupportPilot' },
      { slug: 'enterprise-rag', name: 'Enterprise RAG' },
    ],
  },
  {
    title: 'Measured, with limits written down',
    body: 'Every project documents what was verified, what was not, and where the weak metric is. For example, SupportPilot reports 68% precision@k and why its threshold stays where it is.',
    evidence: [
      { slug: 'supportpilot', name: 'SupportPilot' },
      { slug: 'ai-vision-monitor', name: 'AI Vision Monitor' },
    ],
  },
];

export function About() {
  return (
    <Section
      id="about"
      index="04"
      label="About"
      note={profile.location}
      title={
        <>
          How I approach <span className="serif">AI/ML engineering</span>.
        </>
      }
    >
      <div className="ruled about">
        <figure className="portrait" data-reveal>
          <img
            src="/images/guna-bala-cutout-720.png"
            alt="Portrait of Guna Bala D"
            width={720}
            height={720}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="card-bar portrait__tag">
            <span className="hud-label muted">{profile.name}</span>
            <span className="hud-label faint">{profile.role}</span>
          </figcaption>
        </figure>
        <div className="about__text" data-reveal>
          <p className="about__lead">
            I&rsquo;m an AI/ML Engineer at Srikesh Infotech in Puducherry, India. Since September 2025 I&rsquo;ve built
            LLM applications, retrieval pipelines and anomaly detection for internal business operations, and maintained
            production Odoo ERP modules alongside that work.
          </p>
          <p>
            I work across the whole system: ingestion and OCR, retrieval and re-ranking, agent workflows with LangGraph
            and MCP, classical ML evaluation, and the FastAPI services and interfaces that make models usable.
          </p>
          <p>
            I hold a B.Tech in Information Technology from Rajiv Gandhi College of Engineering and Technology (2021–2025)
            and work in Tamil and English.
          </p>
        </div>
      </div>

      <ol className="ruled principles" role="list" data-reveal-group>
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} className="principle" data-reveal>
            <div className="card-bar">
              <span className="hud-label muted">Principle</span>
              <span className="hud-label faint" aria-hidden="true">
                {String.fromCharCode(65 + i)}
              </span>
            </div>
            <div className="principle__body">
              <h3 className="h-card">{p.title}</h3>
              <p className="muted">{p.body}</p>
              <p className="principle__ev">
                See{' '}
                {p.evidence.map((e, j) => (
                  <span key={e.slug}>
                    {j > 0 && ' and '}
                    <Link className="link-ink" to={`/projects/${e.slug}`}>
                      {e.name}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="certs">
        <div className="card-bar certs__bar">
          <h3 className="hud-label muted certs__title">Certifications</h3>
          <a href={profile.certificatesFolder} className="hud-label link-hud" target="_blank" rel="noopener noreferrer">
            View Anthropic certificates <External />
          </a>
        </div>
        <ul role="list" className="ruled certs__list" data-reveal-group>
          {certifications.map((c) => (
            <li key={c.name} className="cert" data-reveal>
              <Award className="cert__icon" />
              <div>
                <p className="cert__name">{c.name}</p>
                <p className="cert__issuer">
                  {c.issuer}
                  {c.date && <span className="mono"> · {c.date}</span>}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
