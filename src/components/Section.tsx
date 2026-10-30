import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type Props = {
  id: string;
  index: string;
  label: string;
  note?: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
};

/** A ruled section: drawn hairline, crosshairs, sticky "01 / Label" bar, then headline. */
export function Section({ id, index, label, note, title, lede, action, children }: Props) {
  const titleId = `${id}-title`;
  return (
    <section className="section" id={id} data-choreo aria-labelledby={titleId}>
      <span className="section__rule" data-draw-rule aria-hidden="true" />
      <div className="frame">
        <span className="tick tick--half tick--tl" data-draw-tick aria-hidden="true" />
        <span className="tick tick--half tick--tr" data-draw-tick aria-hidden="true" />
        <SectionBar index={index} label={label} note={note} />
        <div className="section__head">
          <div>
            <Reveal as="h2" className="h-section" id={titleId}>
              {title}
            </Reveal>
            {lede && (
              <Reveal as="p" className="lede">
                {lede}
              </Reveal>
            )}
          </div>
          {action && <Reveal>{action}</Reveal>}
        </div>
        {children}
      </div>
    </section>
  );
}

export function SectionBar({ index, label, note }: { index: string; label: string; note?: string }) {
  return (
    <div className="section__bar" data-draw-bar>
      <p className="hud-label muted">
        <span className="faint">{index}</span>
        <span className="section__slash faint" aria-hidden="true">
          /
        </span>
        {label}
      </p>
      {note && <p className="hud-label faint section__note">{note}</p>}
    </div>
  );
}
