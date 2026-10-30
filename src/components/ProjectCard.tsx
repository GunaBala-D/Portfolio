import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import { ProjectCardArt } from './diagram/ProjectVisuals';
import { ArrowRight, External, Github } from './Icons';

export function ProjectCard({ project: p }: { project: Project }) {
  const href = `/projects/${p.slug}`;
  const titleId = `card-${p.slug}`;
  const shot = p.screenshots?.[0];
  return (
    <article data-reveal className="pcard">
      <div className="card-bar">
        <p className="hud-label muted">{p.alias ?? p.tags[0]}</p>
        <p className="hud-label faint">{p.index}</p>
      </div>

      <Link to={href} className="pcard__media" tabIndex={-1} aria-hidden="true">
        {shot ? (
          <img src={shot.src} alt="" width={shot.width} height={shot.height} loading="lazy" decoding="async" />
        ) : (
          <span className="pcard__art">
            <ProjectCardArt slug={p.slug} />
          </span>
        )}
      </Link>

      <div className="pcard__body">
        <h3 className="h-card" id={titleId}>
          <Link to={href} className="pcard__link">
            {p.name}
          </Link>
        </h3>
        <p className="pcard__problem">{p.cardProblem}</p>

        <div className="pcard__highlight">
          <span className="pcard__hl-value display">{p.cardHighlight.value}</span>
          <span className="pcard__hl-label">{p.cardHighlight.label}</span>
        </div>

        <ul className="tags" aria-label="Key technologies">
          {p.tags.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>

        <div className="pcard__actions">
          <Link to={href} className="btn btn--sm btn--primary" aria-describedby={titleId}>
            Case study <ArrowRight />
          </Link>
          <a href={p.repo} className="btn btn--sm" target="_blank" rel="noopener noreferrer" aria-label={`${p.name} source code on GitHub`}>
            <Github /> Code
          </a>
          {p.demo && (
            <a href={p.demo} className="btn btn--sm" target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live demo`}>
              Live demo <External />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
