import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { Wordmark } from './Nav';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__id">
          <Link to="/" aria-label={`${profile.name}, home`}>
            <Wordmark />
          </Link>
          <p className="muted">
            {profile.role} · {profile.location}
          </p>
        </div>
        <ul role="list" className="footer__links">
          <li>
            <a href={`mailto:${profile.email}`}>Email</a>
          </li>
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
        </ul>
        <p className="footer__copy muted">© {new Date().getFullYear()} {profile.name}</p>
      </div>
    </footer>
  );
}
