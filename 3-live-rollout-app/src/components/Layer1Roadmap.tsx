import { useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { MASTER_PLAN_DELIVERABLES, ROLLOUT_WAVES } from '../data/rolloutData';
import type { StoreRollout, WaveId } from '../types/rollout';
import {
  addDaysIso,
  daysBetweenIso,
  evaluateStoreHealth,
  formatShiftSummary,
  formatShortWeek,
  formatSwedishDate,
} from '../utils/dateUtils';

interface Layer1RoadmapProps {
  stores: StoreRollout[];
  cascadeEnabled: boolean;
  hasAnyChanges: boolean;
  onToggleCascade: (enabled: boolean) => void;
  onShiftWaveWeeks: (waveId: WaveId, deltaWeeks: number) => void;
  onResetAll: () => void;
  onSelectWave: (wave: WaveId) => void;
  onShowIssues: () => void;
}

const TIMELINE_START = '2027-04-01';
const TIMELINE_END = '2027-11-30';
const TOTAL_DAYS = daysBetweenIso(TIMELINE_START, TIMELINE_END) + 1; // 244 dagar

const MONTH_COLUMNS = [
  { label: 'April', start: '2027-04-01', end: '2027-04-30' },
  { label: 'Maj', start: '2027-05-01', end: '2027-05-31' },
  { label: 'Juni', start: '2027-06-01', end: '2027-06-30' },
  { label: 'Juli', start: '2027-07-01', end: '2027-07-31' },
  { label: 'Augusti', start: '2027-08-01', end: '2027-08-31' },
  { label: 'September', start: '2027-09-01', end: '2027-09-30' },
  { label: 'Oktober', start: '2027-10-01', end: '2027-10-31' },
  { label: 'November', start: '2027-11-01', end: '2027-11-30' },
];

const ACTIVE_WAVE_IDS: WaveId[] = ['Pilot', 'Våg 1', 'Våg 2', 'Våg 3'];

const WAVE_STYLES: Record<
  WaveId,
  {
    solidBg: string;
    softBg: string;
    softBorder: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  Pilot: {
    solidBg: 'bg-indigo-600',
    softBg: 'bg-indigo-100/90',
    softBorder: 'border-indigo-300',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
  },
  'Våg 1': {
    solidBg: 'bg-sky-600',
    softBg: 'bg-sky-100/90',
    softBorder: 'border-sky-300',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
  },
  'Våg 2': {
    solidBg: 'bg-teal-600',
    softBg: 'bg-teal-100/90',
    softBorder: 'border-teal-300',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
  },
  'Våg 3': {
    solidBg: 'bg-violet-600',
    softBg: 'bg-violet-100/90',
    softBorder: 'border-violet-300',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
  },
  'Våg 4': {
    solidBg: 'bg-orange-500',
    softBg: 'bg-orange-100/90',
    softBorder: 'border-orange-300',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
  },
};

function clampPct(pct: number): number {
  return Math.max(0, Math.min(100, pct));
}

function dateSpanToPct(startIso: string, endIso: string): { leftPct: number; widthPct: number } {
  const startOffset = daysBetweenIso(TIMELINE_START, startIso);
  const endOffset = daysBetweenIso(TIMELINE_START, endIso) + 1;
  const leftPct = clampPct((startOffset / TOTAL_DAYS) * 100);
  const rightPct = clampPct((endOffset / TOTAL_DAYS) * 100);
  return {
    leftPct,
    widthPct: Math.max(1.2, rightPct - leftPct),
  };
}

export function Layer1Roadmap({
  stores,
  cascadeEnabled,
  hasAnyChanges,
  onToggleCascade,
  onShiftWaveWeeks,
  onResetAll,
  onSelectWave,
  onShowIssues,
}: Layer1RoadmapProps) {
  const waveSummaries = useMemo(() => {
    return ACTIVE_WAVE_IDS.map((waveId) => {
      const meta = ROLLOUT_WAVES.find((w) => w.id === waveId)!;
      const waveStores = stores.filter((s) => s.wave === waveId);
      const sortedDates = waveStores.map((s) => s.goLiveDate).sort();
      const firstGoLive = sortedDates[0] ?? '2027-06-08';
      const lastGoLive = sortedDates[sortedDates.length - 1] ?? firstGoLive;

      // Full vågperiod inkl. 1 veckas förberedelse före och 1 veckas uppföljning efter
      const fullStart = addDaysIso(firstGoLive, -7);
      const fullEnd = addDaysIso(lastGoLive, 7);

      const sampleStore = waveStores[0];
      const deltaDays = sampleStore
        ? daysBetweenIso(sampleStore.baselineGoLiveDate, sampleStore.goLiveDate)
        : 0;

      const issueCount = waveStores.filter((s) => evaluateStoreHealth(s).needsAttention).length;

      return {
        id: waveId,
        title: waveId === 'Pilot' ? 'Pilot' : waveId,
        description:
          waveId === 'Pilot'
            ? 'Test i mindre skala i Sverige, Norge och Finland'
            : waveId === 'Våg 1'
              ? 'Första breda utrullningen (70 butiker)'
              : waveId === 'Våg 2'
                ? 'Andra utrullningsvågen'
                : 'Slutvåg före höst- och julhandeln',
        storeCount: waveStores.length,
        plannedScale: meta.plannedStoreScale,
        firstGoLive,
        lastGoLive,
        fullStart,
        fullEnd,
        deltaDays,
        issueCount,
      };
    });
  }, [stores]);

  const overallStats = useMemo(() => {
    const allDates = stores.map((s) => s.goLiveDate).sort();
    const firstDate = allDates[0] ?? '2027-06-08';
    const lastDate = allDates[allDates.length - 1] ?? '2027-09-30';
    const issueCount = stores.filter((s) => evaluateStoreHealth(s).needsAttention).length;
    const okCount = stores.length - issueCount;
    const entersFreeze = lastDate >= '2027-11-08';
    return { firstDate, lastDate, issueCount, okCount, entersFreeze };
  }, [stores]);

  const prepBar = dateSpanToPct('2027-04-05', '2027-05-30');
  const freezeZone = dateSpanToPct('2027-11-08', '2027-11-30');

  return (
    <div className="space-y-6">
      {/* Huvudkort: Styrgruppens tidplan */}
      <section
        aria-labelledby="roadmap-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-7"
      >
        {/* Rubrik + Reglage för kaskad/återställning */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="max-w-2xl">
            <h2 id="roadmap-heading" className="text-lg font-bold text-slate-900 sm:text-xl">
              Övergripande tidplan – Pilot &amp; butiksutrullning
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Överblick för styrgrupp och ledning. Testa att flytta en fas med{' '}
              <strong className="font-semibold text-slate-800">-1v / +1v</strong> för att se hur
              resten av planen uppdateras, eller klicka på en våg för att se dess butiker.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 select-none hover:bg-slate-100">
              <input
                type="checkbox"
                checked={cascadeEnabled}
                onChange={(e) => onToggleCascade(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Flytta efterföljande vågor automatiskt
            </label>

            {hasAnyChanges ? (
              <button
                type="button"
                onClick={onResetAll}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Återställ ursprungsplan
              </button>
            ) : null}
          </div>
        </div>

        {/* 3 lugna nyckeltal */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3">
            <div className="text-xs font-medium text-slate-500">Omfattning</div>
            <div className="mt-0.5 text-base font-bold text-slate-900">
              {stores.length} inlästa butiker i 4 faser
            </div>
            <div className="mt-0.5 text-xs text-slate-500">Sverige, Norge och Finland</div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Planerat Go-Live-fönster</span>
              {hasAnyChanges ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                  Justerad plan
                </span>
              ) : null}
            </div>
            <div className="mt-0.5 text-base font-bold text-slate-900">
              {formatSwedishDate(overallStats.firstDate)} – {formatSwedishDate(overallStats.lastDate)}
            </div>
            <div className="mt-0.5 text-xs text-slate-500">
              {formatShortWeek(overallStats.firstDate)} till {formatShortWeek(overallStats.lastDate)}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3">
            <div>
              <div className="text-xs font-medium text-slate-500">Förberedelsestatus</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-base font-bold text-slate-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                {overallStats.okCount} av {stores.length} i fas
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {overallStats.issueCount === 0
                  ? 'Inga flaggade hinder just nu'
                  : `${overallStats.issueCount} butiker behöver ses över`}
              </div>
            </div>
            {overallStats.issueCount > 0 ? (
              <button
                type="button"
                onClick={onShowIssues}
                className="shrink-0 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20 ring-inset hover:bg-rose-100"
              >
                Visa {overallStats.issueCount} st →
              </button>
            ) : null}
          </div>
        </div>

        {/* Varning om en flytt skjuter in utrullningen i julhandelsfrysen */}
        {overallStats.entersFreeze ? (
          <div
            role="status"
            className="mt-4 flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <span>
              <strong>Observera:</strong> Med nuvarande förskjutning hamnar sista utrullningsdagarna
              efter <strong>8 nov</strong> då butikernas kampanj- och julfrys startar.
            </span>
          </div>
        ) : null}

        {/* Visuell Månadstidslinje (Gantt) */}
        <div className="mt-6 overflow-x-auto">
          <div className="min-w-[780px]">
            {/* Månadsrubriker */}
            <div className="grid grid-cols-[270px_1fr] items-end gap-4 border-b border-slate-200 pb-2.5">
              <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Fas &amp; tidsstyrning
              </div>
              <div className="relative h-6">
                {MONTH_COLUMNS.map((m) => {
                  const pos = dateSpanToPct(m.start, m.end);
                  return (
                    <div
                      key={m.label}
                      style={{ left: `${pos.leftPct}%`, width: `${pos.widthPct}%` }}
                      className="absolute top-0 bottom-0 border-l border-slate-200 pl-2 text-xs font-semibold text-slate-600 first:border-l-0"
                    >
                      {m.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rader i tidslinjen */}
            <div className="divide-y divide-slate-100">
              {/* Rad 0: Förberedelsefas */}
              <div className="grid grid-cols-[270px_1fr] items-center gap-4 py-4">
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Förberedelse &amp; utbildningsmaterial
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    Processer, tester &amp; utbildning · apr–maj
                  </div>
                </div>

                <div className="relative h-11 rounded-xl bg-slate-50/80">
                  {MONTH_COLUMNS.map((m) => {
                    const pos = dateSpanToPct(m.start, m.end);
                    return (
                      <div
                        key={m.label}
                        style={{ left: `${pos.leftPct}%` }}
                        className="pointer-events-none absolute top-0 bottom-0 border-l border-slate-200/70 first:border-l-0"
                      />
                    );
                  })}

                  <div
                    style={{ left: `${freezeZone.leftPct}%`, width: `${freezeZone.widthPct}%` }}
                    className="pointer-events-none absolute top-0 bottom-0 rounded-r-xl bg-rose-50/70"
                  />

                  <div
                    style={{ left: `${prepBar.leftPct}%`, width: `${prepBar.widthPct}%` }}
                    className="absolute top-2 bottom-2 flex items-center rounded-lg bg-slate-500 px-3 text-xs font-semibold text-white shadow-2xs"
                  >
                    <span className="truncate">v.14–v.22 · Grundarbete</span>
                  </div>
                </div>
              </div>

              {/* Rader 1–4: Pilot + Våg 1–3 */}
              {waveSummaries.map((wave) => {
                const style = WAVE_STYLES[wave.id];
                const outerSpan = dateSpanToPct(wave.fullStart, wave.fullEnd);
                const coreSpan = dateSpanToPct(wave.firstGoLive, wave.lastGoLive);
                const shiftText = formatShiftSummary(wave.deltaDays);
                const showLabelInside = coreSpan.widthPct >= 16;

                return (
                  <div
                    key={wave.id}
                    className="grid grid-cols-[270px_1fr] items-center gap-4 py-4"
                  >
                    {/* Vänsterspalt: Namn, datum & -1v / +1v */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectWave(wave.id)}
                          className="text-left text-sm font-bold text-slate-900 hover:text-indigo-600"
                        >
                          {wave.title}
                        </button>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${style.badgeBg} ${style.badgeText}`}
                        >
                          {wave.storeCount} butiker
                        </span>
                        {shiftText ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                            {shiftText}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-0.5 text-xs text-slate-500">{wave.description}</div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => onShiftWaveWeeks(wave.id, -1)}
                            aria-label={`Flytta ${wave.title} 1 vecka bakåt`}
                            className="inline-flex items-center gap-0.5 rounded-l-lg px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                            -1v
                          </button>
                          <span className="border-x border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600">
                            {formatSwedishDate(wave.firstGoLive)} – {formatSwedishDate(wave.lastGoLive)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onShiftWaveWeeks(wave.id, 1)}
                            aria-label={`Flytta ${wave.title} 1 vecka framåt`}
                            className="inline-flex items-center gap-0.5 rounded-r-lg px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            +1v
                            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Högerspalt: Klickbar tidslinjebalk */}
                    <div className="relative h-12 rounded-xl bg-slate-50/80">
                      {MONTH_COLUMNS.map((m) => {
                        const pos = dateSpanToPct(m.start, m.end);
                        return (
                          <div
                            key={m.label}
                            style={{ left: `${pos.leftPct}%` }}
                            className="pointer-events-none absolute top-0 bottom-0 border-l border-slate-200/70 first:border-l-0"
                          />
                        );
                      })}

                      {/* Julfrys-zon i november */}
                      <div
                        style={{ left: `${freezeZone.leftPct}%`, width: `${freezeZone.widthPct}%` }}
                        className="pointer-events-none absolute top-0 bottom-0 flex items-center justify-center rounded-r-xl border-l border-dashed border-rose-300 bg-rose-50/70"
                      >
                        {wave.id === 'Pilot' ? (
                          <span className="px-1 text-[10px] font-semibold text-rose-700">
                            Julfrys 8 nov
                          </span>
                        ) : null}
                      </div>

                      {/* Yttre ram: 1v förberedelse + Go-Live + 1v uppföljning */}
                      <div
                        style={{ left: `${outerSpan.leftPct}%`, width: `${outerSpan.widthPct}%` }}
                        className={`pointer-events-none absolute top-2.5 bottom-2.5 rounded-lg border ${style.softBg} ${style.softBorder}`}
                      />

                      {/* Inre skarp Go-Live-balk (klickbar för att zooma in till vågens butiker) */}
                      <button
                        type="button"
                        onClick={() => onSelectWave(wave.id)}
                        style={{
                          left: `${coreSpan.leftPct}%`,
                          width: `${Math.max(2.2, coreSpan.widthPct)}%`,
                        }}
                        aria-label={`Öppna ${wave.title} (${wave.storeCount} butiker)`}
                        className={`group absolute top-2 bottom-2 flex cursor-pointer items-center justify-between rounded-lg px-2.5 text-xs font-semibold text-white shadow-xs transition hover:brightness-110 ${style.solidBg}`}
                      >
                        {showLabelInside ? (
                          <>
                            <span className="truncate">
                              {formatShortWeek(wave.firstGoLive)}–{formatShortWeek(wave.lastGoLive)} · Öppna våg
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-85 transition group-hover:translate-x-0.5" aria-hidden="true" />
                          </>
                        ) : null}
                      </button>

                      {/* Utvändig etikett för korta 1-veckasvågor så ingen text någonsin kläms ihop */}
                      {!showLabelInside ? (
                        <button
                          type="button"
                          onClick={() => onSelectWave(wave.id)}
                          style={{
                            left: `${Math.min(78, outerSpan.leftPct + outerSpan.widthPct + 0.8)}%`,
                          }}
                          className="absolute top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center gap-1 text-xs font-semibold whitespace-nowrap text-slate-700 hover:text-indigo-600"
                        >
                          <span>{formatShortWeek(wave.firstGoLive)}</span>
                          <span className="text-slate-400">·</span>
                          <span className="underline decoration-slate-300 underline-offset-2">
                            Visa butiker
                          </span>
                          <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Diskret teckenförklaring längst ned i kortet */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-sky-600" />
                  Go-Live-vecka (själva driftsättningen)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-5 rounded-xs border border-sky-300 bg-sky-100" />
                  1 vecka förberedelse före &amp; 1 vecka uppföljning efter
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs border border-dashed border-rose-300 bg-rose-50" />
                  Kampanj- &amp; julfrys (från 8 nov)
                </span>
              </div>
              <span>Klicka på valfri våg för att zooma in på butikerna →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sekundärt innehåll ihopfällt som standard (enligt content-first-noise-reduction) */}
      <details className="group rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">
          <span>
            Visa förberedande milstolpar från Master Plan ({MASTER_PLAN_DELIVERABLES.length} leverabler inför pilot &amp; utrullning)
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="border-t border-slate-100 px-6 py-4">
          <p className="mb-3 text-xs text-slate-500">
            Övergripande förberedelser som ska vara i mål innan respektive fas startar.
          </p>
          <div className="divide-y divide-slate-100">
            {MASTER_PLAN_DELIVERABLES.map((item) => {
              const statusBadge =
                item.rag === 'Green'
                  ? 'bg-emerald-50 text-emerald-700'
                  : item.rag === 'Amber'
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-slate-100 text-slate-600';
              const statusLabel =
                item.rag === 'Green' ? 'I fas' : item.rag === 'Amber' ? 'Pågår' : 'Planerad';

              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-900">{item.deliverable}</div>
                    <div className="mt-0.5 text-slate-500">
                      Ansvar: {item.owner} · Nästa steg: {item.nextStep}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="font-medium text-slate-600">{item.target.replace('2027-', '')}</span>
                    <span className={`rounded-full px-2.5 py-0.5 font-semibold ${statusBadge}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </details>
    </div>
  );
}
