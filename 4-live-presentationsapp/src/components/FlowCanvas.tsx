import React from 'react';
import type { FlowEdge, FlowNode, NodeTone } from '../types';

interface FlowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string;
  pinnedNodeId: string | null;
  pointerMode: boolean;
  onSelectNode: (node: FlowNode, pinForAi: boolean) => void;
}

const TONE_STYLES: Record<
  NodeTone,
  {
    card: string;
    codeBg: string;
    titleColor: string;
    subColor: string;
    tagStyle: string;
  }
> = {
  navy: {
    card: 'bg-[#09213a] text-slate-50 border-[#09213a]',
    codeBg: 'bg-white/15 text-purple-200',
    titleColor: 'text-white',
    subColor: 'text-slate-300',
    tagStyle: 'bg-black/25 text-slate-200 border-white/15',
  },
  purple: {
    card: 'bg-[#7c3aed] text-white border-[#6d28d9]',
    codeBg: 'bg-black/20 text-white',
    titleColor: 'text-white',
    subColor: 'text-purple-100',
    tagStyle: 'bg-black/20 text-purple-50 border-white/20',
  },
  emerald: {
    card: 'bg-white text-slate-900 border-emerald-600 border-l-4',
    codeBg: 'bg-emerald-50 text-emerald-800',
    titleColor: 'text-slate-900',
    subColor: 'text-slate-600',
    tagStyle: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  amber: {
    card: 'bg-white text-slate-900 border-amber-600 border-l-4',
    codeBg: 'bg-amber-50 text-amber-800',
    titleColor: 'text-slate-900',
    subColor: 'text-slate-600',
    tagStyle: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  rose: {
    card: 'bg-white text-slate-900 border-rose-600 border-l-4',
    codeBg: 'bg-rose-50 text-rose-800',
    titleColor: 'text-slate-900',
    subColor: 'text-slate-600',
    tagStyle: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  white: {
    card: 'bg-white text-slate-900 border-[#d7dee4]',
    codeBg: 'bg-[#f1f4f6] text-[#09213a]',
    titleColor: 'text-slate-900',
    subColor: 'text-slate-600',
    tagStyle: 'bg-[#f1f4f6] text-slate-700 border-[#d7dee4]',
  },
};

const EDGE_COLORS: Record<NonNullable<FlowEdge['accent']>, string> = {
  purple: '#7c3aed',
  navy: '#09213a',
  emerald: '#15803d',
  amber: '#b45309',
};

function computeEdgeGeometry(from: FlowNode, to: FlowNode) {
  const fw = (from.width ?? 210) / 2;
  const tw = (to.width ?? 210) / 2;
  const fh = 48;
  const th = 48;

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  let sx = from.x;
  let sy = from.y;
  let ex = to.x;
  let ey = to.y;

  if (Math.abs(dx) > Math.abs(dy) * 1.15) {
    const sign = dx >= 0 ? 1 : -1;
    sx = from.x + sign * fw;
    ex = to.x - sign * (tw + 6);
    const midX = (sx + ex) / 2;
    return {
      path: `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ey}, ${ex} ${ey}`,
      lx: midX,
      ly: (sy + ey) / 2 - (Math.abs(dy) < 25 ? 13 : 0),
    };
  }

  const signY = dy >= 0 ? 1 : -1;
  sy = from.y + signY * fh;
  ey = to.y - signY * (th + 6);
  const midY = (sy + ey) / 2;
  return {
    path: `M ${sx} ${sy} C ${sx} ${midY}, ${ex} ${midY}, ${ex} ${ey}`,
    lx: (sx + ex) / 2,
    ly: midY,
  };
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  pinnedNodeId,
  pointerMode,
  onSelectNode,
}) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="relative w-full bg-white border border-[#d7dee4] overflow-x-auto">
      {/* Subtle architectural grid background */}
      <div
        className="relative min-w-[860px] w-full aspect-[1000/435]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(9 33 58 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(9 33 58 / 0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      >
        <svg
          viewBox="0 0 1000 435"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            {(['purple', 'navy', 'emerald', 'amber'] as const).map((accent) => (
              <marker
                key={accent}
                id={`arrow-${accent}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6.5"
                markerHeight="6.5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill={EDGE_COLORS[accent]} />
              </marker>
            ))}
          </defs>

          {edges.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            const accent = edge.accent ?? 'navy';
            const stroke = EDGE_COLORS[accent];
            const geom = computeEdgeGeometry(from, to);
            const isHighlighted =
              selectedNodeId === edge.from || selectedNodeId === edge.to;

            return (
              <g key={`${edge.from}->${edge.to}`}>
                {/* Base solid rail */}
                <path
                  d={geom.path}
                  fill="none"
                  stroke={stroke}
                  strokeOpacity={edge.dashed ? 0.25 : isHighlighted ? 0.35 : 0.18}
                  strokeWidth={isHighlighted ? 3 : 2}
                  strokeDasharray={edge.dashed ? '4 5' : undefined}
                />
                {/* Moving signal pulse */}
                {edge.animated && (
                  <path
                    d={geom.path}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={isHighlighted ? 3 : 2.2}
                    markerEnd={`url(#arrow-${accent})`}
                    className="flow-edge-animated"
                  />
                )}
                {!edge.animated && (
                  <path
                    d={geom.path}
                    fill="none"
                    stroke={stroke}
                    strokeOpacity={0.55}
                    strokeWidth={2}
                    strokeDasharray={edge.dashed ? '5 5' : undefined}
                    markerEnd={`url(#arrow-${accent})`}
                  />
                )}
                {edge.label && (
                  <g transform={`translate(${geom.lx}, ${geom.ly})`}>
                    <rect
                      x={-(edge.label.length * 3.5 + 10)}
                      y={-10}
                      width={edge.label.length * 7 + 20}
                      height={20}
                      fill="#ffffff"
                      stroke="#d7dee4"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#09213a"
                      fontSize="10.5"
                      fontWeight="700"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Node Cards positioned on the 1000 x 435 coordinate canvas */}
        {nodes.map((node) => {
          const t = TONE_STYLES[node.tone];
          const isSelected = selectedNodeId === node.id;
          const isPinned = pinnedNodeId === node.id;
          const widthPct = ((node.width ?? 210) / 1000) * 100;
          const leftPct = (node.x / 1000) * 100;
          const topPct = (node.y / 435) * 100;

          return (
            <button
              key={node.id}
              type="button"
              onClick={(e) => onSelectNode(node, pointerMode || e.altKey)}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute text-left p-2.5 border transition-shadow cursor-pointer select-none ${t.card} ${
                isSelected
                  ? 'ring-3 ring-[#7c3aed] ring-offset-2 z-20 shadow-lg'
                  : 'hover:shadow-md z-10'
              } ${isPinned ? 'ai-pinned-ring' : ''}`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-[10px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 ${t.codeBg}`}>
                  {node.code}
                </span>
                {isPinned && (
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-red-600 text-white">
                    AI-MÅL
                  </span>
                )}
              </div>
              <div className={`text-[13px] font-extrabold leading-tight ${t.titleColor}`}>
                {node.title}
              </div>
              <div className={`text-[11px] leading-snug mt-0.5 ${t.subColor}`}>
                {node.subtitle}
              </div>
              {node.homeTag && (
                <div
                  className={`mt-1.5 inline-block text-[10px] font-mono font-semibold px-1.5 py-0.5 border ${t.tagStyle}`}
                >
                  {node.homeTag}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
