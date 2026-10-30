import type { ElementType, ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

type Props = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
  id?: string;
};

/** Marks content for the blur-up reveal in useChoreo; `is-visible` also starts inner CSS animations. */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, id }: Props) {
  const [ref, inView] = useInView<HTMLElement>({ rootMargin: '0px 0px -8% 0px', once: true });
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal
      data-delay={delay || undefined}
      className={`${inView ? 'is-visible' : ''} ${className ?? ''}`.trim() || undefined}
    >
      {children}
    </Tag>
  );
}
