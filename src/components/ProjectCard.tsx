import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import { spotlightHandler } from '../hooks/useSpotlight';
import { ProjectCardArt } from './diagram/ProjectVisuals';
import { ArrowRight, External, Github } from './Icons';
import { Reveal } from './Reveal';

type Props = { project: Project; layout: 'wide' | 'wide-reverse' | 'half'; delay?: number };

export function ProjectCard({ project: p, layout, delay = 0 }: Props) {
  const href = `/projects/${p.slug}`;
  const titleId = `card-${p.slug}`;
  return (
    <Reveal
      as="article"
      className={`pcard pcard--${layout} glass glass--edge spotlight`}
      delay={delay}
      onPointerMove={spotlightHandler}
    >
      <div className="pcard__art">
        <span className="pcard__index mono" aria-hidden="true">
          {p.index}
        </span>
        <div className="pcard__art-inner">
          <ProjectCardArt slug={p.slug} />
        </div>
      </div>

      <div className="pcard__body">
        <p className="pcard__status mono">{p.status}</p>
        <h3 className="pcard__title" id={titleId}>
          <Link to={href} className="pcard__link">
            {p.name}
          </Link>
          {p.alias && <span className="pcard__alias">{p.alias}</span>}
        </h3>
        <p className="pcard__problem">{p.cardProblem}</p>

        <div className="pcard__highlight">
          <span className="pcard__hl-value mono">{p.cardHighlight.value}</span>
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
            Read case study <ArrowRight />
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
    </Reveal>
  );
}
