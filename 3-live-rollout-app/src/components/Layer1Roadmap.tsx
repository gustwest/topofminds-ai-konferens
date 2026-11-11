import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarRange,
  FileSpreadsheet,
  GitCompareArrows,
  Layers,
  ShieldAlert,
  Store,
} from 'lucide-react';
import {
  ACTIVITY_PLAN_ITEMS,
  MASTER_PLAN_DELIVERABLES,
  RAID_LOG_ITEMS,
  ROLLOUT_HYPOTHESES,
  ROLLOUT_WAVES,
} from '../data/rolloutData';
import type { HypothesisId, StoreRollout, WaveId } from '../types/rollout';
import {
  daysBetweenIso,
  formatShortWeek,
  formatSwedishDate,
  isRestrictedRolloutWeekday,
} from '../utils/dateUtils';
import { CountryBadge, FormatBadge, RagBadge } from './StatusBadge';

interface Layer1RoadmapProps {
  stores: StoreRollout[];
  onSelectWave: (wave: WaveId) => void;
}

const MIN_WEEK = 4;
const MAX_WEEK = 42;
const WEEK_SPAN = MAX_WEEK - MIN_WEEK + 1;

const HYPOTHESIS_MONTH_BANDS = [
  { label: 'Jan–Feb', weeks: 5 },
  { label: 'Mars', weeks: 4 },
  { label: 'April', weeks: 5 },
  { label: 'Maj', weeks: 4 },
  { label: 'Jun (Pilot)', weeks: 4 },
  { label: 'Juli', weeks: 5 },
  { label: 'Aug', weeks: 4 },
  { label: 'Sep (Rollout)', weeks: 5 },
  { label: 'Okt', weeks: 3 },
];

const OPERATIONAL_START = '2027-06-01';
const OPERATIONAL_END = '2027-10-31';
const OPERATIONAL_DAYS = daysBetweenIso(OPERATIONAL_START, OPERATIONAL_END);

function getWeekBarStyle(startWeek: number, endWeek: number): { left: string; width: string } {
  const clampedStart = Math.max(MIN_WEEK, startWeek);
  const clampedEnd = Math.min(MAX_WEEK, Math.max(clampedStart, endWeek));
  const leftPct = ((clampedStart - MIN_WEEK) / WEEK_SPAN) * 100;
  const widthPct = ((clampedEnd - clampedStart + 1) / WEEK_SPAN) * 100;
  return {
    left: `${leftPct.toFixed(2)}%`,
    width: `${Math.max(2.6, widthPct).toFixed(2)}%`,
  };
}

function getDateBarStyle(startIso: string, endIso: string): { left: string; width: string } {
  const offset = Math.max(0, daysBetweenIso(OPERATIONAL_START, startIso));
  const span = Math.max(6, daysBetweenIso(startIso, endIso) + 5);
  const leftPct = Math.min(93, (offset / OPERATIONAL_DAYS) * 100);
  const widthPct = Math.min(100 - leftPct, (span / OPERATIONAL_DAYS) * 100);
  return {
    left: `${leftPct.toFixed(2)}%`,
    width: `${widthPct.toFixed(2)}%`,
  };
}

