import { defineStore } from 'pinia';

import dayjs from 'dayjs';

import { TimesheetApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  TimeClockGroupViewModel,
  TimeEntryGroupViewModel,
  TimeEntryQueryViewModel,
  TimeProjectViewModel,
  TimeTagViewModel,
  TimeTaskViewModel,
} from '@/client';

// TODO: Remove mock data when backend is ready
const USE_MOCK_DATA = false;

const MOCK_TIME_ENTRIES: TimeEntryGroupViewModel[] = [
  {
    RecordDate: dayjs().format('DD.MM.YYYY'),
    Entries: [
      {
        ID: '1',
        DateRangeText: '09:00 - 12:30',
        TimeSpanText: '03:30',
        RecordDate: dayjs().format('DD.MM.YYYY'),
        Task: { ID: 't1', Name: 'Frontend Development' },
        Project: { ID: 'p1', Name: 'Flexytime' },
        Tags: [
          { ID: 'tag1', Name: 'Development' },
          { ID: 'tag2', Name: 'Vue.js' },
        ],
        Ranges: [
          { ID: 'r1', EntryId: '1', DateRangeText: '09:00 - 10:30', TimeSpanText: '01:30' },
          { ID: 'r2', EntryId: '1', DateRangeText: '11:00 - 12:30', TimeSpanText: '01:30' },
        ],
      },
      {
        ID: '2',
        DateRangeText: '14:00 - 16:00',
        TimeSpanText: '02:00',
        RecordDate: dayjs().format('DD.MM.YYYY'),
        Task: { ID: 't2', Name: 'Code Review' },
        Project: { ID: 'p1', Name: 'Flexytime' },
        Tags: [{ ID: 'tag3', Name: 'Review' }],
        Ranges: [],
      },
    ],
  },
  {
    RecordDate: dayjs().subtract(1, 'day').format('DD.MM.YYYY'),
    Entries: [
      {
        ID: '3',
        DateRangeText: '10:00 - 18:00',
        TimeSpanText: '08:00',
        RecordDate: dayjs().subtract(1, 'day').format('DD.MM.YYYY'),
        Task: { ID: 't3', Name: 'API Integration' },
        Project: { ID: 'p2', Name: 'Backend Services' },
        Tags: [
          { ID: 'tag1', Name: 'Development' },
          { ID: 'tag4', Name: 'API' },
        ],
        Ranges: [],
      },
    ],
  },
];

const MOCK_TIME_CLOCKS: TimeClockGroupViewModel[] = [
  {
    RecordDate: dayjs().format('DD.MM.YYYY'),
    RecordTime: '08:00',
    Clocks: [
      {
        ID: 'c1',
        Selected: false,
        Spend: 1800,
        Name: 'VS Code',
        Title: 'timeEntries.ts',
        Domain: 4,
        Details: [],
      },
      {
        ID: 'c2',
        Selected: true,
        Spend: 2400,
        Name: 'Chrome',
        Title: 'localhost:3001',
        Domain: 4,
        Details: [
          { ID: 'd1', Spend: 1200, Name: 'Flexytime', Title: 'Dashboard', Selected: false },
          { ID: 'd2', Spend: 1200, Name: 'Flexytime', Title: 'Time Entries', Selected: false },
        ],
      },
    ],
  },
  {
    RecordDate: dayjs().format('DD.MM.YYYY'),
    RecordTime: '09:00',
    Clocks: [
      {
        ID: 'c3',
        Selected: false,
        Spend: 3600,
        Name: 'Microsoft Teams',
        Title: 'Daily Standup',
        Domain: 3,
        Details: [],
      },
    ],
  },
  {
    RecordDate: dayjs().format('DD.MM.YYYY'),
    RecordTime: '10:00',
    Clocks: [
      {
        ID: 'c4',
        Selected: false,
        Spend: 5400,
        Name: 'Excel',
        Title: 'Report_2024.xlsx',
        Domain: 4,
        Details: [],
      },
      {
        ID: 'c5',
        Selected: false,
        Spend: 1800,
        Name: 'Slack',
        Title: '#development',
        Domain: 3,
        Details: [],
      },
    ],
  },
];

