import { Link } from 'react-router-dom';
import { ArrowLeft } from '../components/Icons';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page not found · Guna Bala D', 'This page does not exist. Return to the portfolio of Guna Bala D, AI/ML Engineer.');
  return (
    <section className="container notfound" aria-labelledby="nf-title">
      <p className="eyebrow">
        <span className="eyebrow__index">404</span>
        <span className="eyebrow__rule" aria-hidden="true" />
        No match retrieved
      </p>
      <h1 id="nf-title" className="h-section">
        This page isn&rsquo;t in the index.
      </h1>
      <p className="lede">The link may be mistyped, or the page may have moved.</p>
      <Link to="/" className="btn btn--primary">
        <ArrowLeft /> Back to the portfolio
      </Link>
    </section>
  );
}
