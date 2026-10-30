import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { Mark } from './Nav';

export function Footer() {
  return (
    <footer className="footer">
      <div className="frame">
        <div className="footer__grid">
          <div className="footer__id">
            <Link to="/" aria-label={`${profile.name}, home`} style={{ width: 'fit-content' }}>
              <Mark />
            </Link>
            <p>
              {profile.role} building LLM, retrieval and machine learning systems that stay grounded.
            </p>
            <a className="hud-label faint" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </div>
          <nav className="footer__col" aria-label="Projects">
            <h2>Projects</h2>
            <ul role="list">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link to={`/projects/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="footer__col" aria-label="Site">
            <h2>Site</h2>
            <ul role="list">
              <li>
                <Link to="/#projects">Work</Link>
              </li>
              <li>
                <Link to="/#experience">Experience</Link>
              </li>
              <li>
                <Link to="/#skills">Skills</Link>
              </li>
              <li>
                <Link to="/#about">About</Link>
              </li>
              <li>
                <Link to="/#contact">Contact</Link>
              </li>
            </ul>
          </nav>
          <nav className="footer__col" aria-label="Elsewhere">
            <h2>Elsewhere</h2>
            <ul role="list">
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.resume} target="_blank" rel="noopener">
                  Resume
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`}>Email</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer__base hud-label">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>{profile.location}</span>
        </div>
      </div>
    </footer>
  );
}
