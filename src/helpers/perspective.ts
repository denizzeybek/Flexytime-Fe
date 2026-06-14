/**
 * Perspective-aware value formatting for the worktime usage page.
 *
 * The ActionsBar dropdown lets the user swap how each domain cell is
 * displayed: Time (HH:MM:SS), Cost (currency string), Rate (% of the row's
 * domain total), or InShift (same as Time — the BE filters rows by shift
 * bounds when `Category=InShift`, so the cell is still a duration).
 *
 * The BE response carries everything the FE needs:
 *   - `Work/Meeting/Leisure/Unclassified`         → seconds
 *   - `WorkCost/MeetingCost/LeisureCost/...Cost`  → decimal-strings
 *   - `Currency`                                   → ISO 4217 code
 *
 * This module centralises the Time/Cost/Rate switch so cell builders in
 * `worktimeStore.ts` only call `formatByPerspective(...)`.
 */

import { secondsToDurationString } from './time';

export type Perspective = '0' | '1' | '2' | '3';

export const PERSPECTIVE = {
  TIME: '0',
  COST: '1',
  RATE: '2',
  IN_SHIFT: '3',
} as const;

/**
 * Format a decimal-string (or number) as a localized currency string. The
 * `currency` arg is an ISO 4217 code (`TRY`, `USD`, `EUR`, …) — surfaced by
 * the BE on `ClockSectionResponse.Currency` / `ClockEmployeeResponse.Currency`.
 * Defends against `Intl` rejecting an unknown code by falling back to a
 * code-suffixed plain number ("12.34 TRY").
 */
export function formatCurrency(
  value: string | number | undefined | null,
  currency: string = 'TRY',
): string {
  const n = typeof value === 'string' ? Number(value) : (value ?? 0);
  if (!Number.isFinite(n)) return '-';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

/**
 * Format a single value as a percentage of the row's domain total. `total`
 * is `Work + Meeting + Leisure + Unclassified` for the same row. Returns
 * `"0%"` when the row is entirely empty so the cell never displays `NaN%`.
 */
export function formatRate(
  value: number | undefined | null,
  total: number,
): string {
  const v = value ?? 0;
  if (!Number.isFinite(v) || total <= 0) return '0%';
  const pct = (v / total) * 100;
  return `${pct.toFixed(1)}%`;
}

export interface FormatByPerspectiveInput {
  /** Seconds for this domain in the window. */
  seconds: number;
  /** Decimal-string cost for this domain in the window (e.g. "120.50"). */
  cost: string | null | undefined;
  /** Sum of all four domains' seconds for the row — denominator for Rate. */
  totalSeconds: number;
  /** Active ActionsBar value ('0' Time, '1' Cost, '2' Rate, '3' InShift). */
  perspective: Perspective | string | undefined;
  /** ISO 4217 currency code, sourced from the BE response. */
  currency: string;
}

/**
 * Single switch every cell builder in the worktime store funnels through.
 * Mapping to legacy {@link Perspective} values: `0=Time`, `1=Cost`, `2=Rate`,
 * `3=InShift`. InShift uses the same seconds payload as Time — the BE has
 * already filtered the rows to shift-bound activity, so the cell value is
 * still a duration; the visible difference is in the totals the BE returned.
 */
export function formatByPerspective(input: FormatByPerspectiveInput): string {
  switch (input.perspective) {
    case PERSPECTIVE.COST:
      return formatCurrency(input.cost ?? '0', input.currency);
    case PERSPECTIVE.RATE:
      return formatRate(input.seconds, input.totalSeconds);
    case PERSPECTIVE.TIME:
    case PERSPECTIVE.IN_SHIFT:
    default:
      return secondsToDurationString(input.seconds);
  }
}

/**
 * Convenience for callers that hand-hold all four domain seconds — returns
 * their sum so the caller can pass it as `totalSeconds` to
 * {@link formatByPerspective}. Negative / non-finite components contribute 0.
 */
export function sumDomainSeconds(opts: {
  Work?: number | null;
  Meeting?: number | null;
  Leisure?: number | null;
  Unclassified?: number | null;
}): number {
  const safe = (v: number | null | undefined): number =>
    typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : 0;
  return safe(opts.Work) + safe(opts.Meeting) + safe(opts.Leisure) + safe(opts.Unclassified);
}
