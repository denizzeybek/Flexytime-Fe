import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TAG_COLOR = '#64748b';

export interface SessionTag {
  ID: string;
  Name: string;
  Color?: string;
}

export interface SessionRow {
  rangeId: string;
  entryId: string;
  taskName: string;
  tags: SessionTag[];
  start: string;
  end: string;
  seconds: number;
}

export interface ProjectRollup {
  projectId: string;
  projectName: string;
  totalSeconds: number;
  startTimestamp: number;
  endTimestamp: number;
  sessions: SessionRow[];
}

export interface DayGroup {
  Entries?: Array<{
    ID?: string;
    Task?: { Name?: string };
    Project?: { ID?: string; Name?: string };
    Tags?: Array<{ ID?: string; Name?: string; Color?: string }>;
    Ranges?: Array<{ ID?: string; Start?: string; End?: string; Seconds?: number }>;
  }>;
}

const resolveZone = (storedZone: string | undefined): string =>
  storedZone || dayjs.tz.guess();

export const tagChipStyle = (color?: string) => ({
  background: color ?? DEFAULT_TAG_COLOR,
  color: '#ffffff',
  border: 'none',
});

export const fmtInZone = (
  iso: string | undefined,
  pattern: string,
  zone: string | undefined,
): string => {
  if (!iso) return '';
  return dayjs.utc(iso).tz(resolveZone(zone)).format(pattern);
};

export const fmtTimeSpan = (seconds: number | undefined): string => {
  const s = Math.max(0, Math.floor(seconds ?? 0));
  if (s === 0) return '0s';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}min`);
  if (sec > 0) parts.push(`${sec}s`);
  return parts.join(' ');
};

export const fmtRange = (
  startIso: string | undefined,
  endIso: string | undefined,
  zone: string | undefined,
): string => {
  if (!startIso || !endIso) return '';
  const head = fmtInZone(startIso, 'DD.MM.YYYY HH:mm:ss', zone);
  const tail = fmtInZone(endIso, 'HH:mm:ss', zone);
  return `${head} - ${tail}`;
};

export const groupTotalSeconds = (
  group: { Entries?: Array<{ Seconds?: number; Ranges?: Array<{ Seconds?: number }> }> },
): number => {
  const entries = group.Entries ?? [];
  return entries.reduce((acc, entry) => {
    if (typeof entry.Seconds === 'number') return acc + entry.Seconds;
    const ranges = entry.Ranges ?? [];
    return acc + ranges.reduce((rAcc, r) => rAcc + (r.Seconds ?? 0), 0);
  }, 0);
};

export const projectsForGroup = (
  group: DayGroup,
  fallbackName: string,
): ProjectRollup[] => {
  const map = new Map<string, ProjectRollup>();
  const entries = group.Entries ?? [];

  for (const entry of entries) {
    const projectId = entry.Project?.ID ?? '__no_project';
    const projectName = entry.Project?.Name ?? fallbackName;

    let pg = map.get(projectId);
    if (!pg) {
      pg = {
        projectId,
        projectName,
        totalSeconds: 0,
        sessions: [],
        startTimestamp: Number.POSITIVE_INFINITY,
        endTimestamp: Number.NEGATIVE_INFINITY,
      };
      map.set(projectId, pg);
    }

    const tags: SessionTag[] = (entry.Tags ?? [])
      .filter((tag): tag is { ID: string; Name: string; Color?: string } =>
        Boolean(tag?.ID && tag?.Name),
      )
      .map((tag) => ({ ID: tag.ID, Name: tag.Name, ...(tag.Color && { Color: tag.Color }) }));

    for (const range of entry.Ranges ?? []) {
      const sec = range.Seconds ?? 0;
      pg.sessions.push({
        rangeId: range.ID ?? '',
        entryId: entry.ID ?? '',
        taskName: entry.Task?.Name ?? fallbackName,
        tags,
        start: range.Start ?? '',
        end: range.End ?? '',
        seconds: sec,
      });
      pg.totalSeconds += sec;
      if (range.Start) {
        const ts = new Date(range.Start).getTime();
        if (!Number.isNaN(ts) && ts < pg.startTimestamp) pg.startTimestamp = ts;
      }
      if (range.End) {
        const ts = new Date(range.End).getTime();
        if (!Number.isNaN(ts) && ts > pg.endTimestamp) pg.endTimestamp = ts;
      }
    }
  }

  for (const pg of map.values()) {
    pg.sessions.sort((a, b) => {
      const ta = a.start ? new Date(a.start).getTime() : 0;
      const tb = b.start ? new Date(b.start).getTime() : 0;
      return ta - tb;
    });
  }

  return Array.from(map.values()).sort((a, b) => a.startTimestamp - b.startTimestamp);
};

export const projectDateRange = (pg: ProjectRollup, zone: string | undefined): string => {
  if (pg.startTimestamp === Number.POSITIVE_INFINITY) return '';
  return fmtRange(
    new Date(pg.startTimestamp).toISOString(),
    new Date(pg.endTimestamp).toISOString(),
    zone,
  );
};

export const formatDayLabel = (
  dateStr: string | undefined,
  zone: string | undefined,
  labels: { today: string; yesterday: string },
): string => {
  if (!dateStr) return '';
  const resolved = resolveZone(zone);
  const date = dayjs.utc(dateStr).tz(resolved);
  if (!date.isValid()) return '';
  const today = dayjs().tz(resolved);
  const yesterday = today.subtract(1, 'day');
  if (date.isSame(today, 'day')) return labels.today;
  if (date.isSame(yesterday, 'day')) return labels.yesterday;
  return date.format('DD MMMM YYYY');
};
