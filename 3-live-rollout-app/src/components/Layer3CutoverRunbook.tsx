import { useMemo, useState } from 'react';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Layers,
  ShieldAlert,
  Square,
  UserCheck,
} from 'lucide-react';
import { FORGOTTEN_TRACKS } from '../data/rolloutData';
import type {
  ComputedCutoverStep,
  CutoverPhase,
  ResponsibleParty,
  StoreRollout,
  WaveId,
} from '../types/rollout';
import { formatShortWeek, formatSwedishDate } from '../utils/dateUtils';
import { CountryBadge, FormatBadge } from './StatusBadge';

interface Layer3CutoverRunbookProps {
  stores: StoreRollout[];
  selectedStoreId: string;
  onSelectStoreId: (storeId: string) => void;
  steps: ComputedCutoverStep[];
  buildStepsForStore: (store: StoreRollout) => ComputedCutoverStep[];
  onToggleStepComplete: (storeId: string, stepId: string) => void;
}

const PHASES: CutoverPhase[] = [
  '1. Innan Go-Live (Pre-care)',
  '2. Cut-over (Go-Live)',
  '3. Hypercare',
  '4. Exit (Överlämning till linjen)',
];

export function Layer3CutoverRunbook({
  stores,
  selectedStoreId,
  onSelectStoreId,
  steps,
  buildStepsForStore,
  onToggleStepComplete,
}: Layer3CutoverRunbookProps) {
  const [viewMode, setViewMode] = useState<'STORE_DETAIL' | 'WAVE_OVERVIEW'>('STORE_DETAIL');
  const [partyFilter, setPartyFilter] = useState<ResponsibleParty | 'ALL'>('ALL');
  const [phaseFilter, setPhaseFilter] = useState<CutoverPhase | 'ALL'>('ALL');
  const [overviewWave, setOverviewWave] = useState<WaveId>('Våg 1');

  const sortedStores = useMemo(
    () => [...stores].sort((a, b) => a.goLiveDate.localeCompare(b.goLiveDate) || a.id.localeCompare(b.id)),
    [stores]
  );

  const currentIndex = sortedStores.findIndex((s) => s.id === selectedStoreId);
  const currentStore = sortedStores[currentIndex] ?? sortedStores[0];

  const visibleSteps = useMemo(() => {
    return steps
      .filter((s) => (partyFilter === 'ALL' ? true : s.responsibleParty === partyFilter))
      .filter((s) => (phaseFilter === 'ALL' ? true : s.phase === phaseFilter));
  }, [steps, partyFilter, phaseFilter]);

  const groupedByPhase = useMemo(() => {
    return PHASES.map((phase) => ({
      phase,
      items: visibleSteps.filter((s) => s.phase === phase),
    })).filter((g) => g.items.length > 0);
  }, [visibleSteps]);

  const completedCount = steps.filter((s) => s.completed).length;

  const waveStoresForMatrix = useMemo(
    () => stores.filter((s) => s.wave === overviewWave),
    [stores, overviewWave]
  );

  return (
    <div className="space-y-5">
      {/* Store / Wave Selector & Mode Switcher */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Lager 3 · Ersätter Mastodont-Excelen (&quot;List of all activities&quot; – 23 steg i 4 faser)
            </div>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Aktivitetsuppföljning per Butik &amp; Våg (Pre-care → Cut-over → Hypercare → Exit)
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode('STORE_DETAIL')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'STORE_DETAIL'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Per Butik (23 steg)
            </button>
            <button
              type="button"
              onClick={() => {
                setOverviewWave(currentStore.wave);
                setViewMode('WAVE_OVERVIEW');
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === 'WAVE_OVERVIEW'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Hel Våg-matris (t.ex. 70 butiker)
            </button>
          </div>
        </div>

        {viewMode === 'STORE_DETAIL' ? (
          <>
            {/* Store Picker */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={currentIndex <= 0}
                  onClick={() => {
                    if (currentIndex > 0) onSelectStoreId(sortedStores[currentIndex - 1].id);
                  }}
                  aria-label="Föregående butik"
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <select
                  aria-label="Välj butik för 23-stegschecklista"
                  value={currentStore.id}
                  onChange={(e) => onSelectStoreId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                >
                  {sortedStores.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} · {s.name} [{s.country.split(' ')[0]}] ({s.wave} – {formatSwedishDate(s.goLiveDate)})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={currentIndex >= sortedStores.length - 1}
                  onClick={() => {
                    if (currentIndex < sortedStores.length - 1) onSelectStoreId(sortedStores[currentIndex + 1].id);
                  }}
                  aria-label="Nästa butik"
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <UserCheck className="h-4 w-4 text-slate-400" />
                <select
                  aria-label="Filtrera på ansvarig part"
                  value={partyFilter}
                  onChange={(e) => setPartyFilter(e.target.value as ResponsibleParty | 'ALL')}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700"
                >
                  <option value="ALL">Alla parter (Kund + Leverantör)</option>
                  <option value="Kund (Store Ops)">Kund (Store Ops)</option>
                  <option value="Systemleverantör (RetailCore/EG)">Systemleverantör (RetailCore/EG)</option>
                  <option value="Gemensam (Kund + Leverantör)">Gemensam (Kund + Leverantör)</option>
                </select>

                <select
                  aria-label="Filtrera på fas"
                  value={phaseFilter}
                  onChange={(e) => setPhaseFilter(e.target.value as CutoverPhase | 'ALL')}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700"
                >
                  <option value="ALL">Alla 4 faser (23 steg)</option>
                  {PHASES.map((ph) => (
                    <option key={ph} value={ph}>
                      {ph}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Store Summary Banner */}
            <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Vald Butik &amp; Land</span>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 font-bold text-slate-900">
                  <CountryBadge country={currentStore.country} />
                  <span>{currentStore.name}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                  <FormatBadge format={currentStore.format} />
                  <span>· {currentStore.registers} kassor</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Cut-over Datum (T-0)</span>
                <div className="mt-0.5 font-bold text-indigo-700">
                  {formatSwedishDate(currentStore.goLiveDate, true)} ({formatShortWeek(currentStore.goLiveDate)})
                </div>
                <div className="text-xs text-slate-600">
                  {currentStore.wave} · T-14d Pre-care till T+8d Exit
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Team &amp; Butikschef</span>
                <div className="mt-0.5 font-semibold text-slate-900">{currentStore.fieldTeam}</div>
                <div className="text-xs text-slate-600">BC: {currentStore.storeManager}</div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Readiness (23 steg)</span>
                <div className="mt-0.5 font-bold text-emerald-700">
                  {completedCount} av {steps.length} klara ({Math.round((completedCount / steps.length) * 100)} %)
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    style={{ width: `${Math.round((completedCount / steps.length) * 100)}%` }}
                    className="h-full bg-emerald-600 transition-all"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* WAVE OVERVIEW HEADER (70-butikers överblick!) */
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['Pilot', 'Våg 1', 'Våg 2', 'Våg 3'] as WaveId[]).map((wId) => {
                const cnt = stores.filter((s) => s.wave === wId).length;
                return (
                  <button
                    key={wId}
                    type="button"
                    onClick={() => setOverviewWave(wId)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      overviewWave === wId
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {wId} ({cnt} butiker)
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-600">
              Överblick över samtliga <strong>{waveStoresForMatrix.length} butiker i {overviewWave}</strong> över de 4 faserna ({waveStoresForMatrix.length * 23} checkpunkter totalt!)
            </p>
          </div>
        )}
      </section>

      {viewMode === 'STORE_DETAIL' ? (
        /* 4-Phase Activity Runbook for Selected Store */
        <div className="space-y-4">
          {groupedByPhase.map((group) => {
            const isCutover = group.phase.startsWith('2.');
            const doneInPhase = group.items.filter((i) => i.completed).length;

            return (
              <section
                key={group.phase}
                className={`rollout-card-region rounded-2xl border p-5 shadow-2xs ${
                  isCutover ? 'border-indigo-300 bg-indigo-50/25' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                        isCutover ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'
                      }`}
                    >
                      {group.phase}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {doneInPhase} / {group.items.length} klarmarkerade
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Klicka på en rad för att kvittera/avmarkera aktivitet
                  </span>
                </div>

                <div className="space-y-2.5">
                  {group.items.map((step) => (
                    <div
                      key={step.id}
                      onClick={() => onToggleStepComplete(currentStore.id, step.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onToggleStepComplete(currentStore.id, step.id);
                        }
                      }}
                      className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-3.5 transition ${
                        step.completed
                          ? 'border-emerald-200 bg-emerald-50/40 text-slate-600'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="mt-0.5 text-indigo-600">
                        {step.completed ? (
                          <CheckSquare className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Square className="h-5 w-5 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-[122px] rounded-lg bg-slate-100 px-2.5 py-1.5 text-center">
                        <div className="text-[11px] font-bold text-indigo-700">
                          {formatSwedishDate(step.calendarDate)} ({step.relativeLabel.split(' ')[0]})
                        </div>
                        <div className="font-mono text-xs font-semibold text-slate-700">
                          {step.startTime}–{step.endTime}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-slate-400">{step.id}</span>
                          <span
                            className={`text-sm font-semibold ${
                              step.completed ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {step.activity}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              step.responsibleParty === 'Kund (Store Ops)'
                                ? 'bg-sky-100 text-sky-800'
                                : step.responsibleParty === 'Systemleverantör (RetailCore/EG)'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {step.responsibleParty}
                          </span>
                          {step.mandatoryGate ? (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-600/20 ring-inset">
                              <ShieldAlert className="h-3 w-3" /> Gate
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span>
                            Roll: <strong>{step.ownerRole}</strong>
                          </span>
                          <span>
                            Beroende: <strong>{step.systemDependency}</strong>
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{step.ruleNote}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* WAVE-LEVEL 4-PHASE MATRIX (70 stores in one wave!) */
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-semibold tracking-wide text-slate-600 uppercase">
                <tr>
                  <th className="px-3 py-2.5">Butik</th>
                  <th className="px-3 py-2.5">Cut-over</th>
                  <th className="px-3 py-2.5">1. Pre-care (8)</th>
                  <th className="px-3 py-2.5">2. Cut-over (6)</th>
                  <th className="px-3 py-2.5">3. Hypercare (5)</th>
                  <th className="px-3 py-2.5">4. Exit till linjen (4)</th>
                  <th className="px-3 py-2.5 text-right">Detalj</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {waveStoresForMatrix.map((st) => {
                  const stSteps = buildStepsForStore(st);
                  const p1 = stSteps.filter((x) => x.phase.startsWith('1.') && x.completed).length;
                  const p2 = stSteps.filter((x) => x.phase.startsWith('2.') && x.completed).length;
                  const p3 = stSteps.filter((x) => x.phase.startsWith('3.') && x.completed).length;
                  const p4 = stSteps.filter((x) => x.phase.startsWith('4.') && x.completed).length;
                  const hasIssue =
                    st.hardwareStatus === 'Avvikelse' ||
                    st.sdwanStatus === 'Avvikelse' ||
                    st.trainingStatus === 'Avvikelse';

                  return (
                    <tr
                      key={st.id}
                      className={hasIssue ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50'}
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-700">{st.id}</span>
                          <CountryBadge country={st.country} />
                          <span className="font-semibold text-slate-900">{st.name}</span>
                        </div>
                        {st.note ? (
                          <div className="mt-0.5 text-[11px] font-medium text-rose-700">{st.note}</div>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap font-medium text-slate-800">
                        {formatSwedishDate(st.goLiveDate, true)}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-slate-700">{p1} / 8</td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-slate-700">{p2} / 6</td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-slate-700">{p3} / 5</td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-slate-700">{p4} / 4</td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectStoreId(st.id);
                            setViewMode('STORE_DETAIL');
                          }}
                          className="rounded-lg bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700 hover:bg-indigo-100"
                        >
                          Öppna
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Separata spår som ofta glöms bort (Från Connies "Utkast - utrullningsplan.xlsx" rad 105–135) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900">
          Separata tvärgående spår (från &quot;Utkast - utrullningsplan.xlsx&quot; – sådant som ofta glöms bort)
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          {FORGOTTEN_TRACKS.map((track) => (
            <div key={track.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
              <div className="text-xs font-bold text-slate-900">{track.title}</div>
              <div className="text-[11px] text-slate-500">{track.subtitle}</div>
              <ul className="mt-2 space-y-1 text-xs text-slate-700">
                {track.items.map((it) => (
                  <li key={it} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
