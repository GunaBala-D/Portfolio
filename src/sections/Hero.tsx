import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Github } from '../components/Icons';
import { LatentSpace } from '../components/LatentSpace';
import { CountUp, RadialGauge } from '../components/Metrics';
import { profile } from '../data/profile';

const SIGNALS = ['RAG', 'LangGraph', 'MCP', 'Claude', 'Ollama', 'pgvector', 'FastAPI', 'scikit-learn', 'YOLO'];

const STATS = [
  { value: '7', label: 'internal teams adopted the Accounting Co-Pilot I built' },
  { value: '1,000+', label: 'business records grounding RAG answers on pgvector' },
  { value: '15,000+', label: 'daily log events scored by my anomaly detection' },
];

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__badge hero-in" style={{ ['--i' as string]: 0 }}>
            <span className="hero__avatar">
              <img src="/images/guna-bala-cutout-200.png" alt="" width={200} height={200} decoding="async" />
              <span className="hero__dot" aria-hidden="true" />
            </span>
            {profile.role} · Srikesh Infotech
            <span className="hero__badge-sep" aria-hidden="true" />
            <span className="muted">{profile.location}</span>
          </p>
          <h1 id="hero-title" className="hero__title hero-in" style={{ ['--i' as string]: 1 }}>
            <span className="hero__name">{profile.name}</span>
            <span className="sr-only">, {profile.role}</span>
          </h1>
          <p className="hero__statement hero-in" style={{ ['--i' as string]: 2 }}>
            I build LLM and ML systems that stay <span className="grad-text">grounded</span>: retrieval with citations,
            agents with guardrails, and models evaluated against real metrics.
          </p>
          <p className="hero__support hero-in" style={{ ['--i' as string]: 3 }}>
            Since September 2025 I&rsquo;ve built an Accounting Co-Pilot on Claude and Ollama, RAG over business records,
            and anomaly detection for live operations. My five independent projects are published end to end, with
            architecture, tests and documented limits.
          </p>
          <div className="hero__ctas hero-in" style={{ ['--i' as string]: 4 }}>
            <Link to="/#projects" className="btn btn--primary">
              Explore projects <ArrowRight />
            </Link>
            <a href={profile.resume} className="btn" target="_blank" rel="noopener">
              <FileText /> View resume
            </a>
            <a href={profile.github} className="btn hero__gh" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <Github />
            </a>
          </div>
        </div>

        <div className="hero__visual hero-in" style={{ ['--i' as string]: 2 }}>
          <div className="hero__visual-frame glass glass--edge">
            <LatentSpace />
          </div>
        </div>
      </div>

      <div className="container">
        <ul role="list" className="hero__stats" aria-label="Highlights from my work">
          {STATS.map((s, i) => (
            <li key={s.label} className="hero__stat glass hero-in" style={{ ['--i' as string]: 5 + i * 0.6 }}>
              <CountUp value={s.value} className="hero__stat-value" />
              <span className="hero__stat-label">{s.label}</span>
            </li>
          ))}
          <li className="hero__stat hero__stat--gauge glass hero-in" style={{ ['--i' as string]: 6.8 }}>
            <RadialGauge value={89} display="~89%" label="" size={84} />
            <span className="hero__stat-label">
              anomaly-detection F1 after grid and random search tuning (~90% precision, ~88% recall)
            </span>
          </li>
        </ul>

        <div className="ticker hero-in" style={{ ['--i' as string]: 8 }} aria-label="Core stack">
          <div className="ticker__track">
            {[0, 1].map((dup) => (
              <ul role="list" key={dup} aria-hidden={dup === 1 ? true : undefined}>
                {SIGNALS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
