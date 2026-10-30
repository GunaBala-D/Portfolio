import { useRef } from 'react';
import { Marquee } from '../components/Marquee';
import { SectionIndex } from '../components/SectionIndex';
import { profile } from '../data/profile';
import { usePageMeta } from '../hooks/usePageMeta';
import { useChoreo } from '../motion/useChoreo';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Experience } from '../sections/Experience';
import { Hero } from '../sections/Hero';
import { Projects } from '../sections/Projects';
import { Skills } from '../sections/Skills';

export const HOME_TITLE = 'Guna Bala D — AI/ML Engineer';
export const HOME_DESCRIPTION =
  'Guna Bala D is an AI/ML Engineer building RAG systems, LangGraph agents, anomaly detection and ML pipelines. Case studies with architecture, evaluation and engineering trade-offs.';

const STACK = ['RAG', 'LangGraph', 'MCP', 'Claude', 'Ollama', 'pgvector', 'FastAPI', 'scikit-learn', 'YOLO'];

const INDEX = [
  { id: 'top', label: profile.name },
  { id: 'projects', label: 'Selected work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function Home() {
  usePageMeta(HOME_TITLE, HOME_DESCRIPTION);
  const root = useRef<HTMLDivElement>(null);
  useChoreo(root);
  return (
    <div ref={root}>
      <SectionIndex items={INDEX} />
      <Hero />
      <Projects />
      <Marquee items={STACK} label="Core stack" />
      <Experience />
      <Skills />
      <About />
      <Contact />
    </div>
  );
}
