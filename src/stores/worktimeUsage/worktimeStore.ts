/**
 * Worktime Usage Pinia Store — v2 BE shapes.
 *
 * The legacy `ClockSection2Response.Sections[]` / `Model.Allocations[]` / per-
 * domain `Summary[]` array layouts are gone. v2 returns the clean RESHAPED-v2
 * contracts directly (see docs/worktime-redesign.md):
 *
 *   /clock/section   → ClockSectionResponse   { Summary, Distribution[],
 *                                                WellBeings[], ProductivityGraph[],
 *                                                WellBeingGraph[], Teams[],
 *                                                Individuals[], Company }
 *
 *   /clock/employee  → ClockEmployeeResponse  { Employee, Summary, Distribution[],
 *                                                WellBeings[], ProductivityGraph[],
 *                                                Manuals[], WebClocks[],
 *                                                HasRefreshScheduled, Alerts }
 *
 * This store exposes the v2 responses verbatim and only carries a tiny adapter
 * layer for the legacy tab components that still expect an `IEmployeeResponse`
 * (Card / Breadcrumb / per-domain Summary[] / Distributions[] etc.). The next
 * FE pass should retire `IEmployeeResponse` and consume the v2 shape directly.
 */

import { defineStore } from 'pinia';

import { ClockService } from '@/client';
import { useProfileStore } from '@/stores/profile/profile';

import type {
  ClockDistribution,
  ClockEmployeeRequest,
  ClockEmployeeResponse,
  ClockSectionRequest,
  ClockSectionResponse,
  WebClockModifyModel,
} from '@/client';
import type {
  IBreadcrumb,
  ICard,
  IDistribution,
  IEmployeeResponse,
  IErrorState,
  IGraph,
  ILoadingState,
  ISummary,
} from '@/views/worktimeUsage/_types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface State {
  // Section data (Team/Department view + Individuals list)
  sectionData: ClockSectionResponse | null;

  // Employee data (Individual view) — legacy-shaped tab adapter
  employeeData: IEmployeeResponse | null;

  // Loading states
  loading: ILoadingState;

  // Error states
  error: IErrorState;

  // Last request payloads for caching logic
  lastSectionRequest: ClockSectionRequest | null;
  lastEmployeeRequest: ClockEmployeeRequest | null;
}

/**
 * v2 `Summary` is a single object with the four per-domain seconds; the legacy
 * tab UI iterates an `ISummary[]` keyed by `statisticType`. We expand the
 * v2 object back into the legacy array shape so the existing tab markup keeps
 * rendering until it gets refactored.
 */
function summaryObjectToArray(summary: ClockEmployeeResponse['Summary']): ISummary[] {
  return [
    { id: 'work', statisticType: 'work', time: String(summary.Work ?? 0) },
    { id: 'meeting', statisticType: 'meeting', time: String(summary.Meeting ?? 0) },
    { id: 'leisure', statisticType: 'leisure', time: String(summary.Leisure ?? 0) },
    {
      id: 'unclassified',
      statisticType: 'unclassified',
      time: String(summary.Unclassified ?? 0),
    },
  ];
}

/**
 * v2 `Distribution[]` already mirrors the per-domain tab structure (Domain,
 * Seconds, Cost, Applications). We re-shape only enough fields to keep the
 * legacy `IDistribution` rendering working — the presentational keys
 * (`statisticType`, `time` string, `imgPath`) are filled but Chart/Chart2 are
 * dropped (FE rebuilds the pie from `Applications` directly).
 */
function distributionsToLegacy(distribution: ClockDistribution[]): IDistribution[] {
  return distribution.map((row) => ({
    id: String(row.Domain).toLowerCase(),
    statisticType: String(row.Domain).toLowerCase(),
    time: String(row.Seconds ?? 0),
    Applications: (row.Applications ?? []).map((app) => ({
      imgPath: '',
      title: app.Name ?? '',
      time: String(app.Seconds ?? 0),
    })),
    Chart: [],
  })) as IDistribution[];
}

