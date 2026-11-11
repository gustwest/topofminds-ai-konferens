import type { CountryCode, MasterPlanDeliverable, PrepStatus, StoreFormat } from '../types/rollout';

export function PrepStatusBadge({ status, dateLabel }: { status: PrepStatus; dateLabel?: string }) {
  const styles: Record<PrepStatus, string> = {
    Klar: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Levererad: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Skickad: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    Bokad: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    Pågår: 'bg-amber-50 text-amber-800 ring-amber-600/20',
    Planerad: 'bg-slate-100 text-slate-700 ring-slate-500/20',
    Avvikelse: 'bg-rose-50 text-rose-700 ring-rose-600/30 font-semibold',
    'Ej bokad': 'bg-slate-100 text-slate-600 ring-slate-400/20',
    'Ej startad': 'bg-slate-100 text-slate-600 ring-slate-400/20',
  };

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <span
        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
      >
        {status}
      </span>
      {dateLabel ? <span className="text-[11px] text-slate-500">{dateLabel}</span> : null}
    </div>
  );
}

export function FormatBadge({ format }: { format: StoreFormat }) {
  const styles: Record<StoreFormat, string> = {
    'Easy store': 'bg-emerald-50 text-emerald-800 ring-emerald-700/20',
    'Large store': 'bg-indigo-50 text-indigo-800 ring-indigo-700/20',
    'Feeder store': 'bg-purple-100 text-purple-800 ring-purple-700/25',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[format]}`}
    >
      {format}
    </span>
  );
}

export function CountryBadge({ country }: { country: CountryCode }) {
  const styles: Record<CountryCode, string> = {
    'SE (Land A)': 'bg-sky-50 text-sky-800 ring-sky-600/20',
    'NO (Land B)': 'bg-rose-50 text-rose-800 ring-rose-600/20',
    'FI (Land C)': 'bg-cyan-50 text-cyan-800 ring-cyan-600/20',
  };
  const shortLabel = country.split(' ')[0];
  return (
    <span
      title={country}
      className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[11px] font-bold ring-1 ring-inset ${styles[country]}`}
    >
      {shortLabel}
    </span>
  );
}

export function RagBadge({ rag }: { rag: MasterPlanDeliverable['rag'] }) {
  const styles: Record<MasterPlanDeliverable['rag'], string> = {
    Green: 'bg-emerald-100 text-emerald-800 ring-emerald-700/20',
    Amber: 'bg-amber-100 text-amber-900 ring-amber-700/25',
    Red: 'bg-rose-100 text-rose-800 ring-rose-700/25',
    Grey: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${styles[rag]}`}
    >
      {rag}
    </span>
  );
}
