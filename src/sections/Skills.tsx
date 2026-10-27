import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { SectionHead } from '../components/SectionHead';
import { skills } from '../data/profile';
import { getProject, projects } from '../data/projects';

// Where each capability shows up: professional work (from the resume) and/or published projects.
const EVIDENCE: Record<string, { short: string; color: string; work?: string; projects: string[] }> = {
  'Generative AI & LLM applications': {
    short: 'GenAI & LLMs',
    color: '#a78bfa',
    work: 'Accounting Co-Pilot on Claude and Ollama; MCP tool integration',
    projects: ['supportpilot', 'enterprise-rag', 'resumeiq'],
  },
  'Retrieval & agent workflows': {
    short: 'Retrieval & Agents',
    color: '#22d3ee',
    work: 'RAG on pgvector with re-ranking; LangGraph agent over ChromaDB',
    projects: ['supportpilot', 'enterprise-rag'],
  },
  'Machine learning': {
    short: 'Machine Learning',
    color: '#34d399',
    work: 'Isolation Forest + LOF anomaly detection, tuned with grid and random search',
    projects: ['document-risk-engine'],
  },
  'Deep learning & computer vision': { short: 'Vision', color: '#fbbf24', projects: ['ai-vision-monitor'] },
  'Backend & data': {
    short: 'Backend & Data',
    color: '#60a5fa',
    work: 'FastAPI inference microservice on AWS EC2',
    projects: ['supportpilot', 'document-risk-engine', 'enterprise-rag', 'ai-vision-monitor'],
  },
  'Cloud & tooling': {
    short: 'Cloud & Tooling',
    color: '#fb7185',
    work: 'AWS EC2 deployment; OCR pipeline with pdfplumber and pytesseract',
    projects: ['document-risk-engine'],
  },
};

const SHORT_PROJECT: Record<string, string> = {
  supportpilot: 'SupportPilot',
  'document-risk-engine': 'Doc Risk',
  'enterprise-rag': 'Ent. RAG',
  resumeiq: 'ResumeIQ',
  'ai-vision-monitor': 'Vision',
};

const C = 330;
const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (r: number, deg: number) => ({ x: C + r * Math.cos(rad(deg)), y: C + r * Math.sin(rad(deg)) });

