import { ProjectCard } from '../components/ProjectCard';
import { SectionHead } from '../components/SectionHead';
import { projects } from '../data/projects';

const LAYOUTS = ['wide', 'wide-reverse', 'half', 'half', 'wide'] as const;

export function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHead
          index="01"
          label="Selected work"
          id="projects-title"
          title={<>Systems built end to end, with the <span className="grad-text">evaluation and limits</span> written down.</>}
          lede="Five independent projects on GitHub. Each case study covers the problem, architecture, engineering decisions, what was measured, and what was not verified."
        />
        <div className="pgrid">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} layout={LAYOUTS[i] ?? 'half'} delay={i === 3 ? 120 : 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