export const useWorktimeStore = defineStore('worktimeUsage', {
  state: (): State => ({
    sectionData: null,
    employeeData: null,
    loading: {
      section: false,
      employee: false,
    },
    error: {
      section: null,
      employee: null,
    },
    lastSectionRequest: null,
    lastEmployeeRequest: null,
  }),

  getters: {
    getSectionData: (state): ClockSectionResponse | null => state.sectionData,
    getEmployeeData: (state): IEmployeeResponse | null => state.employeeData,

    /** v2: Individuals is at the top level (no Sections[] nesting). */
    getIndividuals: (state) => state.sectionData?.Individuals ?? [],

    /** v2: Teams is at the top level (no Teamset.Teams nesting). */
    getTeams: (state) => state.sectionData?.Teams ?? [],

    /**
     * Legacy-shape adapter views over the v2 ClockSectionResponse so the
     * existing index.vue + BadgeGroup + DistributionTab markup keeps
     * rendering. Mirrors what the employee fetch builds inline.
     */
    sectionSummary: (state): ISummary[] =>
      state.sectionData ? summaryObjectToArray(state.sectionData.Summary) : [],
    sectionDistributions: (state): IDistribution[] =>
      distributionsToLegacy(state.sectionData?.Distribution ?? []),

    isSectionLoading: (state): boolean => state.loading.section,
    isEmployeeLoading: (state): boolean => state.loading.employee,
    isLoading: (state): boolean => state.loading.section || state.loading.employee,
    getSectionError: (state): string | null => state.error.section,
    getEmployeeError: (state): string | null => state.error.employee,
  },

  actions: {
    /**
     * Build Card data from profile — v2 `/clock/employee` no longer returns a
     * Card block; the FE always derives it from the profile.
     */
    buildCardFromProfile(): ICard | null {
      const profileStore = useProfileStore();
      const employee = profileStore.GeneralProfile?.Employee;
      if (!employee) return null;
      return {
        Abbreviation: employee.abbreviation || '',
        Name: employee.fullname || '',
        ImageUrl: employee.imageurl || '',
        Title: employee.title || '',
      };
    },

    buildBreadcrumbFromProfile(): IBreadcrumb[] {
      const profileStore = useProfileStore();
      const employee = profileStore.GeneralProfile?.Employee;
      if (!employee) return [];
      return [
        {
          id: 'employee',
          title: employee.fullname || '',
          path: '/clock',
          isLastElement: true,
        },
      ];
    },

    /**
     * Fetch section data. Endpoint: `/clock/section`. v2: response is the
     * `ClockSectionResponse` directly (no Sections[] wrapper).
     */
    async fetchSectionData(
      payload: ClockSectionRequest,
      force = false,
    ): Promise<ClockSectionResponse | null> {
      if (!force && this.lastSectionRequest && this.sectionData) {
        const isSameRequest =
          this.lastSectionRequest.Date === payload.Date &&
          this.lastSectionRequest.StartDate === payload.StartDate &&
          this.lastSectionRequest.EndDate === payload.EndDate &&
          this.lastSectionRequest.TeamId === payload.TeamId &&
          this.lastSectionRequest.Category === payload.Category;
        if (isSameRequest) return this.sectionData;
      }

      try {
        this.loading.section = true;
        this.error.section = null;
        const response = await ClockService.clockControllerGetSection(payload);
        this.sectionData = response;
        this.lastSectionRequest = { ...payload };
        return response;
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        this.error.section =
          apiErr?.response?.data?.message ?? 'Failed to fetch section data';
        console.error('Error fetching section data:', err);
        return null;
      } finally {
        this.loading.section = false;
      }
    },

    /**
     * Fetch employee data. Endpoint: `/clock/employee`. v2: response is the
     * flat `ClockEmployeeResponse`. We adapt it to the legacy
     * `IEmployeeResponse` shape for the existing tab components.
     */
    async fetchEmployeeData(
      payload: ClockEmployeeRequest,
      force = false,
    ): Promise<IEmployeeResponse | null> {
      // Extract just the ID from MemberId if it contains a full path
      const cleanMemberId = payload.MemberId?.includes('/')
        ? payload.MemberId.split('/').pop() || payload.MemberId
        : payload.MemberId;
      const cleanPayload: ClockEmployeeRequest = { ...payload, MemberId: cleanMemberId };

      if (!force && this.lastEmployeeRequest && this.employeeData) {
        const isSameRequest =
          this.lastEmployeeRequest.Date === cleanPayload.Date &&
          this.lastEmployeeRequest.StartDate === cleanPayload.StartDate &&
          this.lastEmployeeRequest.EndDate === cleanPayload.EndDate &&
          this.lastEmployeeRequest.MemberId === cleanPayload.MemberId &&
          this.lastEmployeeRequest.Category === cleanPayload.Category;
        if (isSameRequest) return this.employeeData;
      }

      try {
        this.loading.employee = true;
        this.error.employee = null;

        const response = await ClockService.clockControllerGetEmployee(cleanPayload);

        const transformed: IEmployeeResponse = {
          Card: this.buildCardFromProfile(),
          Breadcrumb: this.buildBreadcrumbFromProfile(),
          Summary: summaryObjectToArray(response.Summary),
          WellBeings: (response.WellBeings ?? []) as IEmployeeResponse['WellBeings'],
          Distributions: distributionsToLegacy(response.Distribution ?? []),
          Graphs: {} as IGraph, // v2: ProductivityGraph is a raw per-day series; chart datasets dropped (FE rebuilds).
          WebClocks: (response.WebClocks ?? []) as unknown as IEmployeeResponse['WebClocks'],
        };

        this.employeeData = transformed;
        this.lastEmployeeRequest = { ...cleanPayload };
        return transformed;
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        this.error.employee =
          apiErr?.response?.data?.message ?? 'Failed to fetch employee data';
        console.error('Error fetching employee data:', err);
        return null;
      } finally {
        this.loading.employee = false;
      }
    },

    clearSectionData() {
      this.sectionData = null;
      this.lastSectionRequest = null;
      this.error.section = null;
    },
    clearEmployeeData() {
      this.employeeData = null;
      this.lastEmployeeRequest = null;
      this.error.employee = null;
    },
    resetStore() {
      this.sectionData = null;
      this.employeeData = null;
      this.lastSectionRequest = null;
      this.lastEmployeeRequest = null;
      this.loading = { section: false, employee: false };
      this.error = { section: null, employee: null };
    },

    /** Save web clock domain. Endpoint: `/clock/web/save`. */
    async saveWebClock(payload: WebClockModifyModel) {
      return ClockService.clockControllerSaveWebClock(payload);
    },
  },
});
