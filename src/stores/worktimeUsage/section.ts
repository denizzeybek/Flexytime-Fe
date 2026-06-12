/**
 * Legacy `useSectionsStore` retained as a thin v2 shim.
 *
 * The legacy store was a verbatim mirror of `ClockSection2Response` /
 * `EmployeeClockViewModel` (Card / Breadcrumb / Teamset / Model / etc.). v2's
 * RESHAPED contracts dropped those wrappers; the canonical worktime store is
 * now `useWorktimeStore` (worktimeStore.ts), and most call sites should move
 * to it. We keep this shim so the few remaining consumers — currently a couple
 * of layout-level Cards — keep compiling while the worktime UI is refactored
 * tab-by-tab.
 */

import { defineStore } from 'pinia';

import { ClockService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  ClockDistribution,
  ClockEmployeeRequest,
  ClockEmployeeResponse,
  ClockProductivityDay,
  ClockSectionRequest,
  ClockSectionResponse,
  ClockTeamSummary,
  WebClockModifyModel,
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
    async filter(payload: ClockSectionRequest) {
      this.isLoading = true;
      try {
        const response = await ClockService.clockControllerGetSection(payload);
        this.section = response;
        return response;
      } finally {
        this.isLoading = false;
      }
    },
    async filterSection(payload: ClockSectionRequest) {
      return this.filter(payload);
    },
    async filterEmployee(payload: ClockEmployeeRequest) {
      this.isLoading = true;
      try {
        const response = await ClockService.clockControllerGetEmployee(payload);
        this.employee = response;
        return response;
      } finally {
        this.isLoading = false;
      }
    },
    async saveWebClock(payload: WebClockModifyModel) {
      return ClockService.clockControllerSaveWebClock(payload);
    },
  },
});
