

import { secondsToDurationString } from './time';

export type Perspective = '0' | '1' | '2' | '3';

export const PERSPECTIVE = {
  TIME: '0',
  COST: '1',
  RATE: '2',
  IN_SHIFT: '3',
} as const;

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

  seconds: number;

  cost: string | null | undefined;

  totalSeconds: number;

  perspective: Perspective | string | undefined;

  currency: string;
}

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
