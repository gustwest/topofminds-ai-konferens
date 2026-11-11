import { useEffect, useId, useRef } from 'react';
import { ArrowRight, CheckCircle2, Clock, ShieldAlert, X } from 'lucide-react';
import type { ComputedCutoverStep, StoreRollout } from '../types/rollout';
import { formatShortWeek, formatSwedishDate } from '../utils/dateUtils';
import { CountryBadge, FormatBadge } from './StatusBadge';

interface CutoverQuickDialogProps {
  store: StoreRollout | null;
  steps: ComputedCutoverStep[];
  onClose: () => void;
  onOpenFullRunbook: (storeId: string) => void;
}

export function CutoverQuickDialog({
  store,
  steps,
  onClose,
  onOpenFullRunbook,
}: CutoverQuickDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (store) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [store]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('close', handleClose);

    let cleanupFallback: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isDialogContent) {
          dialog.close();
        }
      };
      dialog.addEventListener('click', handleBackdropClick);
      cleanupFallback = () => dialog.removeEventListener('click', handleBackdropClick);
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupFallback?.();
    };
  }, [onClose]);

  const criticalSteps = steps.filter(
    (s) => s.phase.startsWith('2.') || s.id === 'ACT-07' || s.id === 'ACT-20' || s.id === 'ACT-23'
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as Record<string, string>)}
      className="m-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl"
    >
      {store ? (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-xs font-semibold text-white">
                  {store.id}
                </span>
                <CountryBadge country={store.country} />
                <FormatBadge format={store.format} />
                <span className="text-xs font-medium text-slate-500">
                  {store.wave} · {formatShortWeek(store.goLiveDate)}
                </span>
              </div>
              <h2 id={titleId} className="mt-1.5 text-lg font-bold text-slate-900">
                {store.name} – Cut-over &amp; Kritiska Gates ({formatSwedishDate(store.goLiveDate, true)})
              </h2>
              <p className="mt-0.5 text-xs text-slate-600">
                {store.registers} kassor · Team: <strong>{store.fieldTeam}</strong> · Butikschef: {store.storeManager}
              </p>
            </div>
            <form method="dialog">
              <button
                type="submit"
                autoFocus
                aria-label="Stäng dialog"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="overflow-y-auto px-6 py-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Nyckelsteg ur 4-fasmodellen (Pre-care Gate → Cut-over → Exit till linjen)
            </p>
            <div className="space-y-2.5">
              {criticalSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-2xs"
                >
                  <div className="min-w-[108px] rounded-lg bg-indigo-50 px-2.5 py-1.5 text-center">
                    <div className="text-[11px] font-semibold text-indigo-700">
                      {formatSwedishDate(step.calendarDate)}
                    </div>
                    <div className="flex items-center justify-center gap-1 font-mono text-xs font-bold text-indigo-950">
                      <Clock className="h-3 w-3" />
                      {step.startTime}–{step.endTime}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{step.activity}</span>
                      {step.mandatoryGate ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-600/20 ring-inset">
                          <ShieldAlert className="h-3 w-3" /> Gate
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                      <span>
                        Part: <strong>{step.responsibleParty}</strong>
                      </span>
                      <span>· {step.phase}</span>
                    </div>
                  </div>
                  {step.completed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
            <span className="text-xs text-slate-500">
              Visar {criticalSteps.length} nyckelgates av totalt {steps.length} aktiviteter
            </span>
            <div className="flex items-center gap-2">
              <form method="dialog">
                <button
                  type="submit"
                  className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Stäng
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  dialogRef.current?.close();
                  onOpenFullRunbook(store.id);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
              >
                Öppna alla 23 aktiviteter i Lager 3
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
