import { External, Github } from '../components/Icons';
import { ProjectCard } from '../components/ProjectCard';
import { Section } from '../components/Section';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

export function Projects() {
  return (
    <Section
      id="projects"
      index="01"
      label="Selected work"
      note="Five independent projects"
      title={
        <>
          Built end to end, with the <span className="serif">limits</span> written down.
        </>
      }
      lede="Five independent projects on GitHub. Each case study covers the problem, architecture, engineering decisions, what was measured, and what was not verified."
      action={
        <a href={profile.github} className="hud-label link-hud" target="_blank" rel="noopener noreferrer">
          All repositories <External />
        </a>
      }
    >
      <div className="ruled pgrid" data-reveal-group>
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
        <a
          data-reveal
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="pcard-cta"
        >
          <span className="hud-label muted">Source</span>
          <span className="pcard-cta__title display">
            Read the <span className="serif">code</span>.
          </span>
          <span className="btn btn--primary">
            <Github /> {profile.githubLabel}
          </span>
        </a>
      </div>
    </Section>
  );
}
