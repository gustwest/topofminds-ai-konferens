import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import type { CountryCode, StoreRollout, WaveId } from '../types/rollout';
import {
  daysBetweenIso,
  evaluateStoreHealth,
  formatCountryPlain,
  formatShiftSummary,
  formatShortWeek,
  formatSwedishDate,
} from '../utils/dateUtils';

interface Layer2StoreMatrixProps {
  stores: StoreRollout[];
  selectedWave: WaveId | 'ALL';
  onlyIssuesInitial?: boolean;
  getCompletedCountForStore: (storeId: string) => number;
  onChangeWave: (wave: WaveId | 'ALL') => void;
  onShiftStoreDays: (storeId: string, deltaDays: number) => void;
  onBackToLayer1: () => void;
  onOpenLayer3: (storeId: string) => void;
}

const WAVE_FILTERS: Array<{ id: WaveId | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'Alla vågor' },
  { id: 'Pilot', label: 'Pilot' },
  { id: 'Våg 1', label: 'Våg 1' },
  { id: 'Våg 2', label: 'Våg 2' },
  { id: 'Våg 3', label: 'Våg 3' },
];

export function Layer2StoreMatrix({
  stores,
  selectedWave,
  onlyIssuesInitial = false,
  getCompletedCountForStore,
  onChangeWave,
  onShiftStoreDays,
  onBackToLayer1,
  onOpenLayer3,
}: Layer2StoreMatrixProps) {
  const [onlyIssues, setOnlyIssues] = useState<boolean>(onlyIssuesInitial);
  const [countryFilter, setCountryFilter] = useState<CountryCode | 'ALL'>('ALL');
  const [query, setQuery] = useState<string>('');

  // Synka om användaren klickade på "Visa X st ->" från Steg 1
  const [prevInitial, setPrevInitial] = useState(onlyIssuesInitial);
  if (onlyIssuesInitial !== prevInitial) {
    setPrevInitial(onlyIssuesInitial);
    setOnlyIssues(onlyIssuesInitial);
  }

  const waveScopedStores = useMemo(() => {
    return selectedWave === 'ALL' ? stores : stores.filter((s) => s.wave === selectedWave);
  }, [stores, selectedWave]);

  const waveHealthCounts = useMemo(() => {
    let issues = 0;
    for (const s of waveScopedStores) {
      if (evaluateStoreHealth(s).needsAttention) issues++;
    }
    return {
      total: waveScopedStores.length,
      ok: waveScopedStores.length - issues,
      issues,
    };
  }, [waveScopedStores]);

  const filteredStores = useMemo(() => {
    const q = query.trim().toLowerCase();
    return waveScopedStores
      .filter((store) => {
        if (countryFilter !== 'ALL' && store.country !== countryFilter) return false;
        if (onlyIssues && !evaluateStoreHealth(store).needsAttention) return false;
        if (q) {
          const countryName = formatCountryPlain(store.country).label.toLowerCase();
          const matches =
            store.name.toLowerCase().includes(q) ||
            store.city.toLowerCase().includes(q) ||
            countryName.includes(q) ||
            store.wave.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => a.goLiveDate.localeCompare(b.goLiveDate) || a.name.localeCompare(b.name));
  }, [waveScopedStores, countryFilter, onlyIssues, query]);

  return (
    <div className="space-y-5">
      {/* Tillbaka-länk + Vågväljare */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToLayer1}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Tillbaka till tidplanen (Månader)
        </button>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrera på våg">
          {WAVE_FILTERS.map((wf) => {
            const count =
              wf.id === 'ALL' ? stores.length : stores.filter((s) => s.wave === wf.id).length;
            const active = selectedWave === wf.id;
            return (
              <button
                key={wf.id}
                type="button"
                onClick={() => onChangeWave(wf.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  active
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {wf.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Två tydliga statuskort: I fas vs Behöver ses över */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setOnlyIssues(false)}
          className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
            !onlyIssues
              ? 'border-indigo-500 bg-white ring-2 ring-indigo-500/15'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Visa hela urvalet ({waveHealthCounts.total} butiker)
            </div>
            <div className="mt-1 text-lg font-bold text-slate-900">
              {waveHealthCounts.ok} av {waveHealthCounts.total} butiker helt i fas
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Hårdvara, nätverk, utbildning och Go-Live-dag rullar enligt plan.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setOnlyIssues((prev) => !prev)}
          className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
            onlyIssues
              ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/15'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4 text-rose-600" aria-hidden="true" />
              {onlyIssues ? 'Visar endast avvikelser (klicka för att visa alla)' : 'Filtrera på hinder'}
            </div>
            <div className="mt-1 text-lg font-bold text-slate-900">
              {waveHealthCounts.issues === 0
                ? '0 butiker med hinder!'
                : `${waveHealthCounts.issues} butiker behöver ses över`}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {waveHealthCounts.issues === 0
                ? 'Alla butiker i denna våg är gröna inför start.'
                : 'Saknar utrustning/utbildning eller ligger på olämplig veckodag (mån/fre).'}
            </p>
          </div>
        </button>
      </div>

      {/* Huvudlista med sök & butiksrader */}
      <section
        aria-labelledby="stores-heading"
        className="rounded-2xl border border-slate-200 bg-white shadow-xs"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 id="stores-heading" className="text-base font-bold text-slate-900">
              {selectedWave === 'ALL' ? 'Alla planerade butiker' : `Butiker i ${selectedWave}`} (
              {filteredStores.length} st)
            </h2>
            <p className="text-xs text-slate-500">
              Justera enskild butiks Go-Live-dag med <strong>-1d / +1d</strong> eller öppna butikens checklista.
            </p>
          </div>

          <search className="flex flex-wrap items-center gap-2">
            <label htmlFor="country-select" className="sr-only">
              Filtrera land
            </label>
            <select
              id="country-select"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value as CountryCode | 'ALL')}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ALL">Alla länder</option>
              <option value="SE (Land A)">Sverige</option>
              <option value="NO (Land B)">Norge</option>
              <option value="FI (Land C)">Finland</option>
            </select>

            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <label htmlFor="store-search" className="sr-only">
                Sök butik eller stad
              </label>
              <input
                id="store-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök butik eller stad..."
                className="w-52 rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
          </search>
        </div>

        {filteredStores.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Inga butiker matchar ditt filter just nu.
          </div>
        ) : (
          <div className="overflow-x-auto" role="region" aria-labelledby="stores-heading">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  <th scope="col" className="px-5 py-3">
                    Butik &amp; land
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Planerad Go-Live
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status inför start
                  </th>
                  <th scope="col" className="px-5 py-3 text-right">
                    Checklista (Dagar &amp; tid)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStores.map((store) => {
                  const country = formatCountryPlain(store.country);
                  const health = evaluateStoreHealth(store);
                  const deltaDays = daysBetweenIso(store.baselineGoLiveDate, store.goLiveDate);
                  const shiftText = formatShiftSummary(deltaDays);
                  const doneCount = getCompletedCountForStore(store.id);

                  return (
                    <tr
                      key={store.id}
                      className={
                        health.needsAttention
                          ? 'bg-rose-50/30 hover:bg-rose-50/60'
                          : 'hover:bg-slate-50/80'
                      }
                    >
                      {/* Kolumn 1: Butik & Land */}
                      <th scope="row" className="px-5 py-3.5 font-normal">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900">{store.name}</span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
                            {country.label}
                          </span>
                          <span className="text-xs text-slate-400">· {store.wave}</span>
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {store.city} · Butikschef: {store.storeManager}
                        </div>
                      </th>

                      {/* Kolumn 2: Go-Live-datum med direkt -1d / +1d */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onShiftStoreDays(store.id, -1)}
                              aria-label={`Flytta ${store.name} 1 dag bakåt`}
                              className="rounded-l-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span className="min-w-[92px] border-x border-slate-200 px-2.5 py-1 text-center text-xs font-bold text-slate-900">
                              {formatSwedishDate(store.goLiveDate, true)}
                            </span>
                            <button
                              type="button"
                              onClick={() => onShiftStoreDays(store.id, 1)}
                              aria-label={`Flytta ${store.name} 1 dag framåt`}
                              className="rounded-r-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                            >
                              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <span className="text-xs font-medium text-slate-500">
                            {formatShortWeek(store.goLiveDate)}
                          </span>

                          {shiftText ? (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                              {shiftText}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Kolumn 3: Begriplig status på ren svenska */}
                      <td className="px-4 py-3.5">
                        {!health.needsAttention ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                            Allt i fas
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {health.issues.map((issue) => (
                              <span
                                key={issue}
                                className="inline-flex items-center gap-1 rounded-full bg-rose-100/80 px-2.5 py-1 text-xs font-semibold text-rose-800"
                              >
                                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" aria-hidden="true" />
                                {issue}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Kolumn 4: Öppna checklista */}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenLayer3(store.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-2xs hover:border-indigo-200 hover:bg-indigo-50"
                        >
                          Checklista ({doneCount}/23)
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
