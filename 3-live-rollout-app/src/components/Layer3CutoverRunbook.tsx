import { useMemo } from 'react';
import { ArrowLeft, Calendar, Check, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { ComputedCutoverStep, CutoverPhase, StoreRollout } from '../types/rollout';
import {
  daysBetweenIso,
  formatCountryPlain,
  formatShiftSummary,
  formatShortWeek,
  formatSwedishDate,
} from '../utils/dateUtils';

interface Layer3CutoverRunbookProps {
  stores: StoreRollout[];
  selectedStore: StoreRollout;
  steps: ComputedCutoverStep[];
  onSelectStoreId: (storeId: string) => void;
  onShiftStoreDays: (storeId: string, deltaDays: number) => void;
  onSetStoreDate: (storeId: string, newIsoDate: string) => void;
  onToggleStepComplete: (storeId: string, stepId: string) => void;
  onBackToLayer2: () => void;
}

const PHASE_META: Array<{
  phase: CutoverPhase;
  plainTitle: string;
  subtitle: string;
  highlight?: boolean;
}> = [
  {
    phase: '1. Innan Go-Live (Pre-care)',
    plainTitle: '1. Förberedelser inför Go-Live',
    subtitle: '2 veckor före till dagen före driftsättning',
  },
  {
    phase: '2. Cut-over (Go-Live)',
    plainTitle: '2. Go-Live-morgonen (Timme för timme)',
    subtitle: 'Själva skiftet i butiken innan och vid öppning',
    highlight: true,
  },
  {
    phase: '3. Hypercare',
    plainTitle: '3. Tät uppföljning dagarna efter',
    subtitle: 'Extra stöd till butikspersonalen första veckan',
  },
  {
    phase: '4. Exit (Överlämning till linjen)',
    plainTitle: '4. Avslut & överlämning till ordinarie drift',
    subtitle: 'Formellt godkännande en vecka efter Go-Live',
  },
];

export function Layer3CutoverRunbook({
  stores,
  selectedStore,
  steps,
  onSelectStoreId,
  onShiftStoreDays,
  onSetStoreDate,
  onToggleStepComplete,
  onBackToLayer2,
}: Layer3CutoverRunbookProps) {
  const completedCount = useMemo(() => steps.filter((s) => s.completed).length, [steps]);
  const progressPct = Math.round((completedCount / Math.max(1, steps.length)) * 100);
  const country = formatCountryPlain(selectedStore.country);
  const deltaDays = daysBetweenIso(selectedStore.baselineGoLiveDate, selectedStore.goLiveDate);
  const shiftText = formatShiftSummary(deltaDays);

  return (
    <div className="space-y-5">
      {/* Tillbaka-knapp + Snabbval av butik */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToLayer2}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Tillbaka till butiker per våg (Veckor)
        </button>

        <div className="flex items-center gap-2">
          <label htmlFor="store-picker" className="text-xs font-semibold text-slate-600">
            Byt butik:
          </label>
          <select
            id="store-picker"
            value={selectedStore.id}
            onChange={(e) => onSelectStoreId(e.target.value)}
            className="max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-2xs focus:border-indigo-500 focus:outline-none"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.wave} · {formatSwedishDate(s.goLiveDate)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Översiktskort för vald butik + Go-Live-datumstyrning */}
      <section
        aria-labelledby="store-runbook-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                {selectedStore.wave}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                {country.label}
              </span>
            </div>
            <h2
              id="store-runbook-heading"
              className="mt-1.5 text-xl font-bold text-slate-900 sm:text-2xl"
            >
              {selectedStore.name}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {selectedStore.city} · {selectedStore.registers} kassor · Butikschef:{' '}
              {selectedStore.storeManager}
            </p>
          </div>

          {/* Go-Live-datumväljare som räknar om hela körschemat live */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
              <span>Go-Live-datum (styr alla datum nedan)</span>
              {shiftText ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                  {shiftText}
                </span>
              ) : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => onShiftStoreDays(selectedStore.id, -1)}
                  aria-label="Flytta butikens Go-Live 1 dag bakåt"
                  className="inline-flex items-center gap-0.5 rounded-l-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  -1d
                </button>
                <span className="border-x border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-900">
                  {formatSwedishDate(selectedStore.goLiveDate, true)} ({formatShortWeek(selectedStore.goLiveDate)})
                </span>
                <button
                  type="button"
                  onClick={() => onShiftStoreDays(selectedStore.id, 1)}
                  aria-label="Flytta butikens Go-Live 1 dag framåt"
                  className="inline-flex items-center gap-0.5 rounded-r-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  +1d
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <label htmlFor="exact-golive-date" className="sr-only">
                Välj exakt Go-Live-datum
              </label>
              <input
                id="exact-golive-date"
                type="date"
                value={selectedStore.goLiveDate}
                onChange={(e) => {
                  if (e.target.value) onSetStoreDate(selectedStore.id, e.target.value);
                }}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Enkel förloppsmätare */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Genomförda aktiviteter: {completedCount} av {steps.length} ({progressPct} %)
            </span>
            <span className="text-slate-500">Klicka på en aktivitet för att bocka av</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              style={{ width: `${progressPct}%` }}
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* De 4 faserna i rena, lättlästa kort */}
      {PHASE_META.map((meta) => {
        const phaseSteps = steps.filter((s) => s.phase === meta.phase);
        const phaseDone = phaseSteps.filter((s) => s.completed).length;

        return (
          <section
            key={meta.phase}
            className={`rounded-2xl border bg-white shadow-xs ${
              meta.highlight ? 'border-indigo-300 ring-1 ring-indigo-500/10' : 'border-slate-200'
            }`}
          >
            <div
              className={`flex flex-wrap items-center justify-between gap-2 rounded-t-2xl border-b px-5 py-3.5 ${
                meta.highlight
                  ? 'border-indigo-100 bg-indigo-50/70'
                  : 'border-slate-100 bg-slate-50/70'
              }`}
            >
              <div>
                <h3
                  className={`text-sm font-bold ${
                    meta.highlight ? 'text-indigo-950' : 'text-slate-900'
                  }`}
                >
                  {meta.plainTitle}
                </h3>
                <p className="text-xs text-slate-500">{meta.subtitle}</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 ring-inset">
                {phaseDone} / {phaseSteps.length} klara
              </span>
            </div>

            <ul className="divide-y divide-slate-100">
              {phaseSteps.map((step) => {
                return (
                  <li key={step.id}>
                    <label
                      className={`flex cursor-pointer flex-col gap-3 px-5 py-3.5 transition sm:flex-row sm:items-start sm:gap-5 ${
                        step.completed ? 'bg-slate-50/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Kryssruta + Uträknat datum & klockslag */}
                      <div className="flex shrink-0 items-start gap-3 sm:w-52">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                            step.completed
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={step.completed}
                            onChange={() => onToggleStepComplete(selectedStore.id, step.id)}
                            className="sr-only"
                          />
                          {step.completed ? (
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : null}
                        </span>

                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {formatSwedishDate(step.calendarDate, true)}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            <Clock className="h-3 w-3 text-slate-400" aria-hidden="true" />
                            <span>
                              {step.startTime}–{step.endTime}
                            </span>
                            <span>·</span>
                            <span
                              className={
                                step.dayOffset === 0 ? 'font-semibold text-indigo-700' : ''
                              }
                            >
                              {step.relativeLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Själva aktiviteten + vem som ansvarar */}
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-sm font-semibold ${
                            step.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                          }`}
                        >
                          {step.activity}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">{step.ruleNote}</p>
                        <div className="mt-1 text-[11px] font-medium text-slate-400">
                          Ansvar: {step.ownerRole}
                        </div>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
