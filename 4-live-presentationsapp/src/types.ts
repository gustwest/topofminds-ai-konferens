export type NodeTone = 'navy' | 'purple' | 'white' | 'emerald' | 'amber' | 'rose';

export interface FlowNode {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  homeTag?: string;
  /** Center coordinates on a 1000 x 430 schematic canvas */
  x: number;
  y: number;
  width?: number;
  tone: NodeTone;
  detailTitle: string;
  detailSummary: string;
  bullets: string[];
  snippetLabel?: string;
  snippet?: string;
  warning?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  dashed?: boolean;
  accent?: 'purple' | 'navy' | 'emerald' | 'amber';
}

export interface SubFlowVariant {
  id: string;
  tabLabel: string;
  headline: string;
  lead: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface SlideDefinition {
  id: string;
  num: string;
  shortNav: string;
  eyebrow: string;
  title: string;
  lead: string;
  sourceFile: string;
  bannerCallout?: {
    badge: string;
    title: string;
    text: string;
    contrastLabel: string;
    contrastText: string;
  };
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  variants?: SubFlowVariant[];
  bottomStrip?: {
    label: string;
    items: { tag: string; title: string; desc: string; tone?: 'default' | 'danger' | 'purple' }[];
  };
}
