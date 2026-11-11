import { useEffect, useId, useRef, useState } from 'react';
import { Check, Copy, Mail, MessageSquarePlus, Trash2, X } from 'lucide-react';

export interface ReviewComment {
  id: string;
  contextLabel: string;
  text: string;
  createdAt: string;
}

const STORAGE_KEY = 'rollout_studio_review_comments_v1';

export function loadSavedComments(): ReviewComment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCommentsToStorage(comments: ReviewComment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch {
    // Ignore storage quota issues in private browsing
  }
}

interface FeedbackDialogProps {
  open: boolean;
  currentContextLabel: string;
  comments: ReviewComment[];
  onAddComment: (comment: ReviewComment) => void;
  onDeleteComment: (id: string) => void;
  onClose: () => void;
}

export function FeedbackDialog({
  open,
  currentContextLabel,
  comments,
  onAddComment,
  onDeleteComment,
  onClose,
}: FeedbackDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);

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
      onClose();
    };

    dialog.addEventListener('close', handleClose);

    let cleanupFallback: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isInside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isInside) {
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

  const formattedSummary =
    comments.length === 0
      ? ''
      : [
          'Hej Gustav! Här kommer mina tankar/kommentarer på Rollout Studio (v0.1):',
          '',
          ...comments.map((c, idx) => `${idx + 1}. [${c.contextLabel}] ${c.text}`),
        ].join('\n');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAddComment({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      contextLabel: currentContextLabel,
      text: trimmed,
      createdAt: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
    });
    setDraft('');
  };

  const handleCopyAll = async () => {
    if (!formattedSummary) return;
    try {
      await navigator.clipboard.writeText(formattedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const mailtoHref = `mailto:gustav.westergren@topofminds.se?subject=${encodeURIComponent(
    'Feedback på Store Operations & Rollout Studio inför konferensen'
  )}&body=${encodeURIComponent(formattedSummary)}`;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as Record<string, string>)}
      className="m-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl"
    >
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              <MessageSquarePlus className="h-3.5 w-3.5" />
              Aktiv vy: {currentContextLabel}
            </div>
            <h2 id={titleId} className="mt-1.5 text-lg font-bold text-slate-900">
              Kommentarer &amp; Idéer inför Konferensen
            </h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Skriv ner tankar medan du klickar runt – allt sparas automatiskt i din webbläsare och kan skickas till Gustav med ett klick.
            </p>
          </div>
          <form method="dialog">
            <button
              type="submit"
              aria-label="Stäng kommentarsruta"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <label htmlFor="review-comment-input" className="block text-xs font-semibold text-slate-700">
              Ny kommentar för <span className="text-indigo-700">{currentContextLabel}</span>
            </label>
            <textarea
              id="review-comment-input"
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="T.ex. 'Snyggt med 3-veckorstrappan! I Lager 2 vore det även toppen att kunna...' "
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!draft.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-40"
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                Spara kommentar ({currentContextLabel})
              </button>
            </div>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                Dina sparade kommentarer ({comments.length})
              </span>
            </div>

            {comments.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                Inga kommentarer sparade ännu. Klicka runt i Lager 1, 2 och 3 och lägg till tankar här!
              </p>
            ) : (
              <ul className="mt-2.5 space-y-2">
                {comments.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-indigo-700">
                        <span>{c.contextLabel}</span>
                        <span className="text-slate-400">· kl. {c.createdAt}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-800 whitespace-pre-wrap">{c.text}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteComment(c.id)}
                      aria-label="Ta bort kommentar"
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <form method="dialog">
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Fortsätt klicka runt
            </button>
          </form>

          {comments.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    Kopierat!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Kopiera alla ({comments.length})
                  </>
                )}
              </button>
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700"
              >
                <Mail className="h-3.5 w-3.5" />
                Mejla till Gustav
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
