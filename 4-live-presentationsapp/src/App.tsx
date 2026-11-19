import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Crosshair,
  ExternalLink,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';
import { SLIDES } from './slides';
import type { FlowNode } from './types';
import { FlowCanvas } from './components/FlowCanvas';

function readHashSlideIndex(): number {
  if (typeof window === 'undefined') return 0;
  const hash = window.location.hash.replace('#', '');
  const idx = SLIDES.findIndex((s) => s.id === hash);
  return idx >= 0 ? idx : 0;
}

export const App: React.FC = () => {
  const [slideIdx, setSlideIdx] = useState<number>(readHashSlideIndex);
  const [variantIdx, setVariantIdx] = useState<number>(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [pinnedNode, setPinnedNode] = useState<{
    slideId: string;
    nodeId: string;
    nodeTitle: string;
    sourceFile: string;
  } | null>(null);
  const [pointerMode, setPointerMode] = useState<boolean>(false);
  const [flowPaused, setFlowPaused] = useState<boolean>(false);

  const slideTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const variantTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const slide = SLIDES[slideIdx] ?? SLIDES[0];
  const activeVariant = slide.variants ? slide.variants[variantIdx] ?? slide.variants[0] : null;
  const activeNodes: FlowNode[] = activeVariant ? activeVariant.nodes : slide.nodes ?? [];
  const activeEdges = activeVariant ? activeVariant.edges : slide.edges ?? [];

  const effectiveSelectedId =
    activeNodes.find((n) => n.id === selectedNodeId)?.id ?? activeNodes[0]?.id ?? '';
  const selectedNode = activeNodes.find((n) => n.id === effectiveSelectedId) ?? activeNodes[0];

  // Sync URL hash and push live state to Vite dev server so Antigravity always sees the live browser state!
  useEffect(() => {
    window.history.replaceState(null, '', `#${slide.id}`);
    fetch('/__live_state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slideIndex: slideIdx + 1,
        slideId: slide.id,
        slideTitle: slide.title,
        sourceFile: slide.sourceFile,
        variantId: activeVariant?.id ?? null,
        selectedNodeId: effectiveSelectedId,
        selectedNodeTitle: selectedNode?.title ?? null,
        pinnedTarget: pinnedNode,
      }),
    }).catch(() => {
      // Static production build fallback — ignore silently
    });
  }, [
    slideIdx,
    slide.id,
    slide.title,
    slide.sourceFile,
    activeVariant?.id,
    effectiveSelectedId,
    selectedNode?.title,
    pinnedNode,
  ]);

  const goToSlide = (nextIdx: number, focusTab = false) => {
    const bounded = Math.max(0, Math.min(SLIDES.length - 1, nextIdx));
    setSlideIdx(bounded);
    setVariantIdx(0);
    setSelectedNodeId('');
    if (focusTab) {
      slideTabRefs.current[bounded]?.focus();
    }
  };

  const handleSlideTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'ArrowRight') {
      if (idx < SLIDES.length - 1) {
        e.preventDefault();
        goToSlide(idx + 1, true);
      }
    } else if (e.key === 'ArrowLeft') {
      if (idx > 0) {
        e.preventDefault();
        goToSlide(idx - 1, true);
      }
    }
  };

  const handleVariantTabKeyDown = (e: React.KeyboardEvent, idx: number, total: number) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'ArrowRight' && idx < total - 1) {
      e.preventDefault();
      const next = idx + 1;
      setVariantIdx(next);
      setSelectedNodeId('');
      variantTabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      const prev = idx - 1;
      setVariantIdx(prev);
      setSelectedNodeId('');
      variantTabRefs.current[prev]?.focus();
    }
  };

  const handleSelectNode = (node: FlowNode, pinForAi: boolean) => {
    setSelectedNodeId(node.id);
    if (pinForAi) {
      setPinnedNode({
        slideId: slide.id,
        nodeId: node.id,
        nodeTitle: node.title,
        sourceFile: slide.sourceFile,
      });
      setPointerMode(false);
    }
  };

  return (
    <div className={`min-h-dvh flex flex-col bg-[#f1f4f6] text-[#0f172a] ${flowPaused ? 'is-flow-paused' : ''}`}>
      {/* TOP OF MINDS STICKY PRESENTATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#09213a] text-white border-b border-white/15">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/tom-logo-white.png"
              alt="Top of Minds"
              className="h-7 w-auto object-contain"
            />
            <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white/10 text-purple-200 border border-white/15">
              <Sparkles className="w-3 h-3 text-[#c4b5fd]" />
              Live Flödesstudio
            </span>
          </div>

          {/* Accessible Slide Tablist with Roving Tabindex */}
          <div
            role="tablist"
            aria-label="Presentationsvyer"
            className="flex items-center gap-1 overflow-x-auto py-1"
          >
            {SLIDES.map((s, idx) => {
              const active = idx === slideIdx;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    slideTabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => goToSlide(idx)}
                  onKeyDown={(e) => handleSlideTabKeyDown(e, idx)}
                  className={`px-2.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#7c3aed] text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="font-mono opacity-80 mr-1">{s.num}</span>
                  {s.shortNav}
                </button>
              );
            })}
          </div>

          {/* Presenter Controls: Pause Flow (WCAG 2.2.2) + AI Pointer + Classic View Link */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setFlowPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-100 border border-white/15 cursor-pointer"
            >
              {flowPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{flowPaused ? 'Spela flöde' : 'Pausa flöde'}</span>
            </button>

            <button
              type="button"
              aria-pressed={pointerMode}
              onClick={() => setPointerMode((m) => !m)}
              title="Klicka på en ruta för att peka ut den direkt för Antigravity (eller håll inne Alt + klick)"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold border cursor-pointer ${
                pointerMode
                  ? 'bg-red-600 text-white border-red-400'
                  : 'bg-white/10 hover:bg-white/20 text-slate-100 border-white/15'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Peka för AI</span>
            </button>

            <a
              href="/klassisk.html"
              target="_blank"
              rel="noopener"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-white text-[#09213a] hover:bg-slate-100"
            >
              Klassisk vy
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* AI LIVE POINTER STATUS BAR (Visible when an element is pinned or pointer mode is armed) */}
      {(pointerMode || pinnedNode) && (
        <div className="bg-[#061729] text-slate-100 border-b border-white/10 px-4 lg:px-6 py-1.5 text-xs flex items-center justify-between gap-4">
          {pointerMode ? (
            <span className="font-semibold text-amber-300">
              🎯 Pekarläge aktivt: Klicka på valfri ruta i flödesschemat nedan så ser Antigravity direkt vilket kort du menar!
            </span>
          ) : (
            pinnedNode && (
              <span>
                🎯 Utpekat för AI: <strong>{pinnedNode.nodeTitle}</strong>{' '}
                <code className="text-purple-300 ml-1">({pinnedNode.sourceFile})</code> – säg bara i chatten vad du vill ändra!
              </span>
            )
          )}
          {pinnedNode && (
            <button
              type="button"
              onClick={() => setPinnedNode(null)}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              Rensa markering
            </button>
          )}
        </div>
      )}

      {/* MAIN SLIDE WORKSPACE */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-6 py-5 flex flex-col gap-4">
        {/* Slide Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#7c3aed]">
              {slide.eyebrow}
            </div>
            <h1 className="text-2xl lg:text-[28px] font-extrabold text-[#09213a] leading-tight mt-0.5">
              {slide.title}
            </h1>
            <p className="text-sm text-[#57616f] max-w-4xl mt-1">{slide.lead}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={slideIdx === 0}
              onClick={() => goToSlide(slideIdx - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-white border border-[#d7dee4] text-[#09213a] disabled:opacity-40 hover:border-[#7c3aed] cursor-pointer disabled:cursor-default"
            >
              <ChevronLeft className="w-4 h-4" />
              Föregående
            </button>
            <span className="text-xs font-mono font-bold text-[#57616f] px-1.5">
              {slideIdx + 1} / {SLIDES.length}
            </span>
            <button
              type="button"
              disabled={slideIdx === SLIDES.length - 1}
              onClick={() => goToSlide(slideIdx + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[#09213a] text-white disabled:opacity-40 hover:bg-[#7c3aed] cursor-pointer disabled:cursor-default"
            >
              Nästa
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Top Definition Banner (e.g., Slide 04: Vad är en Persona?) */}
        {slide.bannerCallout && (
          <div className="bg-white border border-[#d7dee4] border-l-4 border-l-[#7c3aed] p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-7">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7c3aed]">
                {slide.bannerCallout.badge}
              </span>
              <h2 className="text-base font-extrabold text-[#09213a] mt-0.5">
                {slide.bannerCallout.title}
              </h2>
              <p className="text-xs text-[#57616f] mt-1 leading-relaxed">
                {slide.bannerCallout.text}
              </p>
            </div>
            <div className="lg:col-span-5 bg-[#f1f4f6] border border-[#d7dee4] p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#09213a]">
                {slide.bannerCallout.contrastLabel}
              </div>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                {slide.bannerCallout.contrastText}
              </p>
            </div>
          </div>
        )}

        {/* Optional Sub-Flow Variant Switcher (e.g., Slide 04: Steg 1 -> Steg 2 -> Steg 3) */}
        {slide.variants && (
          <div className="bg-white border border-[#d7dee4] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Välj mognadssteg i flödesschemat"
              className="flex flex-wrap gap-1.5"
            >
              {slide.variants.map((v, idx) => {
                const isSelected = idx === variantIdx;
                return (
                  <button
                    key={v.id}
                    ref={(el) => {
                      variantTabRefs.current[idx] = el;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => {
                      setVariantIdx(idx);
                      setSelectedNodeId('');
                    }}
                    onKeyDown={(e) => handleVariantTabKeyDown(e, idx, slide.variants!.length)}
                    className={`px-3 py-1.5 text-xs font-extrabold border cursor-pointer ${
                      isSelected
                        ? 'bg-[#09213a] text-white border-[#09213a]'
                        : 'bg-[#f1f4f6] text-[#09213a] border-[#d7dee4] hover:border-[#7c3aed]'
                    }`}
                  >
                    {v.tabLabel}
                  </button>
                );
              })}
            </div>
            {activeVariant && (
              <div className="text-xs text-[#57616f] font-medium">{activeVariant.lead}</div>
            )}
          </div>
        )}

        {/* MAIN VISUAL SPLIT: Interactive Animated Flowchart (Left 8 cols) + Node Inspector (Right 4 cols) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
          <div className="xl:col-span-8">
            <FlowCanvas
              nodes={activeNodes}
              edges={activeEdges}
              selectedNodeId={effectiveSelectedId}
              pinnedNodeId={pinnedNode?.slideId === slide.id ? pinnedNode.nodeId : null}
              pointerMode={pointerMode}
              onSelectNode={handleSelectNode}
            />
          </div>

          {selectedNode && (
            <aside
              key={`${slide.id}-${selectedNode.id}`}
              aria-live="polite"
              className="xl:col-span-4 bg-white border border-[#d7dee4] border-t-4 border-t-[#09213a] p-5 panel-enter"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-[#7c3aed]/10 text-[#7c3aed]">
                  {selectedNode.code}
                </span>
                {selectedNode.homeTag && (
                  <span className="text-[11px] font-mono font-bold text-[#57616f]">
                    {selectedNode.homeTag}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-extrabold text-[#09213a] mt-2 leading-snug">
                {selectedNode.detailTitle}
              </h2>

              <p className="text-xs text-[#57616f] mt-2 leading-relaxed">
                {selectedNode.detailSummary}
              </p>

              <ul className="mt-3.5 space-y-2 border-t border-[#d7dee4] pt-3">
                {selectedNode.bullets.map((b, i) => (
                  <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                    <span className="font-extrabold text-[#7c3aed] shrink-0">→</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {selectedNode.snippet && (
                <div className="mt-3.5">
                  {selectedNode.snippetLabel && (
                    <div className="text-[11px] font-bold text-[#09213a] mb-1">
                      {selectedNode.snippetLabel}
                    </div>
                  )}
                  <pre className="bg-[#09213a] text-slate-100 p-3 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {selectedNode.snippet}
                  </pre>
                </div>
              )}

              {slide.id === 'anatomi' && selectedNode.id === 'graph-rag' && (
                <div className="mt-3.5 flex flex-wrap gap-2">
                  <a
                    href="/kunskapsgraf.html"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
                  >
                    Öppna 2-min Domino-intro
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </aside>
          )}
        </div>

        {/* Bottom Governance / Guardrails Strip */}
        {slide.bottomStrip && (
          <section className="bg-white border border-[#d7dee4] p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#57616f] mb-2.5">
              {slide.bottomStrip.label}
            </div>
            <div
              className={`grid grid-cols-1 gap-3 ${
                slide.bottomStrip.items.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
              }`}
            >
              {slide.bottomStrip.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 border ${
                    item.tone === 'danger'
                      ? 'bg-rose-50/50 border-[#d7dee4] border-t-2 border-t-red-600'
                      : item.tone === 'purple'
                        ? 'bg-purple-50/50 border-[#d7dee4] border-t-2 border-t-[#7c3aed]'
                        : 'bg-[#f1f4f6] border-[#d7dee4]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-extrabold uppercase text-[#7c3aed]">
                    {item.tag}
                  </span>
                  <h3 className="text-xs font-extrabold text-[#09213a] mt-0.5">{item.title}</h3>
                  <p className="text-[11px] text-[#57616f] mt-0.5 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
