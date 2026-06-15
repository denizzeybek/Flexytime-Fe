import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface SuggestionClockDetailForm {
  ID?: string;
  Name?: string;
  Title?: string;
  Spend?: number;
  Selected?: boolean;
}

export interface SuggestionClockForm {
  ID?: string;
  Name?: string;
  Title?: string;
  Spend?: number;
  Domain?: number;
  Selected?: boolean;
  Details?: SuggestionClockDetailForm[];
}

export interface SuggestionGroupForm {
  RecordDate?: string;
  Clocks?: SuggestionClockForm[];
}

export interface SuggestionForm {
  suggestions: SuggestionGroupForm[];
}

export interface DayBucket {
  fieldKey: string;
  recordDate: string;
  groupIndex: number;
  clocks: SuggestionClockForm[];
  totalSeconds: number;
}

export interface DayGroup {
  dayKey: string;
  dayLabel: string;
  totalSeconds: number;
  buckets: DayBucket[];
}

export interface SelectionState {
  checked: boolean;
  indeterminate: boolean;
}

const resolveZone = (zone: string | undefined): string => zone || dayjs.tz.guess();

export const dayLabelFor = (
  iso: string,
  zone: string | undefined,
  labels: { today: string; yesterday: string },
): string => {
  const tz = resolveZone(zone);
  const d = dayjs.utc(iso).tz(tz);
  if (!d.isValid()) return '';
  const today = dayjs().tz(tz);
  const yesterday = today.subtract(1, 'day');
  if (d.isSame(today, 'day')) return labels.today;
  if (d.isSame(yesterday, 'day')) return labels.yesterday;
  return d.format('DD MMMM YYYY');
};

export const dayKeyFor = (iso: string, zone: string | undefined): string =>
  dayjs.utc(iso).tz(resolveZone(zone)).format('YYYY-MM-DD');

export const sumBucketSeconds = (clocks: SuggestionClockForm[]): number =>
  clocks.reduce((acc, c) => acc + (c.Spend ?? 0), 0);

export const countLeaves = (clocks: SuggestionClockForm[]): { total: number; selected: number } => {
  let total = 0;
  let selected = 0;
  for (const clock of clocks) {
    if (clock.Details?.length) {
      for (const d of clock.Details) {
        total++;
        if (d.Selected) selected++;
      }
    } else {
      total++;
      if (clock.Selected) selected++;
    }
  }
  return { total, selected };
};

export const checkboxClass = (state: SelectionState): string => {
  if (state.checked || state.indeterminate) {
    return 'border-f-primary bg-f-primary hover:bg-f-primary-hovered hover:border-f-primary-hovered cursor-pointer';
  }
  return 'border-f-stroke hover:border-f-primary bg-f-white hover:bg-f-primary/5 cursor-pointer';
};

export const formatBucketRange = (
  iso: string | undefined,
  zone: string | undefined,
  hours: number,
): string => {
  if (!iso) return '';
  const tz = resolveZone(zone);
  const start = dayjs.utc(iso).tz(tz);
  if (!start.isValid()) return '';
  const end = start.add(hours, 'hour');
  return `${start.format('HH:mm')} → ${end.format('HH:mm')}`;
};

type TimeClocksData = Array<{
  RecordDate?: string;
  Clocks?: Array<{
    ID?: string;
    Name?: string;
    Title?: string;
    Spend?: number;
    Domain?: number;
    Selected?: boolean;
    Details?: Array<{
      ID?: string;
      Name?: string;
      Title?: string;
      Spend?: number;
      Selected?: boolean;
    }>;
  }>;
}>;

export const setInitialFormData = (data: TimeClocksData | undefined): SuggestionGroupForm[] =>
  (data ?? []).map((group) => ({
    RecordDate: group.RecordDate,
    Clocks: group.Clocks?.map((clock) => ({
      ID: clock.ID,
      Selected: clock.Selected ?? false,
      Name: clock.Name,
      Title: clock.Title,
      Domain: clock.Domain,
      Spend: clock.Spend,
      Details: clock.Details?.map((detail) => ({
        ID: detail.ID,
        Selected: detail.Selected ?? false,
        Name: detail.Name,
        Title: detail.Title,
        Spend: detail.Spend,
      })),
    })),
  }));

export const getSelectedTrueObjects = (data: SuggestionGroupForm[]): SuggestionClockForm[] => {
  const selected: SuggestionClockForm[] = [];
  data?.forEach((group) => {
    group.Clocks?.forEach((clock) => {
      if (!clock.Details?.length) {
        if (clock.Selected) selected.push(clock);
        return;
      }
      clock.Details?.forEach((detail) => {
        if (detail.Selected) selected.push(detail as SuggestionClockForm);
      });
      const isEveryChildSelected = clock.Details.every((detail) => detail.Selected);
      if (!isEveryChildSelected) {
        clock.Selected = false;
      }
      if (clock.Selected) {
        clock.Details.forEach((detail) => (detail.Selected = true));
      }
    });
  });
  return selected;
};
