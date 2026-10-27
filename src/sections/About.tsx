import { Link } from 'react-router-dom';
import { Award, External } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
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
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHead index="04" label="About" id="about-title" title={<>How I approach <span className="grad-text">AI/ML engineering</span>.</>} />

        <div className="about">
          <Reveal className="about__text">
            <figure className="portrait">
              <div className="portrait__stage">
                <img
                  src="/images/guna-bala-cutout-720.png"
                  alt="Portrait of Guna Bala D"
                  width={720}
                  height={720}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="portrait__tag glass">
                <span className="portrait__live" aria-hidden="true" />
                <span>
                  <strong>{profile.name}</strong>
                  <span className="mono">
                    {profile.role} · {profile.location}
                  </span>
                </span>
              </figcaption>
            </figure>
            <p>
              I&rsquo;m an AI/ML Engineer at Srikesh Infotech in Puducherry, India. Since September 2025 I&rsquo;ve built
              LLM applications, retrieval pipelines and anomaly detection for internal business operations, and
              maintained production Odoo ERP modules alongside that work.
            </p>
            <p>
              I work across the whole system: ingestion and OCR, retrieval and re-ranking, agent workflows with LangGraph
              and MCP, classical ML evaluation, and the FastAPI services and interfaces that make models usable.
            </p>
            <p>
              I hold a B.Tech in Information Technology from Rajiv Gandhi College of Engineering and Technology (2021–2025)
              and work in Tamil and English.
            </p>
          </Reveal>

          <ol className="principles" role="list">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p.title} className="principle glass" delay={i * 80}>
                <span className="principle__n mono" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="principle__title">{p.title}</h3>
                  <p className="principle__body">{p.body}</p>
                  <p className="principle__ev">
                    See{' '}
                    {p.evidence.map((e, j) => (
                      <span key={e.slug}>
                        {j > 0 && ' and '}
                        <Link to={`/projects/${e.slug}`}>{e.name}</Link>
                      </span>
                    ))}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal className="certs" as="div">
          <div className="certs__head">
            <h3 className="certs__title">Certifications</h3>
            <a href={profile.certificatesFolder} className="text-link" target="_blank" rel="noopener noreferrer">
              View Anthropic certificates <External />
            </a>
          </div>
          <ul role="list" className="certs__list">
            {certifications.map((c) => (
              <li key={c.name} className="cert glass">
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
        </Reveal>
      </div>
    </section>
  );
}
