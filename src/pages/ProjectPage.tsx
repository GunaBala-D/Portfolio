import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArchitectureFigure } from '../components/diagram/ArchitectureFigure';
import { ProjectCardArt } from '../components/diagram/ProjectVisuals';
import { ARCH_SPECS } from '../components/diagram/specs';
import { ArrowLeft, ArrowRight, External, Github } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { getProject, projects, type Project } from '../data/projects';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

const TOC = [
  { id: 'implementation', label: 'Implementation' },
  { id: 'decisions', label: 'Engineering decisions' },
  { id: 'reliability', label: 'Reliability & evaluation' },
  { id: 'contribution', label: 'My contribution' },
  { id: 'results', label: 'Results & learnings' },
  { id: 'links', label: 'Links' },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(',');
  useEffect(() => {
    const ids = key.split(',');
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [key]);
  return active;
}

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFound />;
  return <CaseStudy key={project.slug} project={project} />;
}

function CaseStudy({ project: p }: { project: Project }) {
  usePageMeta(`${p.name} — Case study · Guna Bala D`, p.seo);
  const toc = p.screenshots ? [...TOC.slice(0, 3), { id: 'screens', label: 'Screenshots' }, ...TOC.slice(3)] : TOC;
  const active = useActiveSection(toc.map((t) => t.id));
  const arch = ARCH_SPECS[p.slug];
  const i = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length]!;
  const next = projects[(i + 1) % projects.length]!;

  return (
    <article className="cs" aria-labelledby="cs-title">
      <header className="cs-hero">
        <div className="cs-hero__bg" aria-hidden="true" />
        <div className="container cs-hero__grid">
          <div className="cs-hero__copy">
            <Link to="/#projects" className="cs-back">
              <ArrowLeft /> All projects
            </Link>
            <p className="eyebrow hero-in" style={{ ['--i' as string]: 0 }}>
              <span className="eyebrow__index">{p.index}</span>
              <span className="eyebrow__rule" aria-hidden="true" />
              Case study{p.alias ? ` · ${p.alias}` : ''}
            </p>
            <h1 id="cs-title" className="cs-hero__title hero-in" style={{ ['--i' as string]: 1 }}>
              {p.name}
            </h1>
            <p className="cs-hero__tagline hero-in" style={{ ['--i' as string]: 2 }}>
              {p.tagline}
            </p>
            <div className="cs-hero__meta hero-in" style={{ ['--i' as string]: 3 }}>
              <p className="cs-status mono">
                <span aria-hidden="true" className="cs-status__dot" />
                {p.status}
              </p>
              <div className="cs-hero__actions">
                <a href={p.repo} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                  <Github /> View source on GitHub
                </a>
                {p.demo && (
                  <a href={p.demo} className="btn" target="_blank" rel="noopener noreferrer">
                    Open live demo <External />
                  </a>
                )}
              </div>
            </div>
            <ul className="tags hero-in" style={{ ['--i' as string]: 4 }} aria-label="Key technologies">
              {p.tags.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="cs-hero__art glass glass--edge hero-in" style={{ ['--i' as string]: 2 }}>
            <ProjectCardArt slug={p.slug} />
          </div>
        </div>
      </header>

      <section className="container cs-brief" aria-label="Overview, problem and solution">
        <Reveal className="cs-brief__item" id="overview">
          <h2 className="cs-label">Overview</h2>
          <p>{p.overview}</p>
        </Reveal>
        <Reveal className="cs-brief__item" delay={80} id="problem">
          <h2 className="cs-label">Problem</h2>
          {p.problem.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </Reveal>
        <Reveal className="cs-brief__item" delay={160} id="solution">
          <h2 className="cs-label">Solution</h2>
          <p>{p.solution}</p>
        </Reveal>
      </section>

      {arch && (
        <section className="container cs-arch" aria-labelledby="architecture">
          <Reveal>
            <h2 className="cs-h2" id="architecture">
              Architecture
            </h2>
            <ArchitectureFigure
              spec={arch.spec}
              title={`${p.name} architecture`}
              caption={p.architectureCaption}
              stages={p.stages}
              hasDashed={arch.hasDashed}
            />
          </Reveal>
        </section>
      )}

      <div className="container cs-body">
        <nav className="cs-toc" aria-label="On this page">
          <p className="cs-toc__title mono">On this page</p>
          <ol role="list">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} aria-current={active === t.id ? 'location' : undefined} className={active === t.id ? 'is-active' : ''}>
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="cs-content">
          <section id="implementation" className="cs-sec" aria-labelledby="implementation-h">
            <h2 className="cs-h2" id="implementation-h">
              Technical implementation
            </h2>
            <dl className="impl">
              {p.implementation.map((it) => (
                <Reveal key={it.area} className="impl__row">
                  <dt className="mono">{it.area}</dt>
                  <dd>{it.detail}</dd>
                </Reveal>
              ))}
            </dl>
          </section>

          <section id="decisions" className="cs-sec" aria-labelledby="decisions-h">
            <h2 className="cs-h2" id="decisions-h">
              Key engineering decisions
            </h2>
            <div className="decisions">
              {p.decisions.map((d, i) => (
                <Reveal as="article" key={d.title} className="decision glass" delay={(i % 2) * 70}>
                  <span className="decision__n mono" aria-hidden="true">
                    D{i + 1}
                  </span>
                  <h3 className="decision__title">{d.title}</h3>
                  <p>{d.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="reliability" className="cs-sec" aria-labelledby="reliability-h">
            <h2 className="cs-h2" id="reliability-h">
              Reliability &amp; evaluation
            </h2>

            {p.metrics && (
              <Reveal className="metrics">
                <ul
                  role="list"
                  className="metrics__grid"
                  style={{ ['--cols' as string]: p.metrics.length % 3 === 0 ? 3 : 4 }}
                >
                  {p.metrics.map((m) => (
                    <li key={m.label} className="metric">
                      <span className="metric__value mono">{m.value}</span>
                      <span className="metric__label">{m.label}</span>
                    </li>
                  ))}
                </ul>
                {p.metricsNote && <p className="metrics__note">{p.metricsNote}</p>}
              </Reveal>
            )}

            {p.comparison && (
              <Reveal className="compare glass">
                <h3 className="cs-h3">{p.comparison.title}</h3>
                <div className="compare__scroll" tabIndex={0} role="region" aria-label={p.comparison.title}>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Model family</th>
                        {p.comparison.columns.map((c) => (
                          <th scope="col" key={c}>
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {p.comparison.rows.map((r) => (
                        <tr key={r.name} className={r.selected ? 'is-selected' : ''}>
                          <th scope="row">
                            {r.name}
                            {r.selected && <span className="compare__badge mono">Selected</span>}
                          </th>
                          {r.values.map((v, j) => (
                            <td key={j} className="mono">
                              {v}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="metrics__note">{p.comparison.caption}</p>
              </Reveal>
            )}

            {p.weights && (
              <Reveal className="weights glass">
                <h3 className="cs-h3">{p.weights.title}</h3>
                <ul role="list" className="weights__list">
                  {p.weights.rows.map((r) => (
                    <li key={r.label}>
                      <div className="weights__row">
                        <span>{r.label}</span>
                        <span className="mono">{r.value}%</span>
                      </div>
                      <div className="meter" aria-hidden="true">
                        <span style={{ ['--v' as string]: `${r.value}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="metrics__note">{p.weights.caption}</p>
              </Reveal>
            )}

            <div className="notes">
              {p.reliability.map((r) => (
                <Reveal as="article" key={r.title} className="note">
                  <h3 className="note__title">{r.title}</h3>
                  <p>{r.body}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {p.screenshots && (
            <section id="screens" className="cs-sec" aria-labelledby="screens-h">
              <h2 className="cs-h2" id="screens-h">
                Screenshots
              </h2>
              <p className="cs-sub">From the project repository, showing the dashboard running on synthetic data.</p>
              <div className="shots">
                {p.screenshots.map((s, i) => (
                  <Reveal as="figure" key={s.src} className={`shot glass ${i === 0 ? 'shot--lead' : ''}`}>
                    <img src={s.src} alt={s.alt} width={s.width} height={s.height} loading="lazy" decoding="async" />
                    <figcaption>{s.caption}</figcaption>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          <section id="contribution" className="cs-sec" aria-labelledby="contribution-h">
            <h2 className="cs-h2" id="contribution-h">
              My contribution
            </h2>
            <Reveal as="p" className="cs-lead">
              {p.contribution}
            </Reveal>
          </section>

          <section id="results" className="cs-sec" aria-labelledby="results-h">
            <h2 className="cs-h2" id="results-h">
              Results &amp; learnings
            </h2>
            <div className="results">
              <Reveal className="results__col glass">
                <h3 className="cs-h3">What the work showed</h3>
                <ul className="bullets">
                  {p.findings.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="results__col results__col--muted" delay={80}>
                <h3 className="cs-h3">Known limitations</h3>
                <ul className="bullets">
                  {p.limitations.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          <section id="links" className="cs-sec" aria-labelledby="links-h">
            <h2 className="cs-h2" id="links-h">
              Links
            </h2>
            <ul role="list" className="cs-links">
              <li>
                <a href={p.repo} target="_blank" rel="noopener noreferrer">
                  <Github />
                  <span>
                    <strong>Source code</strong>
                    <span className="mono">{p.repo.replace('https://', '')}</span>
                  </span>
                  <External />
                </a>
              </li>
              {p.demo && (
                <li>
                  <a href={p.demo} target="_blank" rel="noopener noreferrer">
                    <ArrowRight />
                    <span>
                      <strong>Live demo</strong>
                      <span className="mono">{p.demo.replace('https://', '')}</span>
                    </span>
                    <External />
                  </a>
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>

      <nav className="container cs-pager" aria-label="More projects">
        <Link to={`/projects/${prev.slug}`} className="cs-pager__link">
          <span className="mono">
            <ArrowLeft /> Previous
          </span>
          <strong>{prev.name}</strong>
        </Link>
        <Link to={`/projects/${next.slug}`} className="cs-pager__link cs-pager__link--next">
          <span className="mono">
            Next <ArrowRight />
          </span>
          <strong>{next.name}</strong>
        </Link>
      </nav>
    </article>
  );
}
