import { defineStore } from 'pinia';

import dayjs from 'dayjs';

/**
 * Calendar-date payload helper — collapses any Date instance to the
 * UTC-midnight ISO 8601 string `TimeEntryQueryDto.StartDate/EndDate`
 * expects (Rule 13 calendar-date bucket, `feedback_iso-date-wire-format`).
 * `Date#toISOString()` would emit the local wall-clock as UTC and silently
 * shift the bucket — truncate to the calendar day explicitly via Date.UTC.
 */
function toUtcMidnightIso(d: Date): string {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString();
}

import { TimesheetService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  TimeClockGroupViewModel,
  TimeEntryGroupViewModel,
  TimeProjectViewModel,
  TimeTagViewModel,
  TimeTaskViewModel,
} from '@/client';

interface State {
  timeEntries: TimeEntryGroupViewModel[];
  timeClocks: TimeClockGroupViewModel[];
  tasks: TimeTaskViewModel[];
  projects: TimeProjectViewModel[];
  tags: TimeTagViewModel[];
  /**
   * Tracks the last range used by `fetchTimeEntriesRange` /
   * `fetchTimeClocksRange` so post-save hooks (EnterTime submit) can
   * refresh the currently visible window instead of falling back to
   * today-only. `null` when the page hasn't fetched yet.
   */
  lastEntriesRange: { start: Date; end: Date } | null;
  lastClocksRange: { start: Date; end: Date; hours: number } | null;
  loading: boolean;
  optionsLoading: boolean;
  error: string | null;
}

