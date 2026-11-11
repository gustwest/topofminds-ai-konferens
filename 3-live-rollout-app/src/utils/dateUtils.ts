import type { CountryCode, StoreRollout } from '../types/rollout';

/**
 * Timezone-safe kalenderhjälpare för YYYY-MM-DD.
 * Använder UTC-matematik så att sommar-/vintertidsomställningen aldrig
 * förskjuter datum med +-1 dygn.
 */

const SWEDISH_MONTHS_SHORT = [
  'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
];

const SWEDISH_WEEKDAYS_SHORT = ['sön', 'mån', 'tis', 'ons', 'tors', 'fre', 'lör'];
const SWEDISH_WEEKDAYS_LONG = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];

export function parseIsoToUtcMs(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function formatUtcMsToIso(utcMs: number): string {
  const dt = new Date(utcMs);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysIso(isoDate: string, deltaDays: number): string {
  const ms = parseIsoToUtcMs(isoDate) + deltaDays * 86_400_000;
  return formatUtcMsToIso(ms);
}

export function daysBetweenIso(startIso: string, endIso: string): number {
  return Math.round((parseIsoToUtcMs(endIso) - parseIsoToUtcMs(startIso)) / 86_400_000);
}

/**
 * Returnerar veckodag i UTC: 0 = söndag, 1 = måndag ... 5 = fredag, 6 = lördag.
 */
export function getUtcWeekday(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * Kontrollerar om Go-Live ligger på en olämplig veckodag (måndag, fredag eller helg).
 */
export function isRestrictedRolloutWeekday(isoDate: string): {
  restricted: boolean;
  weekdayName: string;
  weekdayLong: string;
} {
  const wd = getUtcWeekday(isoDate);
  const weekdayName = SWEDISH_WEEKDAYS_SHORT[wd] ?? '';
  const weekdayLong = SWEDISH_WEEKDAYS_LONG[wd] ?? '';
  return {
    restricted: wd === 1 || wd === 5 || wd === 0 || wd === 6,
    weekdayName,
    weekdayLong,
  };
}

export function getIsoWeekAndYear(isoDate: string): { year: number; week: number; label: string } {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  const isoYear = date.getUTCFullYear();
  return {
    year: isoYear,
    week: weekNo,
    label: `${isoYear}-v${String(weekNo).padStart(2, '0')}`,
  };
}

export function formatShortWeek(isoDate: string): string {
  const { week } = getIsoWeekAndYear(isoDate);
  return `v.${String(week).padStart(2, '0')}`;
}

export function formatSwedishDate(isoDate: string, includeWeekday = false): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const monthName = SWEDISH_MONTHS_SHORT[m - 1] ?? '';
  const yearSuffix = y !== 2027 ? ` ${y}` : '';
  if (includeWeekday) {
    const wd = SWEDISH_WEEKDAYS_SHORT[dt.getUTCDay()];
    return `${wd} ${d} ${monthName}${yearSuffix}`;
  }
  return `${d} ${monthName}${yearSuffix}`;
}

export function formatRelativeDayOffset(dayOffset: number): string {
  if (dayOffset === 0) return 'Go-Live-dagen';
  if (dayOffset === -1) return 'Dagen före';
  if (dayOffset === -7) return '1 vecka före';
  if (dayOffset === -14) return '2 veckor före';
  if (dayOffset < 0) return `${Math.abs(dayOffset)} dagar före`;
  if (dayOffset === 1) return 'Dagen efter';
  if (dayOffset === 7) return '1 vecka efter';
  return `${dayOffset} dagar efter`;
}

export function formatCountryPlain(country: CountryCode): { code: 'SE' | 'NO' | 'FI'; label: string } {
  if (country.startsWith('SE')) return { code: 'SE', label: 'Sverige' };
  if (country.startsWith('NO')) return { code: 'NO', label: 'Norge' };
  return { code: 'FI', label: 'Finland' };
}

export function formatShiftSummary(deltaDays: number): string | null {
  if (deltaDays === 0) return null;
  if (deltaDays % 7 === 0) {
    const weeks = deltaDays / 7;
    const absWeeks = Math.abs(weeks);
    const unit = absWeeks === 1 ? 'vecka' : 'veckor';
    return weeks > 0 ? `+${weeks} ${unit}` : `${weeks} ${unit}`;
  }
  const absDays = Math.abs(deltaDays);
  const unit = absDays === 1 ? 'dag' : 'dagar';
  return deltaDays > 0 ? `+${deltaDays} ${unit}` : `${deltaDays} ${unit}`;
}

/**
 * Utvärderar i vanlig begriplig svenska om en butik är redo eller om något behöver åtgärdas.
 * Om en butik som låg på måndag/fredag flyttas till tis–tors försvinner den varningen direkt!
 */
export function evaluateStoreHealth(store: StoreRollout): {
  needsAttention: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  const weekdayCheck = isRestrictedRolloutWeekday(store.goLiveDate);
  if (weekdayCheck.restricted) {
    issues.push(`Inbokad på en ${weekdayCheck.weekdayLong} (byt till tis–tors)`);
  }
  if (store.hardwareStatus === 'Avvikelse') {
    issues.push('Hårdvara försenad');
  }
  if (store.sdwanStatus === 'Avvikelse') {
    issues.push('Nätverk ej klart');
  }
  if (store.trainingStatus === 'Avvikelse') {
    issues.push('Utbildning saknas');
  }
  if (
    store.preCareStatus === 'Avvikelse' &&
    store.hardwareStatus !== 'Avvikelse' &&
    store.sdwanStatus !== 'Avvikelse' &&
    store.trainingStatus !== 'Avvikelse'
  ) {
    issues.push('Förberedelse släpar');
  }

  return {
    needsAttention: issues.length > 0,
    issues,
  };
}