export function Layer1Roadmap({ stores, onSelectWave }: Layer1RoadmapProps) {
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<HypothesisId>('HYP_B');
  const [excelTab, setExcelTab] = useState<'MASTER' | 'ACTIVITY' | 'RAID'>('MASTER');

  const activeHypothesis =
    ROLLOUT_HYPOTHESES.find((h) => h.id === selectedHypothesisId) ?? ROLLOUT_HYPOTHESES[1];

  const wave1Count = stores.filter((s) => s.wave === 'Våg 1').length;
  const exceptionCount = stores.filter(
    (s) =>
      s.sdwanStatus === 'Avvikelse' ||
      s.hardwareStatus === 'Avvikelse' ||
      s.trainingStatus === 'Avvikelse' ||
      s.preCareStatus === 'Avvikelse' ||
      isRestrictedRolloutWeekday(s.goLiveDate).restricted
  ).length;
  const escalatedRaidCount = RAID_LOG_ITEMS.filter((r) => r.escalateToSteerCo).length;

  return (
    <div className="space-y-6">
      {/* Executive KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Vald Styrgruppshypotes
            </span>
            <GitCompareArrows className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {activeHypothesis.totalPilotStores + activeHypothesis.totalRolloutStores} butiker
          </div>
          <p className="mt-1 text-xs text-slate-600">
            {activeHypothesis.totalPilotStores} Pilot + {activeHypothesis.totalRolloutStores} i{' '}
            {activeHypothesis.waveCount} vågor (SE / NO / FI)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Vågmodell (Omlott)
            </span>
            <CalendarRange className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">1v + 1v + 1v</div>
          <p className="mt-1 text-xs text-slate-600">
            Pre-care → Cut-over → Hypercare (<strong>0 veckors luft!</strong>)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Operativ Våg 1 i Appen
            </span>
            <Store className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{wave1Count} butiker</div>
          <p className="mt-1 text-xs text-slate-600">
            Full 70-butikersvåg inläst ({exceptionCount} flaggade avvikelser totalt)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Master Plan & RAID
            </span>
            <ShieldAlert className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {MASTER_PLAN_DELIVERABLES.length} SO-leverabler
          </div>
          <p className="mt-1 text-xs text-slate-600">
            {escalatedRaidCount} RAID-punkter eskalerade till Styrgrupp
          </p>
        </div>
      </div>

      {/* DEL 1: HYPOTES A vs HYPOTES B – Ersätter PowerPoint-pusslandet ("Tidplan - hypotes och alternativ.pptx") */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              <Layers className="h-3.5 w-3.5" />
              Lager 1A · Ersätter PowerPoint-slides (Hypotes A vs. Hypotes B för Styrgrupp)
            </div>
            <h2 className="mt-1.5 text-lg font-bold text-slate-900">
              {activeHypothesis.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">{activeHypothesis.subtitle}</p>
          </div>

          <div
            role="group"
            aria-label="Välj tidplanshypotes"
            className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1"
          >
            {ROLLOUT_HYPOTHESES.map((hyp) => {
              const active = hyp.id === selectedHypothesisId;
              return (
                <button
                  key={hyp.id}
                  type="button"
                  onClick={() => setSelectedHypothesisId(hyp.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  {hyp.id === 'HYP_A'
                    ? 'Hypotes A (6 vågor à 60)'
                    : 'Hypotes B (37 Pilot + 3 vågor à 70–80)'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend for 3-week wave model */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-slate-700">3-veckors vågmodell:</span>
            <span className="inline-flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-xs bg-sky-400" /> 1v Pre-care
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-xs bg-indigo-600" /> 1v Cut-over (Go-Live)
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-xs bg-violet-500" /> 1v Hyper-care
            </span>
            {activeHypothesis.hasCatchUpWeek ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800">
                <span className="h-3 w-3 rounded-xs bg-amber-400" /> Catch-up v.{activeHypothesis.catchUpWeekNumber}
              </span>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            Ingen luft mellan vågorna – 3 vågor rullar omlott!
          </span>
        </div>

        {/* Visual Timeline v.04 - v.42 */}
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[820px]">
            {/* Month Header */}
            <div className="grid grid-cols-12 items-center gap-3 px-2">
              <div className="col-span-4 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Utbildningsspår & Utrullningsvågor (v.04–v.42)
              </div>
              <div className="col-span-8 flex h-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-[11px] font-semibold text-slate-600">
                {HYPOTHESIS_MONTH_BANDS.map((band) => (
                  <div
                    key={band.label}
                    style={{ width: `${((band.weeks / WEEK_SPAN) * 100).toFixed(2)}%` }}
                    className="flex items-center justify-center border-r border-slate-200 px-1 truncate last:border-r-0"
                  >
                    {band.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Parallel Training Tracks (from Connie's PPT top & bottom bars) */}
            <div className="mt-2.5 space-y-1.5 border-b border-slate-100 pb-3">
              {activeHypothesis.trainingTracks.map((tr) => {
                const pos = getWeekBarStyle(tr.startWeek, tr.endWeek);
                const barTone =
                  tr.category === 'Material'
                    ? 'bg-slate-500'
                    : tr.category === 'Super-User'
                      ? 'bg-teal-600'
                      : tr.category === 'Store Personnel'
                        ? 'bg-emerald-600'
                        : 'bg-amber-600';
                return (
                  <div key={tr.id} className="grid grid-cols-12 items-center gap-3 px-2">
                    <div className="col-span-4 flex items-center gap-1.5 truncate text-xs font-medium text-slate-700">
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-teal-600" />
                      <span className="truncate">{tr.label}</span>
                    </div>
                    <div className="relative col-span-8 h-6 rounded-md bg-slate-50">
                      <div
                        style={{ left: pos.left, width: pos.width }}
                        className={`absolute top-1 bottom-1 flex items-center justify-center rounded px-2 text-[10px] font-semibold whitespace-nowrap text-white ${barTone}`}
                      >
                        v.{tr.startWeek}–v.{tr.endWeek}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overlapping 3-Week Wave Staircase */}
            <div className="mt-3 space-y-2">
              {activeHypothesis.waves.map((w) => {
                const prePos = getWeekBarStyle(w.preCareStartWeek, Math.max(w.preCareStartWeek, w.cutOverWeek - 1));
                const cutPos = getWeekBarStyle(w.cutOverWeek, w.cutOverWeek);
                const hypPos = getWeekBarStyle(
                  Math.min(w.hyperCareEndWeek, w.cutOverWeek + 1),
                  w.hyperCareEndWeek
                );
                const catchUpPos =
                  activeHypothesis.hasCatchUpWeek && activeHypothesis.catchUpWeekNumber
                    ? getWeekBarStyle(activeHypothesis.catchUpWeekNumber, activeHypothesis.catchUpWeekNumber)
                    : null;

                return (
                  <div
                    key={w.id}
                    className="grid grid-cols-12 items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-2"
                  >
                    <div className="col-span-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">{w.label}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                          {w.storeCount} st
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{w.storeSummary}</div>
                    </div>

                    <div className="relative col-span-8 h-8 rounded-lg bg-slate-100/90">
                      {catchUpPos ? (
                        <div
                          style={{ left: catchUpPos.left, width: catchUpPos.width }}
                          title="Catch-up period v.34"
                          className="absolute top-0 bottom-0 border-x border-amber-400 bg-amber-200/50"
                        />
                      ) : null}
                      {/* Pre-care segment */}
                      <div
                        style={{ left: prePos.left, width: prePos.width }}
                        className="absolute top-1.5 bottom-1.5 flex items-center justify-center rounded-l-md bg-sky-400 text-[10px] font-bold text-slate-950"
                        title={`Pre-care v.${w.preCareStartWeek}`}
                      >
                        Pre
                      </div>
                      {/* Cut-over segment */}
                      <div
                        style={{ left: cutPos.left, width: cutPos.width }}
                        className="absolute top-1 bottom-1 z-10 flex items-center justify-center rounded-xs bg-indigo-600 text-[10px] font-bold text-white shadow-2xs"
                        title={`Cut-over v.${w.cutOverWeek}`}
                      >
                        v.{w.cutOverWeek}
                      </div>
                      {/* Hyper-care segment */}
                      <div
                        style={{ left: hypPos.left, width: hypPos.width }}
                        className="absolute top-1.5 bottom-1.5 flex items-center justify-center rounded-r-md bg-violet-500 text-[10px] font-bold text-white"
                        title={`Hyper-care t.o.m. v.${w.hyperCareEndWeek}`}
                      >
                        Hyp
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key Takeaways Box (Directly from Connie's PPT) */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="text-xs font-bold tracking-wide text-amber-900 uppercase">
            Key Takeaways inför Styrgruppsbeslut ({activeHypothesis.badge})
          </div>
          <ul className="mt-1.5 grid grid-cols-1 gap-2 text-xs text-amber-950 md:grid-cols-3">
            {activeHypothesis.keyTakeaways.map((pt) => (
              <li key={pt} className="flex items-start gap-1.5">
                <span className="mt-0.5 font-bold text-amber-700">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DEL 2: OPERATIVA VÅGOR I APPEN (Klicka för djupdyk till Lager 2) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Operativa Utrullningsvågor i Datakärnan (Klicka på en våg för att öppna Lager 2)
            </h3>
            <p className="text-xs text-slate-500">
              Visar inlästa butiker över SE (Land A), NO (Land B) och FI (Land C) uppdelat på Easy, Large och Feeder stores
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {ROLLOUT_WAVES.map((wave) => {
            const waveStores = stores
              .filter((s) => s.wave === wave.id)
              .sort((a, b) => a.goLiveDate.localeCompare(b.goLiveDate));

            if (waveStores.length === 0) return null;

            const firstDate = waveStores[0].goLiveDate;
            const lastDate = waveStores[waveStores.length - 1].goLiveDate;
            const barPos = getDateBarStyle(firstDate, lastDate);
            const isNarrow = parseFloat(barPos.width) < 24;
            const countries = Array.from(new Set(waveStores.map((s) => s.country)));
            const formats = Array.from(new Set(waveStores.map((s) => s.format)));

            return (
              <div
                key={wave.id}
                onClick={() => onSelectWave(wave.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectWave(wave.id);
                  }
                }}
                className="rollout-card-region group cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-indigo-300 hover:shadow-sm"
              >
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${wave.badgeClass}`}
                      >
                        {wave.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {waveStores.length} inlästa butiker (Målskala: {wave.plannedStoreScale || waveStores.length} st)
                      </span>
                      <div className="flex items-center gap-1">
                        {countries.map((c) => (
                          <CountryBadge key={c} country={c} />
                        ))}
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                      {wave.title}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {formats.map((fmt) => (
                        <FormatBadge key={fmt} format={fmt} />
                      ))}
                    </div>
                  </div>

                  <div className="relative h-11 rounded-lg bg-slate-100/80 p-1.5 lg:col-span-7">
                    <div
                      style={{ left: barPos.left, width: barPos.width }}
                      className={`absolute top-1.5 bottom-1.5 flex items-center justify-between rounded-md px-2.5 text-xs font-semibold text-white shadow-xs ${wave.barClass}`}
                    >
                      {!isNarrow ? (
                        <span className="truncate whitespace-nowrap">
                          {formatSwedishDate(firstDate)} → {formatSwedishDate(lastDate)} ({formatShortWeek(firstDate)}–{formatShortWeek(lastDate)})
                        </span>
                      ) : null}
                    </div>
                    {isNarrow ? (
                      <div
                        style={
                          parseFloat(barPos.left) > 55
                            ? { right: `calc(100% - ${barPos.left} + 8px)` }
                            : { left: `calc(${barPos.left} + ${barPos.width} + 8px)` }
                        }
                        className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs font-semibold whitespace-nowrap text-slate-700"
                      >
                        {formatSwedishDate(firstDate)} → {formatSwedishDate(lastDate)} ({formatShortWeek(firstDate)})
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DEL 3: EXCEL-BRYGGAN ("Store Operations - Master Plan.xlsx": Master Plan -> Activity Plan -> RAID) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Lager 1B · Direktvy från Excel (&quot;Store Operations - Master Plan.xlsx&quot;)
            </div>
            <h3 className="mt-1 text-base font-bold text-slate-900">
              Planeringskedjan: 1. Master Plan (Skogen) → 2. Activity Plan (Grenarna) → 3. RAID Log
            </h3>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setExcelTab('MASTER')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                excelTab === 'MASTER' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Master Plan ({MASTER_PLAN_DELIVERABLES.length})
            </button>
            <button
              type="button"
              onClick={() => setExcelTab('ACTIVITY')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                excelTab === 'ACTIVITY' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Activity Plan ({ACTIVITY_PLAN_ITEMS.length})
            </button>
            <button
              type="button"
              onClick={() => setExcelTab('RAID')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                excelTab === 'RAID' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              RAID Log ({RAID_LOG_ITEMS.length})
            </button>
          </div>
        </div>

        {excelTab === 'MASTER' ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-semibold tracking-wide text-slate-600 uppercase">
                <tr>
                  <th className="px-3 py-2.5">ID</th>
                  <th className="px-3 py-2.5">Fas & Workstream</th>
                  <th className="px-3 py-2.5">Huvudleverabel (Deliverable)</th>
                  <th className="px-3 py-2.5">Mål / Target</th>
                  <th className="px-3 py-2.5">RAG</th>
                  <th className="px-3 py-2.5">Nästa steg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {MASTER_PLAN_DELIVERABLES.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{item.phase}</span>
                      <div className="text-slate-500">{item.workstream}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="font-semibold text-slate-900">{item.deliverable}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{item.doneWhen}</div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{item.target}</div>
                      <div className="text-[11px] text-slate-500">{item.dateConfidence}</div>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <RagBadge rag={item.rag} />
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">{item.nextStep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {excelTab === 'ACTIVITY' ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-semibold tracking-wide text-slate-600 uppercase">
                <tr>
                  <th className="px-3 py-2.5">Master Plan ID</th>
                  <th className="px-3 py-2.5">Workstream</th>
                  <th className="px-3 py-2.5">Aktivitet (Grenarna)</th>
                  <th className="px-3 py-2.5">Done When</th>
                  <th className="px-3 py-2.5">Target</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {ACTIVITY_PLAN_ITEMS.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-mono font-bold text-indigo-700">{act.masterPlanId}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-700">{act.workstream}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-900">{act.activity}</td>
                    <td className="px-3 py-2.5 text-slate-600">{act.doneWhen}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-slate-800">{act.target}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-700">{act.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {excelTab === 'RAID' ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {RAID_LOG_ITEMS.map((raid) => (
              <div
                key={raid.id}
                className={`rounded-xl border p-4 ${
                  raid.escalateToSteerCo
                    ? 'border-rose-200 bg-rose-50/40'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {raid.id} · {raid.type} (Kopplad till {raid.relatedMasterPlanId})
                  </span>
                  {raid.escalateToSteerCo ? (
                    <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      Eskalera till Styrgrupp
                    </span>
                  ) : null}
                </div>
                <div className="mt-1.5 text-sm font-bold text-slate-900">{raid.title}</div>
                <p className="mt-1 text-xs text-slate-600">{raid.impact}</p>
                <div className="mt-2 text-xs font-medium text-indigo-800">
                  Åtgärd: {raid.nextAction}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
