import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type Props = { index: string; label: string; title: ReactNode; lede?: ReactNode; id?: string };

export function SectionHead({ index, label, title, lede, id }: Props) {
  return (
    <Reveal className="section-head">
      <p className="eyebrow">
        <span className="eyebrow__index">{index}</span>
        <span className="eyebrow__rule" aria-hidden="true" />
        {label}
      </p>
      <h2 className="h-section" id={id}>
        {title}
      </h2>
      {lede && <p className="lede">{lede}</p>}
    </Reveal>
  );
}