interface State {
  timeEntries: TimeEntryGroupViewModel[];
  timeClocks: TimeClockGroupViewModel[];
  tasks: TimeTaskViewModel[];
  projects: TimeProjectViewModel[];
  tags: TimeTagViewModel[];
  query: TimeEntryQueryViewModel;
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
    query: {
      RecordDate: dayjs().format('DD.MM.YYYY'),
      Hours: 1,
    },
    loading: false,
    optionsLoading: false,
    error: null,
  }),

  getters: {
    getTimeEntries: (state): TimeEntryGroupViewModel[] => state.timeEntries,
    getTimeClocks: (state): TimeClockGroupViewModel[] => state.timeClocks,
    getQuery: (state): TimeEntryQueryViewModel => state.query,
    isLoading: (state): boolean => state.loading,
    // Options getters
    taskNames: (state): string[] => state.tasks.map((t) => t.Name ?? '').filter(Boolean),
    projectOptions: (state): Array<{ name: string; value: string }> =>
      state.projects.map((p) => ({ name: p.Name ?? '', value: p.ID ?? '' })),
    tagOptions: (state): Array<{ name: string; value: string }> =>
      state.tags.map((t) => ({ name: t.Name ?? '', value: t.ID ?? '' })),
  },

  actions: {
    setQuery(query: Partial<TimeEntryQueryViewModel>) {
      this.query = { ...this.query, ...query };
    },

    async fetchTimeEntries(query?: TimeEntryQueryViewModel): Promise<TimeEntryGroupViewModel[]> {
      try {
        this.loading = true;
        this.error = null;

        // TODO: Remove mock data when backend is ready
        if (USE_MOCK_DATA) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          this.timeEntries = MOCK_TIME_ENTRIES;
          return MOCK_TIME_ENTRIES;
        }

        const requestQuery = {
          ...this.query,
          ...query,
          EntryId: query?.EntryId ?? this.query.EntryId ?? '',
          MemberId: '',
        };
        const data = await TimesheetApiService.timesheetApiGetTimeEntries(
          requestQuery as unknown as TimeEntryQueryViewModel,
        );

        this.timeEntries = data;
        return data;
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch time entries';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchTimeClocks(query?: TimeEntryQueryViewModel): Promise<TimeClockGroupViewModel[]> {
      try {
        this.loading = true;
        this.error = null;

        // TODO: Remove mock data when backend is ready
        if (USE_MOCK_DATA) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          this.timeClocks = MOCK_TIME_CLOCKS;
          return MOCK_TIME_CLOCKS;
        }

        const requestQuery = {
          ...this.query,
          ...query,
          EntryId: query?.EntryId ?? this.query.EntryId ?? '',
          MemberId: '',
        };
        const data = await TimesheetApiService.timesheetApiGetTimeClocks(
          requestQuery as unknown as TimeEntryQueryViewModel,
        );

        this.timeClocks = data;
        return data;
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch time clocks';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async selectTimeEntry(entryId: string) {
      const updatedQuery: TimeEntryQueryViewModel = {
        ...this.query,
        EntryId: entryId,
      };
      this.setQuery(updatedQuery);
      await this.fetchTimeClocks(updatedQuery);
    },

    clearTimeClocks() {
      this.timeClocks = [];
      if (this.query.EntryId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { EntryId: _, ...rest } = this.query;
        this.query = rest as TimeEntryQueryViewModel;
      }
    },

    async fetchOptions() {
      try {
        this.optionsLoading = true;
        const [projects, tags, tasks] = await Promise.all([
          TimesheetApiService.timesheetApiGetProjects(),
          TimesheetApiService.timesheetApiGetTags(),
          TimesheetApiService.timesheetApiGetTasks(),
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
      // Check if task already exists
      const existingTask = this.tasks.find(
        (t) => t.Name?.toLowerCase() === taskName.toLowerCase(),
      );
      if (existingTask) {
        return existingTask;
      }

      try {
        await TimesheetApiService.timesheetApiSaveTask({ Name: taskName });
        // Add to local list
        const newTask: TimeTaskViewModel = { Name: taskName };
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

    async deleteTimeEntry(entryId: string): Promise<boolean> {
      try {
        await TimesheetApiService.timesheetApiDeleteTimeEntry({ ID: entryId });
        // Refresh the list after deletion
        await this.fetchTimeEntries();
        return true;
      } catch (err: unknown) {
        console.error('Failed to delete time entry:', err);
        throw err;
      }
    },

    async deleteTimeEntryRange(rangeId: string): Promise<boolean> {
      try {
        await TimesheetApiService.timesheetApiDeleteTimeEntryRange({ ID: rangeId });
        // Refresh the list after deletion
        await this.fetchTimeEntries();
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
      this.query = {
        RecordDate: dayjs().format('DD.MM.YYYY'),
        Hours: 1,
      };
      this.loading = false;
      this.optionsLoading = false;
      this.error = null;
    },
  },
});
