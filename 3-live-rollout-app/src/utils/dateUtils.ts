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
 * Från Connies "Overall Rollout Plan":
 * "Days to avoid (Public holidays etc.) - No rollout on (Mondays or) Fridays!"
 */
export function isRestrictedRolloutWeekday(isoDate: string): {
  restricted: boolean;
  weekdayName: string;
} {
  const wd = getUtcWeekday(isoDate);
  const weekdayName = SWEDISH_WEEKDAYS_SHORT[wd] ?? '';
  return {
    restricted: wd === 1 || wd === 5 || wd === 0 || wd === 6,
    weekdayName,
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
  if (dayOffset === 0) return 'T-0 (Cut-over)';
  if (dayOffset < 0) return `T${dayOffset}d`;
  return `T+${dayOffset}d`;
}
