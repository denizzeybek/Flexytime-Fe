import { defineStore } from 'pinia';

import dayjs from 'dayjs';

import { TimesheetApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { TimeEntryWeekViewModel } from '@/client';

// isoWeek plugin is extended in @/helpers/utils.ts - this import ensures it's loaded
import '@/helpers/utils';

type EPerspective = 'employee' | 'project';

interface State {
  weekEntries: TimeEntryWeekViewModel[];
  perspective: EPerspective;
  startDate: Date;
  endDate: Date;
  isLoading: boolean;
}

export const useTimesheetsTimeManagementsStore = defineStore(
  EStoreNames.TIMESHEETS_TIME_MANAGEMENTS,
  {
    state: (): State => ({
      weekEntries: [],
      perspective: 'employee',
      startDate: dayjs().startOf('isoWeek').toDate(),
      endDate: dayjs().startOf('isoWeek').add(6, 'day').toDate(),
      isLoading: false,
    }),
    getters: {
      dateRange: (state): Date[] => [state.startDate, state.endDate],
      formattedStartDate: (state): string => dayjs(state.startDate).format('DD.MM.YYYY'),
      dateRangeText: (state): string => {
        const start = dayjs(state.startDate).format('DD.MM.YYYY');
        const end = dayjs(state.endDate).format('DD.MM.YYYY');
        return `${start} - ${end}`;
      },
      dayHeaders: (state): { title: string; subTitle: string }[] => {
        const headers: { title: string; subTitle: string }[] = [];
        for (let i = 0; i < 7; i++) {
          const day = dayjs(state.startDate).add(i, 'day');
          headers.push({
            title: day.format('DD MMM'),
            subTitle: day.format('dddd'),
          });
        }
        return headers;
      },
    },
    actions: {
      async fetchWeekEntries() {
        this.isLoading = true;
        try {
          const response = await TimesheetApiService.timesheetApiGetTimeWeekEntries({
            StartDate: this.formattedStartDate,
            Perspective: this.perspective,
          });
          this.weekEntries = response;
        } finally {
          this.isLoading = false;
        }
      },
      setPerspective(perspective: EPerspective) {
        this.perspective = perspective;
        this.fetchWeekEntries();
      },
      setDateRange(dates: Date[]) {
        if (dates && dates.length >= 1) {
          const start = dayjs(dates[0]).startOf('isoWeek');
          this.startDate = start.toDate();
          this.endDate = start.add(6, 'day').toDate();
          this.fetchWeekEntries();
        }
      },
      goToPreviousWeek() {
        const newStart = dayjs(this.startDate).subtract(7, 'day');
        this.startDate = newStart.toDate();
        this.endDate = newStart.add(6, 'day').toDate();
        this.fetchWeekEntries();
      },
      goToNextWeek() {
        const newStart = dayjs(this.startDate).add(7, 'day');
        this.startDate = newStart.toDate();
        this.endDate = newStart.add(6, 'day').toDate();
        this.fetchWeekEntries();
      },
    },
  },
);
