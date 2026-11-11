import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Eye,
  Filter,
  Search,
  Table2,
} from 'lucide-react';
import { ROLLOUT_WAVES } from '../data/rolloutData';
import type { CountryCode, StoreFormat, StoreRollout, WaveId } from '../types/rollout';
import {
  addDaysIso,
  formatShortWeek,
  formatSwedishDate,
  getIsoWeekAndYear,
  isRestrictedRolloutWeekday,
} from '../utils/dateUtils';
import { CountryBadge, FormatBadge, PrepStatusBadge } from './StatusBadge';

interface Layer2StoreMatrixProps {
  stores: StoreRollout[];
  selectedWave: WaveId | 'ALL';
  onChangeWave: (wave: WaveId | 'ALL') => void;
  onQuickInspect: (storeId: string) => void;
  onOpenLayer3: (storeId: string) => void;
}

function hasStoreException(s: StoreRollout): boolean {
  return (
    s.sdwanStatus === 'Avvikelse' ||
    s.hardwareStatus === 'Avvikelse' ||
    s.trainingStatus === 'Avvikelse' ||
    s.preCareStatus === 'Avvikelse' ||
    isRestrictedRolloutWeekday(s.goLiveDate).restricted
  );
}

export function Layer2StoreMatrix({
  stores,
  selectedWave,
  onChangeWave,
  onQuickInspect,
  onOpenLayer3,
}: Layer2StoreMatrixProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<StoreFormat | 'ALL'>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | 'ALL'>('ALL');
  const [selectedWeek, setSelectedWeek] = useState<string>('ALL');
  const [onlyExceptions, setOnlyExceptions] = useState<boolean>(false);

  const weeklyCounts = useMemo(() => {
    const map = new Map<string, { count: number; exceptions: number }>();
    for (const s of stores) {
      const { label } = getIsoWeekAndYear(s.goLiveDate);
      const prev = map.get(label) ?? { count: 0, exceptions: 0 };
      map.set(label, {
        count: prev.count + 1,
        exceptions: prev.exceptions + (hasStoreException(s) ? 1 : 0),
      });
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [stores]);

  const totalExceptionCount = useMemo(
    () => stores.filter((s) => (selectedWave === 'ALL' ? true : s.wave === selectedWave)).filter(hasStoreException).length,
    [stores, selectedWave]
  );

  const filteredStores = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return stores
      .filter((s) => (selectedWave === 'ALL' ? true : s.wave === selectedWave))
      .filter((s) => (selectedCountry === 'ALL' ? true : s.country === selectedCountry))
      .filter((s) => (selectedFormat === 'ALL' ? true : s.format === selectedFormat))
      .filter((s) => (selectedWeek === 'ALL' ? true : getIsoWeekAndYear(s.goLiveDate).label === selectedWeek))
      .filter((s) => (onlyExceptions ? hasStoreException(s) : true))
      .filter((s) =>
        !q
          ? true
          : s.id.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q) ||
            s.country.toLowerCase().includes(q)
      )
      .sort((a, b) => a.goLiveDate.localeCompare(b.goLiveDate) || a.id.localeCompare(b.id));
  }, [stores, selectedWave, selectedCountry, selectedFormat, selectedWeek, onlyExceptions, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Governance Rules Banner (Från Connies "Overall Rollout Plan") */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
              <Table2 className="h-3.5 w-3.5" />
              Lager 2 · Ersätter 480-kolumners Excel (&quot;Overall Rollout Plan&quot; – Veckor, Vågor &amp; 70 butiker/våg)
            </div>
            <h2 className="mt-1 text-base font-bold text-slate-900">
              Planerade Cut-over-veckor &amp; Vågbelastning (Klicka på en vecka för att filtrera)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 font-semibold text-amber-900 ring-1 ring-amber-600/20 ring-inset">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
              Regel: Ingen utrullning på Måndagar eller Fredagar!
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 ring-1 ring-emerald-600/20 ring-inset">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
              Pilotbutiker utbildar sin region (Train-the-Trainer)
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {weeklyCounts.map(([weekLabel, info]) => {
            const active = selectedWeek === weekLabel;
            const shortLabel = weekLabel.replace('2027-', '');
            return (
              <button
                key={weekLabel}
                type="button"
                onClick={() => setSelectedWeek(active ? 'ALL' : weekLabel)}
                className={`flex min-w-[76px] flex-col items-center rounded-xl border px-2.5 py-2 transition ${
                  active
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                    : info.exceptions > 0
                      ? 'border-rose-200 bg-rose-50/50 text-slate-900 hover:border-rose-400'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-indigo-300 hover:bg-white'
                }`}
              >
                <span className={`text-[11px] font-semibold ${active ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {shortLabel}
                </span>
                <span className="mt-0.5 text-lg font-bold">{info.count}</span>
                <span className={`text-[10px] ${active ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {info.exceptions > 0 ? `${info.exceptions} avvik.` : 'butiker'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter Bar + Exception-First Toggle */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <Filter className="mr-1 h-4 w-4 text-slate-400" />
            <button
              type="button"
              onClick={() => onChangeWave('ALL')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedWave === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Alla vågor ({stores.length})
            </button>
            {ROLLOUT_WAVES.map((w) => {
              const count = stores.filter((s) => s.wave === w.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onChangeWave(w.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedWave === w.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {w.id} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Management by Exception Filter – Kritiskt vid 70 butiker/våg! */}
            <button
              type="button"
              onClick={() => setOnlyExceptions((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                onlyExceptions
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 ring-1 ring-rose-600/25 ring-inset hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Visa endast avvikelser ({totalExceptionCount})
            </button>

            <select
              aria-label="Filtrera på land"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value as CountryCode | 'ALL')}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700"
            >
              <option value="ALL">Alla länder (SE/NO/FI)</option>
              <option value="SE (Land A)">SE (Land A)</option>
              <option value="NO (Land B)">NO (Land B)</option>
              <option value="FI (Land C)">FI (Land C)</option>
            </select>

            <select
              aria-label="Filtrera på butikstyp"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as StoreFormat | 'ALL')}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700"
            >
              <option value="ALL">Alla typer (Easy/Large/Feeder)</option>
              <option value="Easy store">Easy store</option>
              <option value="Large store">Large store</option>
              <option value="Feeder store">Feeder store</option>
            </select>

            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök butik, stad, W1-014..."
                aria-label="Sök butik, stad eller ID"
                className="rounded-lg border border-slate-300 bg-white py-1.5 pr-3 pl-8 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Sticky Responsive Store Matrix */}
        <div
          tabIndex={0}
          role="region"
          aria-labelledby="store-matrix-caption"
          className="table-wrapper rounded-xl border border-slate-200"
        >
          <table className="rollout-table text-left text-sm">
            <caption id="store-matrix-caption" className="sr-only">
              Utrullningsplan per våg, land och butik ({filteredStores.length} butiker visas)
            </caption>
            <thead className="bg-slate-100 text-xs font-semibold tracking-wide text-slate-600 uppercase">
              <tr>
                <th scope="col" className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                  Butik &amp; Land
                </th>
                <th scope="col" className="border-b border-slate-200 px-3 py-3">
                  Våg &amp; Typ
                </th>
                <th scope="col" className="border-b border-slate-200 px-3 py-3">
                  Cut-over (T-0)
                </th>
                <th scope="col" className="border-b border-slate-200 px-3 py-3">
                  Hårdvara (T-10d)
                </th>
                <th scope="col" className="border-b border-slate-200 px-3 py-3">
                  Nätverk (T-8d)
                </th>
                <th scope="col" className="border-b border-slate-200 px-3 py-3">
                  Utbildning (T-5d)
                </th>
                <th scope="col" className="border-b border-slate-200 px-3 py-3">
                  Pre-care (T-3d)
                </th>
                <th scope="col" className="border-b border-slate-200 px-4 py-3 text-right">
                  23 Aktiviteter (Lager 3)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredStores.map((s) => {
                const hwDate = formatSwedishDate(addDaysIso(s.goLiveDate, -10));
                const netDate = formatSwedishDate(addDaysIso(s.goLiveDate, -8));
                const trainDate = formatSwedishDate(addDaysIso(s.goLiveDate, -5));
                const preCareDate = formatSwedishDate(addDaysIso(s.goLiveDate, -3));
                const weekdayCheck = isRestrictedRolloutWeekday(s.goLiveDate);
                const rowHasIssue = hasStoreException(s);

                return (
                  <tr
                    key={s.id}
                    className={`group transition ${
                      rowHasIssue
                        ? 'bg-rose-50/30 hover:bg-rose-50/60'
                        : 'hover:bg-indigo-50/35'
                    }`}
                  >
                    <th
                      scope="row"
                      className={`px-4 py-3 font-medium text-slate-900 ${
                        rowHasIssue
                          ? 'bg-rose-50/30 group-hover:bg-rose-50/60'
                          : 'bg-white group-hover:bg-indigo-50/40'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-700">
                          {s.id}
                        </span>
                        <CountryBadge country={s.country} />
                        <span className="font-semibold">{s.name}</span>
                      </div>
                      <div className="mt-0.5 text-xs font-normal text-slate-500">
                        {s.city} · {s.registers} kassor · BC: {s.storeManager}
                      </div>
                      {s.note ? (
                        <div
                          className={`mt-1 text-[11px] font-medium ${
                            rowHasIssue ? 'text-rose-700' : 'text-indigo-700'
                          }`}
                        >
                          {s.note}
                        </div>
                      ) : null}
                    </th>

                    <td className="px-3 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-semibold text-slate-800">{s.wave}</span>
                        <FormatBadge format={s.format} />
                      </div>
                    </td>

                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {formatSwedishDate(s.goLiveDate, true)}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-xs font-medium text-indigo-700">
                          {formatShortWeek(s.goLiveDate)}
                        </span>
                        {weekdayCheck.restricted ? (
                          <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            EJ {weekdayCheck.weekdayName.toUpperCase()}!
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <PrepStatusBadge status={s.hardwareStatus} dateLabel={hwDate} />
                    </td>

                    <td className="px-3 py-3">
                      <PrepStatusBadge status={s.sdwanStatus} dateLabel={netDate} />
                    </td>

                    <td className="px-3 py-3">
                      <PrepStatusBadge status={s.trainingStatus} dateLabel={trainDate} />
                    </td>

                    <td className="px-3 py-3">
                      <PrepStatusBadge status={s.preCareStatus} dateLabel={preCareDate} />
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onQuickInspect(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                          title="Snabbgranska butikens 4 faser i dialog"
                        >
                          <Eye className="h-3.5 w-3.5 shrink-0" />
                          Snabbvy
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenLayer3(s.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-indigo-700 hover:bg-indigo-100"
                        >
                          <ClipboardList className="h-3.5 w-3.5 shrink-0" />
                          23 steg
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
