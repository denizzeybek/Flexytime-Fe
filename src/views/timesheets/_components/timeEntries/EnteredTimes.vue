<template>
  <div class="flex flex-col gap-6">
    <template v-if="timeEntriesStore.loading">
      <div v-for="i in 3" :key="i" class="flex flex-col gap-4">
        <Skeleton height="1.5rem" width="8rem" class="mx-auto" />
        <div class="bg-surface-primary rounded-2xl border border-border-secondary dark:border-border-primary p-5 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-3 flex-1">
              <Skeleton height="1.25rem" width="60%" />
              <div class="flex gap-2">
                <Skeleton height="1.5rem" width="5rem" borderRadius="1rem" />
                <Skeleton height="1.5rem" width="4rem" borderRadius="1rem" />
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <Skeleton height="1rem" width="6rem" />
              <Skeleton height="1.5rem" width="4rem" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-for="group in timeEntriesStore.timeEntries" :key="group.RecordDate" class="flex flex-col gap-4">
        <div class="w-full flex items-center justify-center">
          <button
            type="button"
            class="flex items-center justify-between gap-3 w-80 px-5 py-2.5 bg-surface-primary rounded-full shadow-sm border border-border-secondary dark:border-border-primary hover:border-f-primary/30 transition-colors"
            @click="toggleDay(group.RecordDate)"
          >
            <div class="flex items-center gap-2 min-w-0">
              <i class="pi pi-calendar text-f-primary text-sm" />
              <span class="text-sm font-semibold text-content-secondary">{{ formatDateLabel(group.RecordDate) }}</span>
              <template v-if="groupTotalSeconds(group) > 0">
                <span class="text-content-tertiary/50">•</span>
                <span class="text-sm text-content-tertiary">
                  {{ t('pages.timesheets.enteredTimes.dailyTotal') }}
                  <span class="font-semibold text-f-primary ml-1">{{ fmtTimeSpan(groupTotalSeconds(group)) }}</span>
                </span>
              </template>
            </div>
            <i
              class="pi text-content-tertiary text-xs transition-transform duration-200 flex-shrink-0"
              :class="isDayExpanded(group.RecordDate) ? 'pi-chevron-down' : 'pi-chevron-right'"
            />
          </button>
        </div>    

        <template v-if="isDayExpanded(group.RecordDate)">
          <NoDataState
            v-if="!group.Entries?.length"
            :message="t('pages.timesheets.enteredTimes.emptyState.title')"
          />

          <div
            v-for="project in projectsForGroup(group)"
            v-else
            :key="`${group.RecordDate}-${project.projectId}`"
            class="group bg-surface-primary rounded-2xl border border-border-secondary dark:border-border-primary hover:border-f-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div class="flex">
              <div class="w-1.5 bg-gradient-to-b from-f-primary to-f-primary/60" />

              <div class="flex-1 p-5">
                <div class="flex items-start justify-between gap-4 mb-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-f-primary/10 flex items-center justify-center flex-shrink-0">
                      <i class="pi pi-folder text-f-primary" />
                    </div>
                    <h4 class="font-semibold text-content-primary truncate">{{ project.projectName }}</h4>
                  </div>
                  <div class="flex flex-col items-end gap-1 flex-shrink-0">
                    <div class="text-2xl font-bold text-f-primary whitespace-nowrap">
                      {{ fmtTimeSpan(project.totalSeconds) }}
                    </div>
                    <div class="text-sm text-content-tertiary flex items-center gap-1.5">
                      <i class="pi pi-clock text-xs" />
                      {{ projectDateRange(project) }}
                    </div>
                  </div>
                </div>

                <div class="space-y-2 pl-4 border-l-2 border-f-primary/20">
                  <div
                    v-for="session in project.sessions"
                    :key="session.rangeId"
                    class="group/session flex flex-col gap-2 py-2.5 px-3 bg-surface-tertiary dark:bg-surface-secondary hover:bg-surface-secondary dark:hover:bg-surface-tertiary rounded-lg transition-colors"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-2 min-w-0 flex-wrap">
                        <span class="flex items-center gap-1.5 text-sm font-medium text-content-primary">
                          <i class="pi pi-briefcase text-xs text-f-primary" />
                          {{ session.taskName }}
                        </span>
                        <span class="text-xs text-content-tertiary flex items-center gap-1.5">
                          <i class="pi pi-clock text-[10px]" />
                          {{ fmtRange(session.start, session.end) }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2 flex-shrink-0">
                        <span class="text-sm font-bold text-content-primary whitespace-nowrap">{{ fmtTimeSpan(session.seconds) }}</span>
                        <Button
                          v-tooltip.left="t('common.buttons.delete')"
                          :icon="deletingRangeId === session.rangeId ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"
                          severity="danger"
                          text
                          rounded
                          size="small"
                          class="!w-7 !h-7 opacity-0 group-hover/session:opacity-100 transition-opacity"
                          :disabled="deletingRangeId === session.rangeId"
                          @click.stop="handleDeleteRange(session.rangeId, session.taskName)"
                        />
                      </div>
                    </div>
                    <div v-if="session.tags.length" class="flex flex-wrap items-center gap-1.5 pl-5">
                      <Tag
                        v-for="tag in session.tags"
                        :key="tag.ID"
                        :value="tag.Name"
                        class="!text-[10px] !px-2 !py-0.5"
                        :style="tagChipStyle(tag.Color)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import { useConfirm } from 'primevue/useconfirm';

import NoDataState from '@/components/common/NoDataState.vue';
import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/profile/profile';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

dayjs.extend(utc);
dayjs.extend(timezone);

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const confirm = useConfirm();
const timeEntriesStore = useTimesheetsTimeEntriesStore();
const profileStore = useProfileStore();

interface SessionTag {
  ID: string;
  Name: string;
  Color?: string;
}

interface SessionRow {
  rangeId: string;
  entryId: string;
  taskName: string;
  tags: SessionTag[];
  start: string;
  end: string;
  seconds: number;
}

const DEFAULT_TAG_COLOR = '#64748b';

const tagChipStyle = (color?: string) => ({
  background: color ?? DEFAULT_TAG_COLOR,
  color: '#ffffff',
  border: 'none',
});

interface ProjectRollup {
  projectId: string;
  projectName: string;
  totalSeconds: number;
  startTimestamp: number;
  endTimestamp: number;
  sessions: SessionRow[];
}

/**
 * Format a UTC ISO instant in the company-canonical timezone (Rule 13 — BE
 * ships UTC instants, FE renders in `me.timezone`).
 */
const fmtInZone = (iso: string | undefined, pattern: string): string => {
  if (!iso) return '';
  const tz = profileStore.TimeZone || dayjs.tz.guess();
  return dayjs.utc(iso).tz(tz).format(pattern);
};

const fmtTimeSpan = (seconds: number | undefined): string => {
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

const fmtRange = (startIso: string | undefined, endIso: string | undefined): string => {
  if (!startIso || !endIso) return '';
  const head = fmtInZone(startIso, 'DD.MM.YYYY HH:mm:ss');
  const tail = fmtInZone(endIso, 'HH:mm:ss');
  return `${head} - ${tail}`;
};

const groupTotalSeconds = (group: { Entries?: Array<{ Seconds?: number; Ranges?: Array<{ Seconds?: number }> }> }): number => {
  const entries = group.Entries ?? [];
  return entries.reduce((acc, entry) => {
    if (typeof entry.Seconds === 'number') return acc + entry.Seconds;
    const ranges = entry.Ranges ?? [];
    return acc + ranges.reduce((rAcc, r) => rAcc + (r.Seconds ?? 0), 0);
  }, 0);
};

interface DayGroup {
  Entries?: Array<{
    ID?: string;
    Task?: { Name?: string };
    Project?: { ID?: string; Name?: string };
    Tags?: Array<{ ID?: string; Name?: string; Color?: string }>;
    Ranges?: Array<{ ID?: string; Start?: string; End?: string; Seconds?: number }>;
  }>;
}

/**
 * Re-pivot a day's entries by Project: each project becomes one card; every
 * range under any entry with that project becomes a "session" row. Sessions
 * carry the originating entry's Task name + Tags so the user sees what work
 * was billed to the project at a glance.
 */
const projectsForGroup = (group: DayGroup): ProjectRollup[] => {
  const map = new Map<string, ProjectRollup>();
  const entries = group.Entries ?? [];

  for (const entry of entries) {
    const projectId = entry.Project?.ID ?? '__no_project';
    const projectName = entry.Project?.Name ?? t('pages.timesheets.enteredTimes.untitled');

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
      .filter((tag): tag is { ID: string; Name: string; Color?: string } => Boolean(tag?.ID && tag?.Name))
      .map((tag) => ({ ID: tag.ID, Name: tag.Name, ...(tag.Color && { Color: tag.Color }) }));

    for (const range of entry.Ranges ?? []) {
      const sec = range.Seconds ?? 0;
      pg.sessions.push({
        rangeId: range.ID ?? '',
        entryId: entry.ID ?? '',
        taskName: entry.Task?.Name ?? t('pages.timesheets.enteredTimes.untitled'),
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

const projectDateRange = (pg: ProjectRollup): string => {
  if (pg.startTimestamp === Number.POSITIVE_INFINITY) return '';
  return fmtRange(
    new Date(pg.startTimestamp).toISOString(),
    new Date(pg.endTimestamp).toISOString(),
  );
};

const deletingRangeId = ref<string | null>(null);

const collapsedDays = ref<Set<string>>(new Set());

const isDayExpanded = (recordDate: string | undefined): boolean =>
  !collapsedDays.value.has(recordDate ?? '');

const toggleDay = (recordDate: string | undefined): void => {
  const key = recordDate ?? '';
  const next = new Set(collapsedDays.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  collapsedDays.value = next;
};

const formatDateLabel = (dateStr?: string): string => {
  if (!dateStr) return '';

  const tz = profileStore.TimeZone || dayjs.tz.guess();
  const date = dayjs.utc(dateStr).tz(tz);
  if (!date.isValid()) return '';
  const today = dayjs().tz(tz);
  const yesterday = today.subtract(1, 'day');

  if (date.isSame(today, 'day')) {
    return t('common.dates.today');
  } else if (date.isSame(yesterday, 'day')) {
    return t('common.dates.yesterday');
  }

  return date.format('DD MMMM YYYY');
};

const handleDeleteRange = (rangeId: string, taskName?: string) => {
  if (!rangeId) return;
  confirm.require({
    message: t('pages.timesheets.enteredTimes.deleteRangeConfirm.message', { task: taskName || t('pages.timesheets.enteredTimes.untitled') }),
    header: t('pages.timesheets.enteredTimes.deleteRangeConfirm.header'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        deletingRangeId.value = rangeId;
        await timeEntriesStore.deleteTimeEntryRange(rangeId);
        showSuccessMessage(t('pages.timesheets.enteredTimes.deleteRangeConfirm.success'));
      } catch (error) {
        showErrorMessage(error as Error);
      } finally {
        deletingRangeId.value = null;
      }
    },
  });
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
