import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { profile } from '../data/profile';
import { setScrollLocked } from '../motion/smooth';
import { Close, Github, Menu, Moon, Sun } from './Icons';

const LINKS = [
  { href: '/', id: 'top', label: 'Home' },
  { href: '/#projects', id: 'projects', label: 'Work' },
  { href: '/#experience', id: 'experience', label: 'Experience' },
  { href: '/#skills', id: 'skills', label: 'Skills' },
  { href: '/#about', id: 'about', label: 'About' },
];

export function Mark({ className = 'mark' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M19.2 6.4H8.6L4 12l4.6 5.6h10.6V11.6h-6.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const read = () => {
      const set = document.documentElement.getAttribute('data-theme');
      if (set === 'light' || set === 'dark') return set;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    setTheme(read());
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const html = document.documentElement;
    html.classList.add('theme-anim');
    html.setAttribute('data-theme', next);
    window.setTimeout(() => html.classList.remove('theme-anim'), 450);
    try {
      localStorage.setItem('guna-theme', next);
    } catch {
      /* the choice just won't persist */
    }
    setTheme(next);
  };

  return [theme, toggle] as const;
}

/** Which home section the reader is in, for the inverted nav pill. */
function useCurrentSection(pathname: string) {
  const [current, setCurrent] = useState('top');
  useEffect(() => {
    if (pathname !== '/') {
      setCurrent(pathname.startsWith('/projects') ? 'projects' : '');
      return;
    }
    setCurrent('top');
    let io: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setCurrent(e.target.id === 'contact' ? '' : e.target.id);
          });
        },
        { rootMargin: '-45% 0px -54% 0px' },
      );
      ['top', 'projects', 'experience', 'skills', 'about', 'contact'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) io!.observe(el);
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [pathname]);
  return current;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [theme, toggleTheme] = useTheme();
  const current = useCurrentSection(location.pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the mobile menu whenever the route or hash changes.
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => {
      setScrollLocked(false);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className="nav">
        <div className="nav__inner">
          <div className="nav__left">
            <Link to="/" className="nav__brand" aria-label={`${profile.name}, home`}>
              <Mark />
            </Link>
            <nav aria-label="Primary" className="nav__links">
              <ul role="list">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      className={`nav__link ${current === l.id ? 'is-active' : ''}`}
                      aria-current={current === l.id ? 'true' : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="nav__right">
            <a href={profile.resume} className="nav__link nav__resume" target="_blank" rel="noopener">
              Resume
            </a>
            <a href={profile.github} className="nav__cell" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <Github />
            </a>
            <button
              type="button"
              className="nav__cell"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <button
              ref={toggleRef}
              type="button"
              className="nav__cell nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close /> : <Menu />}
            </button>
            <Link to="/#contact" className="nav__cta">
              Contact me
            </Link>
          </div>
        </div>
      </header>

      {/* Sibling of the header: its backdrop-filter would otherwise become the containing block for this fixed panel. */}
      <div id="mobile-menu" ref={panelRef} className={`nav__panel ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
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
