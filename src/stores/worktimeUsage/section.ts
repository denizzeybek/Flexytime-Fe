

import { defineStore } from 'pinia';

import { ClockService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  ClockDistribution,
  ClockEmployeeRequestDto,
  ClockEmployeeResponse,
  ClockProductivityDay,
  ClockSectionRequestDto,
  ClockSectionResponse,
  ClockTeamSummary,
  WebClockModifyDto,
} from '@/client';

interface State {
  section: ClockSectionResponse | null;
  employee: ClockEmployeeResponse | null;
  isLoading: boolean;
}

export const useSectionsStore = defineStore(EStoreNames.WORKTIME_USAGE_SECTION, {
  state: (): State => ({
    section: null,
    employee: null,
    isLoading: false,
  }),
  getters: {
    Individuals: (state) => state.section?.Individuals ?? [],
    Teams: (state) => (state.section?.Teams ?? []) as ClockTeamSummary[],
    SectionSummary: (state) => state.section?.Summary ?? null,
    SectionDistribution: (state): ClockDistribution[] => state.section?.Distribution ?? [],
    SectionProductivityGraph: (state): ClockProductivityDay[] =>
      state.section?.ProductivityGraph ?? [],
    EmployeeSummary: (state) => state.employee?.Summary ?? null,
    EmployeeDistribution: (state): ClockDistribution[] => state.employee?.Distribution ?? [],
    EmployeeProductivityGraph: (state): ClockProductivityDay[] =>
      state.employee?.ProductivityGraph ?? [],
    Manuals: (state) => state.employee?.Manuals ?? [],
    WebClocks: (state) => state.employee?.WebClocks ?? [],
  },
  actions: {
    async filter(payload: ClockSectionRequestDto) {
      this.isLoading = true;
      try {
        const response = await ClockService.clockControllerGetSection(payload);
        this.section = response;
        return response;
      } finally {
        this.isLoading = false;
      }
    },
    async filterSection(payload: ClockSectionRequestDto) {
      return this.filter(payload);
    },
    async filterEmployee(payload: ClockEmployeeRequestDto) {
      this.isLoading = true;
      try {
        const response = await ClockService.clockControllerGetEmployee(payload);
        this.employee = response;
        return response;
      } finally {
        this.isLoading = false;
      }
    },
    async saveWebClock(payload: WebClockModifyDto) {
      return ClockService.clockControllerSaveWebClock(payload);
    },
  },
});
