import { useInView } from '../hooks/useInView';

// Milestones and dates exactly as stated on the resume.
const MILESTONES = [
  { when: '2021', title: 'B.Tech, Information Technology', where: 'Rajiv Gandhi College of Engineering and Technology', kind: 'edu' },
  { when: 'Jun 2025', title: 'Web Development Intern', where: 'Twilight IT Solution', kind: 'work' },
  { when: '2025', title: 'Graduated with A Grade', where: 'B.Tech completed', kind: 'edu' },
  { when: 'Sep 2025', title: 'AI/ML Engineer', where: 'Srikesh Infotech (SKIT)', kind: 'work', current: true },
  { when: 'Sep 2026', title: 'Apply AI at Work Pathway', where: 'OpenAI Academy', kind: 'cert' },
] as const;

export function Timeline() {
  const [ref, inView] = useInView<HTMLOListElement>({ once: true, rootMargin: '0px 0px -15% 0px' });
  return (
    <ol ref={ref} className={`tl ${inView ? 'is-in' : ''}`} aria-label="Career timeline">
      {MILESTONES.map((m, i) => (
        <li
          key={m.title}
          className={`tl__item tl__item--${m.kind} ${'current' in m && m.current ? 'is-current' : ''}`}
          style={{ ['--d' as string]: `${i * 140}ms` }}
        >
          <span className="tl__node" aria-hidden="true" />
          <span className="tl__when mono">{m.when}</span>
          <span className="tl__title">{m.title}</span>
          <span className="tl__where">{m.where}</span>
        </li>
      ))}
    </ol>
  );
}
