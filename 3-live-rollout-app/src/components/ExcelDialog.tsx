import { useEffect, useId, useRef, useState } from 'react';
import { Check, Download, FileSpreadsheet, Upload, X } from 'lucide-react';
import type { StoreRollout } from '../types/rollout';
import { evaluateStoreHealth, formatCountryPlain, formatShortWeek } from '../utils/dateUtils';

interface ExcelDialogProps {
  open: boolean;
  stores: StoreRollout[];
  onImportDates: (updates: Record<string, string>) => number;
  onClose: () => void;
}

export function ExcelDialog({ open, stores, onImportDates, onClose }: ExcelDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      setImportMessage(null);
      setImportError(null);
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

  const handleDownloadCsv = () => {
    const header = ['ButiksID', 'Butik', 'Stad', 'Land', 'Våg', 'GoLiveDatum', 'Vecka', 'Status'];
    const rows = stores.map((s) => {
      const country = formatCountryPlain(s.country).label;
      const health = evaluateStoreHealth(s);
      const statusText = health.needsAttention ? health.issues.join(' / ') : 'I fas';
      return [
        s.id,
        s.name,
        s.city,
        country,
        s.wave,
        s.goLiveDate,
        formatShortWeek(s.goLiveDate),
        statusText,
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(';');
    });

    // UTF-8 BOM gör att svenska tecken (å, ä, ö) och kolumner öppnas direkt i Microsoft Excel
    const csvContent = '\uFEFF' + [header.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'utrullningsplan-butiker.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportMessage(null);

    try {
      const text = await file.text();
      const lines = text
        .replace(/^\uFEFF/, '')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        setImportError('Filen verkar sakna rader att läsa in.');
        return;
      }

      const delimiter = lines[0].includes(';') ? ';' : ',';
      const headers = lines[0]
        .split(delimiter)
        .map((h) => h.replace(/^"|"$/g, '').trim().toLowerCase());

      const idCol = headers.findIndex((h) => h.includes('id') || h === 'butiksid');
      const nameCol = headers.findIndex((h) => h === 'butik' || h.includes('namn'));
      const dateCol = headers.findIndex((h) => h.includes('datum') || h.includes('golive') || h.includes('go-live'));

      if (dateCol === -1 || (idCol === -1 && nameCol === -1)) {
        setImportError('Hittade inte kolumnerna "ButiksID"/"Butik" och "GoLiveDatum" (ÅÅÅÅ-MM-DD).');
        return;
      }

      const updates: Record<string, string> = {};
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(delimiter).map((c) => c.replace(/^"|"$/g, '').trim());
        const rawDate = cols[dateCol] ?? '';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) continue;

        const rawId = idCol >= 0 ? cols[idCol] : '';
        const rawName = nameCol >= 0 ? cols[nameCol] : '';
        const matched = stores.find(
          (s) =>
            (rawId && s.id.toLowerCase() === rawId.toLowerCase()) ||
            (rawName && s.name.toLowerCase() === rawName.toLowerCase())
        );
        if (matched) {
          updates[matched.id] = rawDate;
        }
      }

      const updatedCount = onImportDates(updates);
      if (updatedCount === 0) {
        setImportError('Inga matchande butiker med giltigt datum (ÅÅÅÅ-MM-DD) hittades i filen.');
      } else {
        setImportMessage(`Klart! Läste in ${updatedCount} butiker – tidplanen och alla checklistor är uppdaterade.`);
      }
    } catch {
      setImportError('Kunde inte läsa filen. Kontrollera att den är sparad som CSV från Excel.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as Record<string, string>)}
      className="m-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl"
    >
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id={titleId} className="text-base font-bold text-slate-900">
                Jobba sömlöst mot Excel
              </h2>
              <p className="mt-0.5 text-xs text-slate-600">
                Behåll Excel som arbetsyta och få ut en ren, uppdaterad tidplan för styrgrupp och butiker.
              </p>
            </div>
          </div>
          <form method="dialog">
            <button
              type="submit"
              aria-label="Stäng Excel-fönster"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70 hover:text-slate-800"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              1. Spara ner aktuell plan till Excel
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Laddar hem alla {stores.length} butiker med sina aktuella Go-Live-datum, veckonummer och status så att du kan öppna filen direkt i Microsoft Excel.
            </p>
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Ladda hem Excel-underlag (.csv)
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              2. Läs in ändrade datum från Excel
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Har du ändrat Go-Live-datum i Excel? Spara som CSV och välj filen här så ritas styrgruppens tidplan och butikernas körscheman om direkt.
            </p>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100">
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              Välj CSV-fil från Excel...
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </label>

            {importMessage ? (
              <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                {importMessage}
              </p>
            ) : null}

            {importError ? (
              <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-800">
                {importError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-3">
          <form method="dialog">
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Stäng
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
