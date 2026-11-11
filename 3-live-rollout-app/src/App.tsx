import { useCallback, useMemo, useState } from 'react';
import { ClipboardCheck, Layers, MessageSquarePlus, Sparkles, Table2 } from 'lucide-react';
import { CUTOVER_TEMPLATE_STEPS, INITIAL_STORES } from './data/rolloutData';
import type { ComputedCutoverStep, StoreRollout, WaveId } from './types/rollout';
import { addDaysIso, formatRelativeDayOffset } from './utils/dateUtils';
import { Layer1Roadmap } from './components/Layer1Roadmap';
import { Layer2StoreMatrix } from './components/Layer2StoreMatrix';
import { Layer3CutoverRunbook } from './components/Layer3CutoverRunbook';
import { CutoverQuickDialog } from './components/CutoverQuickDialog';
import {
  FeedbackDialog,
  loadSavedComments,
  saveCommentsToStorage,
  type ReviewComment,
} from './components/FeedbackDialog';

type ZoomLayer = 1 | 2 | 3;

export function App() {
  const [stores] = useState<StoreRollout[]>(INITIAL_STORES);
  const [activeLayer, setActiveLayer] = useState<ZoomLayer>(1);
  const [selectedWave, setSelectedWave] = useState<WaveId | 'ALL'>('ALL');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('PIL-001');
  const [quickDialogStoreId, setQuickDialogStoreId] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);
  const [reviewComments, setReviewComments] = useState<ReviewComment[]>(() => loadSavedComments());

  // Förifyll klarmarkerade steg för tidiga pilotbutiker samt Pre-care-start i Våg 1
  const [completedStepKeys, setCompletedStepKeys] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const s of INITIAL_STORES) {
      if (s.wave === 'Pilot' && s.trainingStatus === 'Klar') {
        for (const step of CUTOVER_TEMPLATE_STEPS) {
          if (s.goLiveDate <= '2027-07-20' || step.phase.startsWith('1.')) {
            initial.add(`${s.id}::${step.id}`);
          }
        }
      } else if (s.wave === 'Våg 1' && s.preCareStatus !== 'Avvikelse') {
        for (const step of CUTOVER_TEMPLATE_STEPS) {
          if (step.id === 'ACT-01' || step.id === 'ACT-02' || step.id === 'ACT-03' || step.id === 'ACT-04') {
            initial.add(`${s.id}::${step.id}`);
          }
        }
      }
    }
    return initial;
  });

  const buildStepsForStore = useCallback(
    (store: StoreRollout): ComputedCutoverStep[] => {
      return CUTOVER_TEMPLATE_STEPS.map((tpl) => ({
        ...tpl,
        calendarDate: addDaysIso(store.goLiveDate, tpl.dayOffset),
        relativeLabel: formatRelativeDayOffset(tpl.dayOffset),
        completed: completedStepKeys.has(`${store.id}::${tpl.id}`),
      }));
    },
    [completedStepKeys]
  );

  const selectedStore = useMemo(
    () => stores.find((s) => s.id === selectedStoreId) ?? stores[0],
    [stores, selectedStoreId]
  );

  const quickDialogStore = useMemo(
    () => (quickDialogStoreId ? stores.find((s) => s.id === quickDialogStoreId) ?? null : null),
    [stores, quickDialogStoreId]
  );

  const handleToggleStepComplete = useCallback((storeId: string, stepId: string) => {
    const key = `${storeId}::${stepId}`;
    setCompletedStepKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleCloseQuickDialog = useCallback(() => {
    setQuickDialogStoreId(null);
  }, []);

  const handleAddComment = useCallback((comment: ReviewComment) => {
    setReviewComments((prev) => {
      const next = [...prev, comment];
      saveCommentsToStorage(next);
      return next;
    });
  }, []);

  const handleDeleteComment = useCallback((id: string) => {
    setReviewComments((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCommentsToStorage(next);
      return next;
    });
  }, []);

  const currentContextLabel = useMemo(() => {
    if (activeLayer === 1) return 'Lager 1 · Master Plan & Hypotes A/B';
    if (activeLayer === 2) {
      return `Lager 2 · Våg- & Butiksplan (${selectedWave === 'ALL' ? 'Alla vågor' : selectedWave})`;
    }
    return `Lager 3 · 23 Aktiviteter (${selectedStore.id} ${selectedStore.name})`;
  }, [activeLayer, selectedWave, selectedStore]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-xs">
              SO
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                  Store Operations &amp; Rollout Studio
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-600/20 ring-inset">
                  <Sparkles className="h-3 w-3" />
                  v0.1 Baslinje (Från Excel &amp; PPT)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Nordic Home &amp; Retail (SE / NO / FI) · Master Plan → Vågplan (70 butiker/våg) → 23 Aktiviteter i 4 faser
              </p>
            </div>
          </div>

          {/* 3-Layer Switcher + Feedback Button */}
          <div className="flex flex-wrap items-center gap-2">
            <nav
              aria-label="Zoom-lager för utrullningsplanering"
              className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1"
            >
              <button
                type="button"
                onClick={() => setActiveLayer(1)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeLayer === 1
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                1. Master Plan &amp; Hypotes A/B (PPT)
              </button>

              <button
                type="button"
                onClick={() => setActiveLayer(2)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeLayer === 2
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table2 className="h-3.5 w-3.5" />
                2. Vågor &amp; 70-butikersplan (Veckor)
              </button>

              <button
                type="button"
                onClick={() => setActiveLayer(3)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeLayer === 3
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardCheck className="h-3.5 w-3.5" />
                3. 23 Aktiviteter &amp; Exit (4 faser)
              </button>
            </nav>

            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              Kommentera
              {reviewComments.length > 0 ? (
                <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold">
                  {reviewComments.length}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
        {activeLayer === 1 ? (
          <Layer1Roadmap
            stores={stores}
            onSelectWave={(wave) => {
              setSelectedWave(wave);
              setActiveLayer(2);
            }}
          />
        ) : null}

        {activeLayer === 2 ? (
          <Layer2StoreMatrix
            stores={stores}
            selectedWave={selectedWave}
            onChangeWave={setSelectedWave}
            onQuickInspect={(storeId) => setQuickDialogStoreId(storeId)}
            onOpenLayer3={(storeId) => {
              setSelectedStoreId(storeId);
              setActiveLayer(3);
            }}
          />
        ) : null}

        {activeLayer === 3 ? (
          <Layer3CutoverRunbook
            stores={stores}
            selectedStoreId={selectedStore.id}
            onSelectStoreId={setSelectedStoreId}
            steps={buildStepsForStore(selectedStore)}
            buildStepsForStore={buildStepsForStore}
            onToggleStepComplete={handleToggleStepComplete}
          />
        ) : null}
      </main>

      <CutoverQuickDialog
        store={quickDialogStore}
        steps={quickDialogStore ? buildStepsForStore(quickDialogStore) : []}
        onClose={handleCloseQuickDialog}
        onOpenFullRunbook={(storeId) => {
          setSelectedStoreId(storeId);
          setActiveLayer(3);
        }}
      />

      <FeedbackDialog
        open={feedbackOpen}
        currentContextLabel={currentContextLabel}
        comments={reviewComments}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}

export default App;
