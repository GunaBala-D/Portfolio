import type { Stage, StageKind } from '../../data/projects';
import { Diagram, type DiagramSpec } from './Diagram';

const KIND_LABEL: Record<StageKind, string> = {
  input: 'Input',
  code: 'Code',
  model: 'Model',
  llm: 'LLM',
  store: 'Store',
  human: 'Human',
  output: 'Output',
};

type Props = {
  spec: DiagramSpec;
  title: string;
  caption: string;
  /** Simplified vertical sequence shown instead of the diagram on narrow screens. */
  stages?: Stage[];
  hasDashed?: boolean;
};

export function ArchitectureFigure({ spec, title, caption, stages, hasDashed }: Props) {
  const kinds = Array.from(new Set(spec.nodes.map((n) => n.kind)));
  return (
    <figure className={`arch ${stages ? 'arch--responsive' : ''}`}>
      <div className="arch__canvas">
        <Diagram spec={spec} title={title} description={caption} />
      </div>
      <ul role="list" className="arch__legend" aria-label="Diagram legend">
        {kinds.map((k) => (
          <li key={k} style={{ ['--kc' as string]: `var(--kind-${k})` }}>
            <i aria-hidden="true" />
            {KIND_LABEL[k]}
          </li>
        ))}
        <li className="is-flow">
          <i aria-hidden="true" />
          Primary path
        </li>
        {hasDashed && (
          <li className="is-dashed">
            <i aria-hidden="true" />
            Optional / async
          </li>
        )}
      </ul>
      {stages && (
        <ol className="steps" aria-label={`${title}, step by step`}>
          {stages.map((s) => (
            <li key={s.label} data-kind={s.kind}>
              <span className="steps__kind">{KIND_LABEL[s.kind].toUpperCase()}</span>
              <span className="steps__label">{s.label}</span>
              <span className="steps__detail">{s.detail}</span>
            </li>
          ))}
        </ol>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
