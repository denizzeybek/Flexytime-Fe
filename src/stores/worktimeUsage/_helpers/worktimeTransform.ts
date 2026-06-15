import { formatByPerspective, sumDomainSeconds } from '@/helpers/perspective';

import type { ClockDistribution } from '@/client';
import type {
  IDistribution,
  IEmployeeResponse,
  IGraph,
  ISummary,
} from '@/views/worktimeUsage/_types';

export interface LegacyStatCell {
  time: string;
}

export interface SummaryRow {
  Work?: number | null;
  Meeting?: number | null;
  Leisure?: number | null;
  Unclassified?: number | null;
  WorkCost?: string | null;
  MeetingCost?: string | null;
  LeisureCost?: string | null;
  UnclassifiedCost?: string | null;
}

export interface SummaryLike {
  Work?: number;
  Meeting?: number;
  Leisure?: number;
  Unclassified?: number;
  WorkCost?: string;
  MeetingCost?: string;
  LeisureCost?: string;
  UnclassifiedCost?: string;
  StartTime?: number | null;
  EndTime?: number | null;
  Start?: number | null;
  End?: number | null;
}

export interface IWellBeingGraph {
  Type: string;
  Name: string;
  Color: 'red' | 'yellow' | 'green';
  Icon: string;
  Graph: { labels: string[]; datasets: Array<{ label: string; data: number[] }>; Unit: string };
}

export const WELLBEING_LEVEL_COLOR: Record<number, 'red' | 'yellow' | 'green'> = {
  0: 'red',
  1: 'yellow',
  2: 'green',
};

export const WELLBEING_TYPE_ICON: Record<string, string> = {
  Overload: 'fas fa-fire-extinguisher',
  Distract: 'fas fa-volume-slash',
  Automation: 'fas fa-cogs',
  Fragmentation: 'fas fa-fast-forward',
  Overmeeting: 'fas fa-clock',
  Overtime: 'fas fa-clock',
  Nocturnal: 'fas fa-clock',
  Uninterrupted: 'fas fa-coffee',
  Mailbulk: 'fas fa-mail-bulk',
  Balanced: 'fas fa-walking',
};

export const WELLBEING_TYPE_UNIT: Record<string, string> = {
  Overtime: 'h',
  Overmeeting: 'h',
  Nocturnal: 'h',
  Overload: 'h',
  Uninterrupted: 'h',
  Distract: 'count',
  Automation: 'count',
  Fragmentation: 'count',
  Mailbulk: 'count',
  Balanced: 'h',
};

export function perspectiveCellFor(
  row: SummaryRow,
  key: 'Work' | 'Meeting' | 'Leisure' | 'Unclassified',
  perspective: string | undefined,
  currency: string,
): LegacyStatCell {
  const totalSeconds = sumDomainSeconds(row);
  return {
    time: formatByPerspective({
      seconds: row[key] ?? 0,
      cost: row[`${key}Cost`] ?? '0',
      totalSeconds,
      perspective,
      currency,
    }),
  };
}

