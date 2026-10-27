import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { profile } from '../data/profile';
import { Close, Menu } from './Icons';

const LINKS = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#about', label: 'About' },
];

export function Wordmark() {
  return (
    <span className="wordmark">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="wordmark__mark">
        <path d="M5 17 12 6l7 11" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" opacity=".6" />
        <circle cx="5" cy="17" r="2.6" fill="var(--bg)" stroke="var(--text)" strokeWidth="1.6" />
        <circle cx="19" cy="17" r="2.6" fill="var(--bg)" stroke="var(--text)" strokeWidth="1.6" />
        <circle cx="12" cy="6" r="3" fill="var(--accent)" />
      </svg>
      <span className="wordmark__name">{profile.name}</span>
    </span>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route or hash changes.
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled || open ? 'is-scrolled' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="nav__brand" aria-label={`${profile.name}, home`}>
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="nav__links">
            <ul role="list">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="nav__link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__actions">
            <a href={profile.resume} className="nav__link nav__resume" target="_blank" rel="noopener">
              Resume
            </a>
            <Link to="/#contact" className="btn btn--primary btn--sm nav__cta">
              Contact me
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Sibling of the header: its backdrop-filter would otherwise become the containing block for this fixed panel. */}
      <div id="mobile-menu" ref={panelRef} className={`nav__panel ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile" className="container">
          <ul role="list">
            {LINKS.map((l, i) => (
              <li key={l.href} style={{ transitionDelay: `${i * 30}ms` }}>
                <Link to={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={profile.resume} target="_blank" rel="noopener">
                Resume (PDF)
              </a>
            </li>
            <li>
              <Link to="/#contact" onClick={() => setOpen(false)} className="is-cta">
                Contact me
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
