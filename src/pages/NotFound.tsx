import { Link } from 'react-router-dom';
import { ArrowLeft } from '../components/Icons';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page not found · Guna Bala D', 'This page does not exist. Return to the portfolio of Guna Bala D, AI/ML Engineer.');
  return (
    <div className="frame">
      <section className="notfound" aria-labelledby="nf-title">
        <p className="hud-label muted">
          <span className="faint">404</span>
          <span className="section__slash faint" aria-hidden="true">
            /
          </span>
          No match retrieved
        </p>
        <h1 id="nf-title" className="h-section">
          This page isn&rsquo;t in the <span className="serif">index</span>.
        </h1>
        <p className="lede">The link may be mistyped, or the page may have moved.</p>
        <Link to="/" className="btn btn--primary">
          <ArrowLeft /> Back to the portfolio
        </Link>
      </section>
    </div>
  );
}
