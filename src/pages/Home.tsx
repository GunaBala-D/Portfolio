import { usePageMeta } from '../hooks/usePageMeta';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Experience } from '../sections/Experience';
import { Hero } from '../sections/Hero';
import { Projects } from '../sections/Projects';
import { Skills } from '../sections/Skills';

export const HOME_TITLE = 'Guna Bala D — AI/ML Engineer';
export const HOME_DESCRIPTION =
  'Guna Bala D is an AI/ML Engineer building RAG systems, LangGraph agents, anomaly detection and ML pipelines. Case studies with architecture, evaluation and engineering trade-offs.';

export function Home() {
  usePageMeta(HOME_TITLE, HOME_DESCRIPTION);
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <Skills />
      <About />
      <Contact />
    </>
  );
}