export const useTimesheetsTimeEntriesStore = defineStore(EStoreNames.TIMESHEETS_TIME_ENTIES, {
  state: (): State => ({
    timeEntries: [],
    timeClocks: [],
    tasks: [],
    projects: [],
    tags: [],
    lastEntriesRange: null,
    lastClocksRange: null,
    loading: false,
    optionsLoading: false,
    error: null,
  }),

  getters: {
    getTimeEntries: (state): TimeEntryGroupViewModel[] => state.timeEntries,
    getTimeClocks: (state): TimeClockGroupViewModel[] => state.timeClocks,
    isLoading: (state): boolean => state.loading,
    taskNames: (state): string[] => state.tasks.map((t) => t.Name ?? '').filter(Boolean),
    taskOptions: (state): Array<{ name: string; value: string }> =>
      state.tasks.map((t) => ({ name: t.Name ?? '', value: t.ID ?? '' })),
    projectOptions: (state): Array<{ name: string; value: string }> =>
      state.projects.map((p) => ({ name: p.Name ?? '', value: p.ID ?? '' })),
    tagOptions: (state): Array<{ name: string; value: string }> =>
      state.tags.map((t) => ({ name: t.Name ?? '', value: t.ID ?? '' })),
  },

  actions: {
    /**
     * Range fetch for the redesigned Time Entries page. Single round-trip
     * since the BE was reshaped (RESHAPED-v2, ISO 8601 calendar range — see
     * `feedback_iso-date-wire-format`); BE returns groups already DESC-ordered
     * by RecordDate so the FE shows the most recent day (typically today)
     * first.
     */
    async fetchTimeEntriesRange(startDate: Date, endDate: Date): Promise<TimeEntryGroupViewModel[]> {
      try {
        this.loading = true;
        this.error = null;
        const data = await TimesheetService.timesheetControllerGetEntries({
          StartDate: toUtcMidnightIso(startDate),
          EndDate: toUtcMidnightIso(endDate),
        });
        this.timeEntries = data;
        this.lastEntriesRange = { start: startDate, end: endDate };
        return data;
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch time entries';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /** Mirror of {@link fetchTimeEntriesRange} for the Unclassified clocks tab. */
    async fetchTimeClocksRange(
      startDate: Date,
      endDate: Date,
      hours = 24,
    ): Promise<TimeClockGroupViewModel[]> {
      try {
        this.loading = true;
        this.error = null;
        const data = await TimesheetService.timesheetControllerGetClocks({
          StartDate: toUtcMidnightIso(startDate),
          EndDate: toUtcMidnightIso(endDate),
          Hours: hours,
        });
        this.timeClocks = data;
        this.lastClocksRange = { start: startDate, end: endDate, hours };
        return data;
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch time clocks';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Re-run the last range fetch. Used by EnterTime.vue after a successful
     * save so the entries list reflects the newly-added entry without
     * forcing the user to re-pick the range. Falls back to a today fetch
     * when no range has been recorded (first-load case).
     */
    async refreshLastEntries(): Promise<void> {
      if (this.lastEntriesRange) {
        await this.fetchTimeEntriesRange(
          this.lastEntriesRange.start,
          this.lastEntriesRange.end,
        );
        return;
      }
      const today = dayjs().toDate();
      await this.fetchTimeEntriesRange(today, today);
    },


    clearTimeClocks() {
      this.timeClocks = [];
      this.lastClocksRange = null;
    },

    async fetchOptions() {
      try {
        this.optionsLoading = true;
        const [projects, tags, tasks] = await Promise.all([
          TimesheetService.timesheetControllerGetProjects(),
          TimesheetService.timesheetControllerGetTags(),
          TimesheetService.timesheetControllerGetTasks(),
        ]);

        this.projects = projects;
        this.tags = tags;
        this.tasks = tasks;
      } catch (err: unknown) {
        console.error('Failed to fetch options:', err);
      } finally {
        this.optionsLoading = false;
      }
    },

    async saveTask(taskName: string): Promise<TimeTaskViewModel | null> {
      const existingTask = this.tasks.find(
        (t) => t.Name?.toLowerCase() === taskName.toLowerCase(),
      );
      if (existingTask) {
        return existingTask;
      }

      try {
        const response = await TimesheetService.timesheetControllerSaveTask({ Name: taskName });
        const dto = (response as unknown as { DTO?: { ID?: string; Name?: string } }).DTO;
        const newTask: TimeTaskViewModel = { ID: dto?.ID, Name: dto?.Name ?? taskName };
        this.tasks.push(newTask);
        return newTask;
      } catch (err: unknown) {
        console.error('Failed to save task:', err);
        return null;
      }
    },

    getTaskByName(taskName: string): TimeTaskViewModel | undefined {
      return this.tasks.find((t) => t.Name?.toLowerCase() === taskName.toLowerCase());
    },

    async saveProject(projectName: string): Promise<TimeProjectViewModel | null> {
      const existingProject = this.projects.find(
        (p) => p.Name?.toLowerCase() === projectName.toLowerCase(),
      );
      if (existingProject) {
        return existingProject;
      }

      try {
        await TimesheetService.timesheetControllerSaveProject({ Name: projectName });
        const projects = await TimesheetService.timesheetControllerGetProjects();
        this.projects = projects;
        return this.projects.find((p) => p.Name?.toLowerCase() === projectName.toLowerCase()) ?? null;
      } catch (err: unknown) {
        console.error('Failed to save project:', err);
        throw err;
      }
    },

    async saveTag(tagName: string): Promise<TimeTagViewModel | null> {
      const existingTag = this.tags.find(
        (t) => t.Name?.toLowerCase() === tagName.toLowerCase(),
      );
      if (existingTag) {
        return existingTag;
      }

      try {
        await TimesheetService.timesheetControllerSaveTag({ Name: tagName });
        const tags = await TimesheetService.timesheetControllerGetTags();
        this.tags = tags;
        return this.tags.find((t) => t.Name?.toLowerCase() === tagName.toLowerCase()) ?? null;
      } catch (err: unknown) {
        console.error('Failed to save tag:', err);
        throw err;
      }
    },

    async deleteTimeEntry(entryId: string): Promise<boolean> {
      try {
        await TimesheetService.timesheetControllerDeleteTimeEntry({ ID: entryId });
        await this.refreshLastEntries();
        return true;
      } catch (err: unknown) {
        console.error('Failed to delete time entry:', err);
        throw err;
      }
    },

    async deleteTimeEntryRange(rangeId: string): Promise<boolean> {
      try {
        await TimesheetService.timesheetControllerDeleteTimeEntryRange({ ID: rangeId });
        await this.refreshLastEntries();
        return true;
      } catch (err: unknown) {
        console.error('Failed to delete time entry range:', err);
        throw err;
      }
    },

    resetStore() {
      this.timeEntries = [];
      this.timeClocks = [];
      this.tasks = [];
      this.projects = [];
      this.tags = [];
      this.lastEntriesRange = null;
      this.lastClocksRange = null;
      this.loading = false;
      this.optionsLoading = false;
      this.error = null;
    },
  },
});