function SkillGraph({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const hubs = skills.map((g, i) => ({ g, ev: EVIDENCE[g.title]!, deg: -90 + i * 60, ...polar(180, -90 + i * 60) }));
  const projNodes = projects.map((p, j) => ({ slug: p.slug, ...polar(82, -90 + j * 72) }));
  const activeEv = hubs[active]!.ev;

  return (
    <svg viewBox="0 0 660 660" className="kg" aria-hidden="true">
      <defs>
        <radialGradient id="kg-core">
          <stop offset="0%" stopColor="rgba(167,139,250,0.25)" />
          <stop offset="100%" stopColor="rgba(167,139,250,0)" />
        </radialGradient>
      </defs>
      {[82, 180, 290].map((r) => (
        <circle key={r} cx={C} cy={C} r={r} className="kg__orbit" />
      ))}
      <circle cx={C} cy={C} r={120} fill="url(#kg-core)" />

      {/* project ↔ hub links */}
      {hubs.map((h, i) =>
        h.ev.projects.map((slug) => {
          const p = projNodes.find((n) => n.slug === slug)!;
          const on = i === active;
          return (
            <path
              key={`${i}-${slug}`}
              d={`M${p.x} ${p.y} Q ${(p.x + h.x) / 2 + (C - (p.x + h.x) / 2) * 0.35} ${(p.y + h.y) / 2 + (C - (p.y + h.y) / 2) * 0.35} ${h.x} ${h.y}`}
              className={`kg__link ${on ? 'is-on' : ''}`}
              style={{ stroke: on ? h.ev.color : undefined }}
              pathLength={100}
            />
          );
        }),
      )}

      {/* hub → skill spokes and skill dots */}
      {hubs.map((h, i) => {
        const n = h.g.items.length;
        const on = i === active;
        return (
          <g key={h.g.title} className={`kg__group ${on ? 'is-on' : ''}`} style={{ ['--gc' as string]: h.ev.color }}>
            {h.g.items.map((item, k) => {
              const deg = h.deg - 24 + (n === 1 ? 24 : (48 * k) / (n - 1));
              const s = polar(290, deg);
              return (
                <g key={item}>
                  <line x1={h.x} y1={h.y} x2={s.x} y2={s.y} className="kg__spoke" />
                  <circle cx={s.x} cy={s.y} r={on ? 5.5 : 3.5} className="kg__skill">
                    <title>{item}</title>
                  </circle>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* hubs */}
      {hubs.map((h, i) => {
        const on = i === active;
        const lab = polar(232, h.deg);
        const anchor = Math.cos(rad(h.deg)) > 0.3 ? 'start' : Math.cos(rad(h.deg)) < -0.3 ? 'end' : 'middle';
        return (
          <g
            key={h.g.title}
            className={`kg__hub ${on ? 'is-on' : ''}`}
            style={{ ['--gc' as string]: h.ev.color }}
            onClick={() => onSelect(i)}
            onMouseEnter={() => onSelect(i)}
          >
            <circle cx={h.x} cy={h.y} r={30} className="kg__hub-halo" />
            <circle cx={h.x} cy={h.y} r={17} className="kg__hub-core" />
            <text x={h.x} y={h.y + 4} textAnchor="middle" className="kg__hub-count">
              {h.g.items.length}
            </text>
            <text
              x={lab.x}
              y={lab.y + (anchor === 'middle' ? (Math.sin(rad(h.deg)) > 0 ? 14 : -4) : 4)}
              textAnchor={anchor}
              className="kg__hub-label"
            >
              {h.ev.short}
            </text>
          </g>
        );
      })}

      {/* projects in the core */}
      {projNodes.map((p) => {
        const on = activeEv.projects.includes(p.slug);
        return (
          <g key={p.slug} className={`kg__proj ${on ? 'is-on' : ''}`}>
            <circle cx={p.x} cy={p.y} r={on ? 8 : 6} />
            <text x={p.x} y={p.y + 22} textAnchor="middle">
              {SHORT_PROJECT[p.slug]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Skills() {
  const [active, setActive] = useState(0);
  const g = skills[active]!;
  const ev = EVIDENCE[g.title]!;

  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead
          index="03"
          label="Skills"
          id="skills-title"
          title={
            <>
              A capability graph, <span className="grad-text">wired to evidence</span>.
            </>
          }
          lede="Each capability hub links to the projects and work that use it. Pick a hub to see the stack and where it was applied."
        />

        <Reveal className="skillmap glass glass--edge">
          <div className="skillmap__graph">
            <SkillGraph active={active} onSelect={setActive} />
          </div>

          <div className="skillmap__panel">
            <div className="skillmap__tabs" role="tablist" aria-label="Capability areas">
              {skills.map((s, i) => {
                const e = EVIDENCE[s.title]!;
                return (
                  <button
                    key={s.title}
                    type="button"
                    role="tab"
                    id={`skilltab-${i}`}
                    aria-selected={i === active}
                    aria-controls="skill-panel"
                    tabIndex={i === active ? 0 : -1}
                    className={`skillmap__tab ${i === active ? 'is-on' : ''}`}
                    style={{ ['--gc' as string]: e.color }}
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
                    <i aria-hidden="true" />
                    {e.short}
                  </button>
                );
              })}
            </div>

            <div
              id="skill-panel"
              role="tabpanel"
              aria-labelledby={`skilltab-${active}`}
              className="skillmap__detail"
              key={active}
              style={{ ['--gc' as string]: ev.color }}
            >
              <h3 className="skillmap__title">{g.title}</h3>
              <p className="skillmap__note">{g.note}</p>
              <ul className="tags" aria-label={`${g.title} skills`}>
                {g.items.map((it) => (
                  <li key={it} className="tag skillmap__chip">
                    {it}
                  </li>
                ))}
              </ul>
              <dl className="skillmap__evidence">
                {ev.work && (
                  <div>
                    <dt>At work</dt>
                    <dd>{ev.work}</dd>
                  </div>
                )}
                <div>
                  <dt>Projects</dt>
                  <dd>
                    {ev.projects.map((slug, j) => {
                      const p = getProject(slug);
                      if (!p) return null;
                      return (
                        <span key={slug}>
                          {j > 0 && ', '}
                          <Link to={`/projects/${slug}`}>{p.name}</Link>
                        </span>
                      );
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>

        <Reveal className="stackgrid" delay={100}>
          {skills.map((s) => (
            <div key={s.title} className="stackgrid__col" style={{ ['--gc' as string]: EVIDENCE[s.title]!.color }}>
              <h3 className="stackgrid__title">{EVIDENCE[s.title]!.short}</h3>
              <p className="stackgrid__items">{s.items.join(' · ')}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
