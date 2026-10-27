import { Diagram, type DiagramSpec } from './Diagram';
import { documentRiskCard, ragCard, resumeIqCard, supportPilotCard } from './specs';
import { VisionCardArt } from './VisionCardArt';

const CARD_SPECS: Record<string, DiagramSpec> = {
  supportpilot: supportPilotCard,
  'document-risk-engine': documentRiskCard,
  'enterprise-rag': ragCard,
  resumeiq: resumeIqCard,
};

/** Decorative system sketch for a project card; the card text carries the meaning. */
export function ProjectCardArt({ slug }: { slug: string }) {
  if (slug === 'ai-vision-monitor') return <VisionCardArt />;
  const spec = CARD_SPECS[slug];
  if (!spec) return null;
  return <Diagram spec={spec} title="" decorative className="dg--card" />;
}
