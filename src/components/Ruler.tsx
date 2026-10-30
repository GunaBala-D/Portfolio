import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function ticks() {
  return Array.from({ length: 101 }, (_, i) => i);
}

/**
 * Right-edge scroll ruler. The scale is laid out at the document's own length, so it travels with
 * the page, while a fixed readout descends the viewport and rolls through the percentage.
 */
export function Ruler() {
  const { pathname } = useLocation();
  const track = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const cols = useRef<(HTMLSpanElement | null)[]>([]);
  const [docH, setDocH] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-ruler', 'on');
    return () => document.documentElement.removeAttribute('data-ruler');
  }, []);

  useEffect(() => {
    const measure = () => setDocH(document.documentElement.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const paint = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, y / max));
      if (track.current) track.current.style.transform = `translate3d(0, ${-y}px, 0)`;
      if (marker.current) marker.current.style.transform = `translate3d(0, ${p * (window.innerHeight - 48 - 20)}px, 0)`;
      const pct = String(Math.round(p * 100)).padStart(3, '0');
      cols.current.forEach((col, i) => {
        if (col) col.style.transform = `translateY(${-Number(pct[i])}em)`;
      });
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [docH, pathname]);

  return (
    <div className="ruler" aria-hidden="true">
      <div ref={track} className="ruler__track" style={{ height: docH }}>
        {ticks().map((i) => {
          const major = i % 5 === 0;
          return (
            <span key={i} style={{ position: 'absolute', top: `${i}%`, right: 0, left: 0 }}>
              <span className={`ruler__tick ${major ? 'ruler__tick--major' : ''}`} />
              {major && <span className="ruler__num">{i}</span>}
            </span>
          );
        })}
      </div>
      <div ref={marker} className="ruler__marker">
        <span className="ruler__readout">
          {[0, 1, 2].map((c) => (
            <span key={c} className="ruler-digits">
              <span
                className="ruler-digit-col"
                ref={(el) => {
                  cols.current[c] = el;
                }}
              >
                {DIGITS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ))}
          <span>%</span>
        </span>
      </div>
    </div>
  );
}
