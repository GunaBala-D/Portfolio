import { useState, type ComponentType, type SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { Bolt, CloudStack, Eye, Nodes, Scatter, Server } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { skills } from '../data/profile';
import { getProject } from '../data/projects';

// Where each capability shows up: professional work (from the resume) and/or published projects.
const EVIDENCE: Record<
  string,
  { short: string; color: string; icon: ComponentType<SVGProps<SVGSVGElement>>; work?: string; projects: string[] }
> = {
  'Generative AI & LLM applications': {
    short: 'GenAI & LLMs',
    color: '#8b5cf6',
    icon: Bolt,
    work: 'Accounting Co-Pilot on Claude and Ollama; MCP tool integration',
    projects: ['supportpilot', 'enterprise-rag', 'resumeiq'],
  },
  'Retrieval & agent workflows': {
    short: 'Retrieval & Agents',
    color: '#14a3c7',
    icon: Nodes,
    work: 'RAG on pgvector with re-ranking; LangGraph agent over ChromaDB',
    projects: ['supportpilot', 'enterprise-rag'],
  },
  'Machine learning': {
    short: 'Machine Learning',
    color: '#1f9d55',
    icon: Scatter,
    work: 'Isolation Forest + LOF anomaly detection, tuned with grid and random search',
    projects: ['document-risk-engine'],
  },
  'Deep learning & computer vision': { short: 'Vision', color: '#f2a516', icon: Eye, projects: ['ai-vision-monitor'] },
  'Backend & data': {
    short: 'Backend & Data',
    color: '#2f7bf5',
    icon: Server,
    work: 'FastAPI inference microservice on AWS EC2',
    projects: ['supportpilot', 'document-risk-engine', 'enterprise-rag', 'ai-vision-monitor'],
  },
  'Cloud & tooling': {
    short: 'Cloud & Tooling',
    color: '#e8573f',
    icon: CloudStack,
    work: 'AWS EC2 deployment; OCR pipeline with pdfplumber and pytesseract',
    projects: ['document-risk-engine'],
  },
};

export function Skills() {
  const [active, setActive] = useState(0);
  const g = skills[active]!;
  const ev = EVIDENCE[g.title]!;

  return (
    <Section
      id="skills"
      index="03"
      label="Skills"
      note="Wired to evidence"
      title={
        <>
          Six capabilities. One <span className="serif">stack</span>.
        </>
      }
      lede="Each capability links to the projects and work that use it. Pick one to see the stack and where it was applied."
    >
      <div className="ruled skilltiles" role="tablist" aria-label="Capability areas" data-reveal-group>
        {skills.map((s, i) => {
          const e = EVIDENCE[s.title]!;
          const Icon = e.icon;
          return (
            <button
              key={s.title}
              type="button"
              role="tab"
              id={`skilltab-${i}`}
              data-reveal
              aria-selected={i === active}
              aria-controls="skill-panel"
              tabIndex={i === active ? 0 : -1}
              className={`skilltile ${i === active ? 'is-on' : ''}`}
              style={{ ['--app' as string]: e.color }}
              onClick={() => setActive(i)}
              onKeyDown={(evt) => {
                if (evt.key !== 'ArrowRight' && evt.key !== 'ArrowLeft' && evt.key !== 'ArrowDown' && evt.key !== 'ArrowUp') return;
                evt.preventDefault();
                const dir = evt.key === 'ArrowRight' || evt.key === 'ArrowDown' ? 1 : -1;
                const next = (i + dir + skills.length) % skills.length;
                setActive(next);
                document.getElementById(`skilltab-${next}`)?.focus();
              }}
            >
              <span className="skilltile__bar" aria-hidden="true" />
              <span className="skilltile__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="skilltile__name">{e.short}</span>
              <span className="hud-label faint">{s.items.length} skills</span>
            </button>
          );
        })}
      </div>

      <Reveal>
        <div
          id="skill-panel"
          role="tabpanel"
          aria-labelledby={`skilltab-${active}`}
          className="skillpanel"
          key={active}
          style={{ ['--app' as string]: ev.color }}
        >
          <div className="skillpanel__head">
            <h3 className="h-card">{g.title}</h3>
            <p className="muted">{g.note}</p>
          </div>
          <div className="skillpanel__body">
            <ul role="list" className="skillpanel__items" aria-label={`${g.title} skills`}>
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <dl className="skillpanel__evidence">
              {ev.work && (
                <div>
                  <dt className="hud-label faint">At work</dt>
                  <dd>{ev.work}</dd>
                </div>
              )}
              <div>
                <dt className="hud-label faint">Projects</dt>
                <dd>
                  {ev.projects.map((slug, j) => {
                    const p = getProject(slug);
                    if (!p) return null;
                    return (
                      <span key={slug}>
                        {j > 0 && ', '}
                        <Link className="link-ink" to={`/projects/${slug}`}>
                          {p.name}
                        </Link>
                      </span>
                    );
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
