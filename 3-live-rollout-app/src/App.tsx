import { useCallback, useMemo, useState } from 'react';
import {
  CalendarRange,
  ClipboardCheck,
  FileSpreadsheet,
  MessageSquarePlus,
  Store,
} from 'lucide-react';
import { CUTOVER_TEMPLATE_STEPS, INITIAL_STORES } from './data/rolloutData';
import type { ComputedCutoverStep, StoreRollout, WaveId } from './types/rollout';
import { addDaysIso, formatRelativeDayOffset } from './utils/dateUtils';
import { Layer1Roadmap } from './components/Layer1Roadmap';
import { Layer2StoreMatrix } from './components/Layer2StoreMatrix';
import { Layer3CutoverRunbook } from './components/Layer3CutoverRunbook';
import { ExcelDialog } from './components/ExcelDialog';
import {
  FeedbackDialog,
  loadSavedComments,
  saveCommentsToStorage,
  type ReviewComment,
} from './components/FeedbackDialog';

type ZoomLayer = 1 | 2 | 3;

const DATE_OVERRIDES_STORAGE_KEY = 'rollout_studio_date_overrides_v2';
const WAVE_ORDER: WaveId[] = ['Pilot', 'Våg 1', 'Våg 2', 'Våg 3', 'Våg 4'];

function loadDateOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(DATE_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveDateOverrides(overrides: Record<string, string>): void {
  try {
    if (Object.keys(overrides).length === 0) {
      localStorage.removeItem(DATE_OVERRIDES_STORAGE_KEY);
    } else {
      localStorage.setItem(DATE_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
    }
  } catch {
    // Ignore private browsing storage errors
  }
}

export function App() {
  const [dateOverrides, setDateOverrides] = useState<Record<string, string>>(() =>
    loadDateOverrides()
  );
  const [cascadeEnabled, setCascadeEnabled] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<ZoomLayer>(1);
  const [selectedWave, setSelectedWave] = useState<WaveId | 'ALL'>('ALL');
  const [onlyIssuesInitial, setOnlyIssuesInitial] = useState<boolean>(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('W1-014');
  const [excelOpen, setExcelOpen] = useState<boolean>(false);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);
  const [reviewComments, setReviewComments] = useState<ReviewComment[]>(() => loadSavedComments());

  const stores: StoreRollout[] = useMemo(() => {
    return INITIAL_STORES.map((s) => {
      const override = dateOverrides[s.id];
      return override ? { ...s, goLiveDate: override } : s;
    });
  }, [dateOverrides]);

  const hasAnyChanges = useMemo(
    () => stores.some((s) => s.goLiveDate !== s.baselineGoLiveDate),
    [stores]
  );

  // Förifyll klarmarkerade steg för tidiga pilotbutiker samt start av Våg 1
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
          if (
            step.id === 'ACT-01' ||
            step.id === 'ACT-02' ||
            step.id === 'ACT-03' ||
            step.id === 'ACT-04'
          ) {
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

  const getCompletedCountForStore = useCallback(
    (storeId: string): number => {
      let count = 0;
      for (const tpl of CUTOVER_TEMPLATE_STEPS) {
        if (completedStepKeys.has(`${storeId}::${tpl.id}`)) count++;
      }
      return count;
    },
    [completedStepKeys]
  );

  const selectedStore = useMemo(
    () => stores.find((s) => s.id === selectedStoreId) ?? stores[0],
    [stores, selectedStoreId]
  );

  const handleShiftWaveWeeks = useCallback(
    (waveId: WaveId, deltaWeeks: number) => {
      const deltaDays = deltaWeeks * 7;
      const startIndex = WAVE_ORDER.indexOf(waveId);
      const affectedWaves = new Set<WaveId>(
        cascadeEnabled && startIndex >= 0 ? WAVE_ORDER.slice(startIndex) : [waveId]
      );

      setDateOverrides((prev) => {
        const next = { ...prev };
        for (const s of INITIAL_STORES) {
          if (!affectedWaves.has(s.wave)) continue;
          const current = prev[s.id] ?? s.goLiveDate;
          const shifted = addDaysIso(current, deltaDays);
          if (shifted === s.baselineGoLiveDate) {
            delete next[s.id];
          } else {
            next[s.id] = shifted;
          }
        }
        saveDateOverrides(next);
        return next;
      });
    },
    [cascadeEnabled]
  );

  const handleShiftStoreDays = useCallback((storeId: string, deltaDays: number) => {
    const baseStore = INITIAL_STORES.find((s) => s.id === storeId);
    if (!baseStore) return;
    setDateOverrides((prev) => {
      const next = { ...prev };
      const current = prev[storeId] ?? baseStore.goLiveDate;
      const shifted = addDaysIso(current, deltaDays);
      if (shifted === baseStore.baselineGoLiveDate) {
        delete next[storeId];
      } else {
        next[storeId] = shifted;
      }
      saveDateOverrides(next);
      return next;
    });
  }, []);

  const handleSetStoreDate = useCallback((storeId: string, newIsoDate: string) => {
    const baseStore = INITIAL_STORES.find((s) => s.id === storeId);
    if (!baseStore) return;
    setDateOverrides((prev) => {
      const next = { ...prev };
      if (newIsoDate === baseStore.baselineGoLiveDate) {
        delete next[storeId];
      } else {
        next[storeId] = newIsoDate;
      }
      saveDateOverrides(next);
      return next;
    });
  }, []);

  const handleImportDates = useCallback((updates: Record<string, string>): number => {
    const entries = Object.entries(updates);
    if (entries.length === 0) return 0;
    setDateOverrides((prev) => {
      const next = { ...prev };
      for (const [id, isoDate] of entries) {
        const base = INITIAL_STORES.find((s) => s.id === id);
        if (!base) continue;
        if (isoDate === base.baselineGoLiveDate) {
          delete next[id];
        } else {
          next[id] = isoDate;
        }
      }
      saveDateOverrides(next);
      return next;
    });
    return entries.length;
  }, []);

  const handleResetAll = useCallback(() => {
    setDateOverrides({});
    saveDateOverrides({});
  }, []);

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
    if (activeLayer === 1) return 'Steg 1 · Tidplan (Månader)';
    if (activeLayer === 2) {
      return `Steg 2 · Butiker per våg (${selectedWave === 'ALL' ? 'Alla vågor' : selectedWave})`;
    }
    return `Steg 3 · Checklista (${selectedStore.name})`;
  }, [activeLayer, selectedWave, selectedStore]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Kompakt enradig sidhuvudmeny (<12 % av skärmhöjden enligt content-first-noise-reduction) */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:flex-nowrap">
          <div className="flex shrink-0 items-center gap-2.5">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white"
            >
              UP
            </div>
            <h1 className="text-sm font-bold whitespace-nowrap text-slate-900 sm:text-base">
              Utrullningsplan
            </h1>
          </div>

          {/* Tydlig 3-stegszoom: Månader -> Veckor -> Dagar & tid */}
          <nav
            aria-label="Detaljeringsnivå i utrullningsplanen"
            className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1"
          >
            <button
              type="button"
              aria-current={activeLayer === 1 ? 'step' : undefined}
              onClick={() => setActiveLayer(1)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                activeLayer === 1
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarRange className="h-3.5 w-3.5" aria-hidden="true" />
              1. Tidplan (Månader)
            </button>

            <button
              type="button"
              aria-current={activeLayer === 2 ? 'step' : undefined}
              onClick={() => {
                setOnlyIssuesInitial(false);
                setActiveLayer(2);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                activeLayer === 2
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="h-3.5 w-3.5" aria-hidden="true" />
              2. Butiker per våg (Veckor)
            </button>

            <button
              type="button"
              aria-current={activeLayer === 3 ? 'step' : undefined}
              onClick={() => setActiveLayer(3)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                activeLayer === 3
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
              3. Checklista (Dagar &amp; tid)
            </button>
          </nav>

          {/* Excel-koppling + Kommentera */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setExcelOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              Excel
            </button>

            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-indigo-700"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" />
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

      {/* Huvudinnehåll */}
      <main className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
        {activeLayer === 1 ? (
          <Layer1Roadmap
            stores={stores}
            cascadeEnabled={cascadeEnabled}
            hasAnyChanges={hasAnyChanges}
            onToggleCascade={setCascadeEnabled}
            onShiftWaveWeeks={handleShiftWaveWeeks}
            onResetAll={handleResetAll}
            onSelectWave={(wave) => {
              setSelectedWave(wave);
              setOnlyIssuesInitial(false);
              setActiveLayer(2);
            }}
            onShowIssues={() => {
              setSelectedWave('ALL');
              setOnlyIssuesInitial(true);
              setActiveLayer(2);
            }}
          />
        ) : null}

        {activeLayer === 2 ? (
          <Layer2StoreMatrix
            stores={stores}
            selectedWave={selectedWave}
            onlyIssuesInitial={onlyIssuesInitial}
            getCompletedCountForStore={getCompletedCountForStore}
            onChangeWave={setSelectedWave}
            onShiftStoreDays={handleShiftStoreDays}
            onBackToLayer1={() => setActiveLayer(1)}
            onOpenLayer3={(storeId) => {
              setSelectedStoreId(storeId);
              setActiveLayer(3);
            }}
          />
        ) : null}

        {activeLayer === 3 ? (
          <Layer3CutoverRunbook
            stores={stores}
            selectedStore={selectedStore}
            steps={buildStepsForStore(selectedStore)}
            onSelectStoreId={setSelectedStoreId}
            onShiftStoreDays={handleShiftStoreDays}
            onSetStoreDate={handleSetStoreDate}
            onToggleStepComplete={handleToggleStepComplete}
            onBackToLayer2={() => setActiveLayer(2)}
          />
        ) : null}
      </main>

      <ExcelDialog
        open={excelOpen}
        stores={stores}
        onImportDates={handleImportDates}
        onClose={() => setExcelOpen(false)}
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
