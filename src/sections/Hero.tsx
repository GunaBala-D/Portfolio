import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, FileText, Github } from '../components/Icons';
import { profile } from '../data/profile';

const Galaxy = lazy(() => import('../components/galaxy/Galaxy'));

const WORDMARK = profile.name.toUpperCase();

// The full entrance plays once per page load; returning to the home page should not make people wait.
let introPlayed = false;

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    if (!el) return;
    if (introPlayed || !html.hasAttribute('data-intro')) {
      html.removeAttribute('data-intro');
      return;
    }
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>('.wm-letter');
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
      gsap.set(letters, { opacity: 0, yPercent: 26, filter: 'blur(10px)' });
      gsap.set(lines, { autoAlpha: 0, y: 24, filter: 'blur(8px)' });
      const tl = gsap.timeline({
        onComplete: () => {
          introPlayed = true;
          html.removeAttribute('data-intro');
        },
      });
      tl.to(letters[0]!, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, 0.05)
        .to(
          letters.slice(1),
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out', stagger: 0.05 },
          0.4,
        )
        .to(
          lines,
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.09, clearProps: 'opacity,visibility,transform,filter' },
          0.95,
        );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__stage">
        <Suspense fallback={null}>
          <Galaxy eventsFrom={root} />
        </Suspense>
      </div>

      <div className="hero__copy">
        <div className="wm" aria-hidden="true">
          {Array.from(WORDMARK).map((ch, i) => (
            <span key={i} className={`wm-letter ${ch === ' ' ? 'wm-letter--space' : ''}`}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>

        <h1 id="hero-title" className="hero__title" data-hero-line data-hero-text>
          <span className="sr-only">
            {profile.name}, {profile.role}.{' '}
          </span>
          AI/ML systems <span className="serif muted">that stay grounded.</span>
        </h1>
        <p className="hero__lede" data-hero-line data-hero-text>
          I build retrieval with citations, agents with guardrails, and models evaluated against real metrics.
        </p>
        <div className="hero__ctas" data-hero-line>
          <span className="hero__cta-col">
            <Link to="/#projects" className="btn btn--primary">
              Explore projects <ArrowRight />
            </Link>
            <span className="hud-label faint hero__under">Five case studies · code on GitHub</span>
          </span>
          <a href={profile.resume} className="btn" target="_blank" rel="noopener">
            <FileText /> View resume
          </a>
        </div>
        <p className="hero__alt" data-hero-line data-hero-text>
          Want to talk? <a className="link-ink" href={`mailto:${profile.email}`}>Email me</a> or{' '}
          <a className="link-ink" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            connect on LinkedIn
          </a>
          .
        </p>
        <p className="hero__meta hud-label muted" data-hero-line>
          <a className="hero__meta-link" href={profile.github} target="_blank" rel="noopener noreferrer">
            <Github /> Code on GitHub
          </a>
          <span>
            {profile.role} · Srikesh Infotech
          </span>
          <span>{profile.location}</span>
        </p>
      </div>
    </section>
  );
}
