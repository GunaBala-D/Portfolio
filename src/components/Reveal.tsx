import type { CSSProperties, ElementType, PointerEventHandler, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

type Props = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
  id?: string;
  onPointerMove?: PointerEventHandler<HTMLElement>;
};

/** Fades and lifts its content in once, the first time it scrolls into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, id, onPointerMove }: Props) {
  const [ref, inView] = useInView<HTMLElement>({ rootMargin: '0px 0px -8% 0px', once: true });
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${inView ? 'is-visible' : ''} ${className ?? ''}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
      onPointerMove={onPointerMove}
    >
      {children}
    </Tag>
  );
}