export function secondsToClockTime(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return '-';
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600) % 24;
  const m = Math.floor((total % 3600) / 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function clockTimeCell(seconds: number | null | undefined): LegacyStatCell {
  return { time: secondsToClockTime(seconds) };
}

export function summaryObjectToArray(
  summary: SummaryLike,
  perspective: string | undefined,
  currency: string,
): ISummary[] {
  const start = summary.StartTime ?? summary.Start ?? null;
  const end = summary.EndTime ?? summary.End ?? null;
  const row: SummaryRow = {
    Work: summary.Work,
    Meeting: summary.Meeting,
    Leisure: summary.Leisure,
    Unclassified: summary.Unclassified,
    WorkCost: summary.WorkCost,
    MeetingCost: summary.MeetingCost,
    LeisureCost: summary.LeisureCost,
    UnclassifiedCost: summary.UnclassifiedCost,
  };
  return [
    { id: 'work', statisticType: 'work', time: perspectiveCellFor(row, 'Work', perspective, currency).time },
    { id: 'meeting', statisticType: 'meeting', time: perspectiveCellFor(row, 'Meeting', perspective, currency).time },
    { id: 'leisure', statisticType: 'leisure', time: perspectiveCellFor(row, 'Leisure', perspective, currency).time },
    {
      id: 'unclassified',
      statisticType: 'unclassified',
      time: perspectiveCellFor(row, 'Unclassified', perspective, currency).time,
    },
    { id: 'starttime', statisticType: 'starttime', time: secondsToClockTime(start) },
    { id: 'endtime', statisticType: 'endtime', time: secondsToClockTime(end) },
  ];
}

export function distributionsToLegacy(
  distribution: ClockDistribution[],
  perspective: string | undefined,
  currency: string,
): IDistribution[] {
  const totalSeconds = distribution.reduce((acc, r) => acc + (r.Seconds ?? 0), 0);
  return distribution.map((row) => {
    const apps = (row.Applications ?? []).filter((a) => (a.Seconds ?? 0) > 0);
    const rowTotalApps = apps.reduce((acc, a) => acc + (a.Seconds ?? 0), 0);
    return {
      id: String(row.Domain).toLowerCase(),
      statisticType: String(row.Domain).toLowerCase(),
      time: formatByPerspective({
        seconds: row.Seconds ?? 0,
        cost: row.Cost ?? '0',
        totalSeconds,
        perspective,
        currency,
      }),
      Applications: apps.map((app) => ({
        imgPath: '',
        title: app.Name ?? '',
        time: formatByPerspective({
          seconds: app.Seconds ?? 0,
          cost: app.Cost ?? '0',
          totalSeconds: rowTotalApps,
          perspective,
          currency,
        }),
      })),
      Chart: apps.map((app) => ({
        label: app.Name ?? '',
        value: app.Seconds ?? 0,
      })),
    };
  }) as unknown as IDistribution[];
}

export function buildProductivityGraph(
  days: Array<{ Date?: string; Work?: number; Meeting?: number; Leisure?: number; Unclassified?: number }>,
): IGraph {
  if (!days?.length) return {} as IGraph;
  const labels = days.map((d) => d.Date ?? '');
  const toHours = (s: number | undefined): number => Number(((s ?? 0) / 3600).toFixed(2));
  const datasets = [
    { label: 'work', data: days.map((d) => toHours(d.Work)) },
    { label: 'meeting', data: days.map((d) => toHours(d.Meeting)) },
    { label: 'leisure', data: days.map((d) => toHours(d.Leisure)) },
    { label: 'unclassified', data: days.map((d) => toHours(d.Unclassified)) },
  ];
  return { Summary: { labels, datasets, Unit: 'h' } } as IGraph;
}

export function buildWellBeingGraphs(
  graphs: Array<{ Type?: string; Points?: Array<{ Date?: string; Value?: number }> }>,
): IWellBeingGraph[] {
  return (graphs ?? []).map((g) => {
    const type = g.Type ?? '';
    const unit = WELLBEING_TYPE_UNIT[type] ?? '';
    const toUnit = (v: number | undefined): number =>
      unit === 'h' ? Number(((v ?? 0) / 3600).toFixed(2)) : v ?? 0;
    const labels = (g.Points ?? []).map((p) => p.Date ?? '');
    const data = (g.Points ?? []).map((p) => toUnit(p.Value));
    return {
      Type: type,
      Name: type,
      Color: 'yellow' as const,
      Icon: WELLBEING_TYPE_ICON[type] ?? 'fas fa-heart',
      Graph: {
        labels,
        datasets: [{ label: type, data }],
        Unit: unit,
      },
    };
  });
}

export function buildIndividualWellbeings(
  wellbeings: Array<{
    Type?: string;
    Notification?: number;
    Level?: number;
    Points?: Array<{ Date?: string; Value?: number }>;
  }>,
): IEmployeeResponse['WellBeings'] {
  return (wellbeings ?? []).map((wb) => {
    const type = wb.Type ?? '';
    const unit = WELLBEING_TYPE_UNIT[type] ?? '';
    const toUnit = (v: number | undefined): number =>
      unit === 'h' ? Number(((v ?? 0) / 3600).toFixed(2)) : v ?? 0;
    const labels = (wb.Points ?? []).map((p) => p.Date ?? '');
    const data = (wb.Points ?? []).map((p) => toUnit(p.Value));
    return {
      Type: type,
      Name: type,
      Color: WELLBEING_LEVEL_COLOR[wb.Level ?? 0] ?? 'yellow',
      Icon: WELLBEING_TYPE_ICON[type] ?? 'fas fa-heart',
      Notification: wb.Notification ?? 0,
      Level: wb.Level ?? 0,
      Description: '',
      Suggestion: '',
      Graph: {
        labels,
        datasets: [{ label: type, data }],
        Unit: unit,
      },
    } as IEmployeeResponse['WellBeings'][number];
  });
}
