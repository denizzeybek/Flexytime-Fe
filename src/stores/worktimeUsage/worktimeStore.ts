/**
 * Worktime Usage Pinia Store
 *
 * Manages state and API requests for worktime usage data
 * Caches responses to avoid unnecessary API calls
 */

import { defineStore } from 'pinia';

import { ClockApiService } from '@/client';
import { useProfileStore } from '@/stores/profile/profile';

import type {
  AllocationViewModel,
  BreadCrumbViewModel,
  ClockEmployeeRequest,
  ClockSection2Response,
  ClockSectionRequest,
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
  sectionData: ClockSection2Response | null;

  // Employee data (Individual view)
  employeeData: IEmployeeResponse | null;

  // Loading states
  loading: ILoadingState;

  // Error states
  error: IErrorState;

  // Last request payloads for caching logic
  lastSectionRequest: ClockSectionRequest | null;
  lastEmployeeRequest: ClockEmployeeRequest | null;
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
    /**
     * Get section data (team/department view)
     */
    getSectionData: (state): ClockSection2Response | null => state.sectionData,

    /**
     * Get employee data (individual view)
     */
    getEmployeeData: (state): IEmployeeResponse | null => state.employeeData,

    /**
     * Get individuals list from section data
     * Used for employees list view
     */
    getIndividuals: (state) => state.sectionData?.Individuals || [],

    /**
     * Get teams from section data
     */
    getTeams: (state) => state.sectionData?.Teamset?.Teams || [],

    /**
     * Check if section is loading
     */
    isSectionLoading: (state): boolean => state.loading.section,

    /**
     * Check if employee is loading
     */
    isEmployeeLoading: (state): boolean => state.loading.employee,

    /**
     * Check if any request is loading
     */
    isLoading: (state): boolean => state.loading.section || state.loading.employee,

    /**
     * Get section error
     */
    getSectionError: (state): string | null => state.error.section,

    /**
     * Get employee error
     */
    getEmployeeError: (state): string | null => state.error.employee,
  },

  actions: {
    /**
     * Transform Summary.Allocations to ISummary array
     */
    transformSummary(allocations: AllocationViewModel[]): ISummary[] {
      return allocations.map((alloc) => ({
        id: alloc.id,
        statisticType: alloc.name?.toLowerCase() || '',
        time: alloc.spend || '00:00',
      })) as ISummary[];
    },

    /**
     * Transform Model.Allocations to IDistribution array
     */
    transformDistributions(allocations: AllocationViewModel[]): IDistribution[] {
      return allocations.map((alloc) => ({
        id: alloc.id,
        statisticType: alloc.name?.toLowerCase() || '',
        time: alloc.spend || '00:00',
        Applications: (alloc.Allocations || []).map((app) => ({
          imgPath: app.imageurl || '',
          title: app.name || '',
          time: app.spend || '00:00',
        })),
        Chart: (alloc.Chart2?.labels || []).map((label: string, index: number) => ({
          label,
          value: alloc.Chart2?.data?.[index] || 0,
        })),
      })) as IDistribution[];
    },

    /**
     * Transform Employee API Breadcrumbs to Section format
     * Employee: { Url, Name, IsEnabled }
     * Section: { id, title, path, isLastElement }
     */
    transformBreadcrumbs(breadcrumbs: BreadCrumbViewModel[]): IBreadcrumb[] {
      if (!breadcrumbs || breadcrumbs.length === 0) return [];

      return breadcrumbs.map((crumb, index) => {
        // Extract ID from URL (e.g., "~/Clock/Section/629176fe57a0318a082d51a2" -> "629176fe57a0318a082d51a2")
        const urlParts = crumb.Url?.split('/') || [];
        const id = urlParts[urlParts.length - 1] || '';

        // Convert URL to path format
        const path = crumb.Url?.replace('~', '') || '';

        return {
          id,
          title: crumb.Name || '',
          path,
          isLastElement: index === breadcrumbs.length - 1,
        };
      });
    },

    /**
     * Build Card data from profile when API returns null
     * Used for employee view when backend doesn't provide Card data
     */
    buildCardFromProfile(): ICard | null {
      const profileStore = useProfileStore();
      const employee = profileStore.GeneralProfile?.Employee;

      if (!employee) {
        return null;
      }

      return {
        Abbreviation: employee.abbreviation || '',
        Name: employee.fullname || '',
        ImageUrl: employee.imageurl || '',
        Title: employee.title || '',
      };
    },

    /**
     * Build Breadcrumb data from profile when API returns null
     * Used for employee view when backend doesn't provide Breadcrumb data
     */
    buildBreadcrumbFromProfile(): IBreadcrumb[] {
      const profileStore = useProfileStore();
      const employee = profileStore.GeneralProfile?.Employee;

      if (!employee) {
        return [];
      }

      // Create a simple breadcrumb with just the employee name
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
     * Fetch section data (Team/Department view + Individuals)
     * Endpoint: /clock/section
     *
     * @param payload - Request payload with Perspective, Interval, TeamId
     * @param force - Force refresh even if same request exists
     */
    async fetchSectionData(payload: ClockSectionRequest, force = false): Promise<ClockSection2Response | null> {
      // Check if we need to make a new request
      if (!force && this.lastSectionRequest && this.sectionData) {
        const isSameRequest =
          this.lastSectionRequest.Perspective === payload.Perspective &&
          this.lastSectionRequest.Interval === payload.Interval &&
          this.lastSectionRequest.TeamId === payload.TeamId;

        if (isSameRequest) {
          // Return cached data
          return this.sectionData;
        }
      }

      try {
        this.loading.section = true;
        this.error.section = null;

        const response = await ClockApiService.clockApiGetSection(payload);

        this.sectionData = response;
        this.lastSectionRequest = { ...payload };

        return response;
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        this.error.section = apiErr?.response?.data?.message || 'Failed to fetch section data';
        console.error('Error fetching section data:', err);
        return null;
      } finally {
        this.loading.section = false;
      }
    },

    /**
     * Fetch employee data (Individual view)
     * Endpoint: /clock/employee
     *
     * @param payload - Request payload with Perspective, Interval, MemberId
     * @param force - Force refresh even if same request exists
     */
    async fetchEmployeeData(payload: ClockEmployeeRequest, force = false): Promise<IEmployeeResponse | null> {
      // Extract just the ID from MemberId if it contains a full path
      const cleanMemberId = payload.MemberId?.includes('/')
        ? payload.MemberId.split('/').pop() || payload.MemberId
        : payload.MemberId;

      const cleanPayload: ClockEmployeeRequest = {
        ...payload,
        MemberId: cleanMemberId,
      };

      // Check if we need to make a new request
      if (!force && this.lastEmployeeRequest && this.employeeData) {
        const isSameRequest =
          this.lastEmployeeRequest.Perspective === cleanPayload.Perspective &&
          this.lastEmployeeRequest.Interval === cleanPayload.Interval &&
          this.lastEmployeeRequest.MemberId === cleanPayload.MemberId;

        if (isSameRequest) {
          // Return cached data
          return this.employeeData;
        }
      }

      try {
        this.loading.employee = true;
        this.error.employee = null;

        const response = await ClockApiService.clockApiGetEmployee(cleanPayload);

        // Check if API returned null/empty data (happens for employee role)
        // If so, build Card and Breadcrumb from profile data
        const useProfileData = !response.Card || !response.Breadcrumbs;

        if (useProfileData) {
          console.log('⚠️ API returned null data. Building from profile...');
        }

        // Transform API response to match our IEmployeeResponse interface
        const transformedData: IEmployeeResponse = {
          Card: useProfileData ? this.buildCardFromProfile() : (response.Card ?? null),
          Breadcrumb: useProfileData
            ? this.buildBreadcrumbFromProfile()
            : this.transformBreadcrumbs(response.Breadcrumbs || []),
          Summary: this.transformSummary(response.Model?.Summary?.Allocations || []),
          WellBeings: response.Model?.WellBeings || [],
          Distributions: this.transformDistributions(response.Model?.Allocations || []),
          Graphs: response.Model?.Graph ?? ({} as IGraph),
          WebClocks: response.Model?.WebClocks || [],
        };

        this.employeeData = transformedData;
        this.lastEmployeeRequest = { ...cleanPayload };

        return transformedData;
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        this.error.employee = apiErr?.response?.data?.message || 'Failed to fetch employee data';
        console.error('Error fetching employee data:', err);
        return null;
      } finally {
        this.loading.employee = false;
      }
    },

    /**
     * Clear section data and cache
     */
    clearSectionData() {
      this.sectionData = null;
      this.lastSectionRequest = null;
      this.error.section = null;
    },

    /**
     * Clear employee data and cache
     */
    clearEmployeeData() {
      this.employeeData = null;
      this.lastEmployeeRequest = null;
      this.error.employee = null;
    },

    /**
     * Clear all data and reset store
     */
    resetStore() {
      this.sectionData = null;
      this.employeeData = null;
      this.lastSectionRequest = null;
      this.lastEmployeeRequest = null;
      this.loading = {
        section: false,
        employee: false,
      };
      this.error = {
        section: null,
        employee: null,
      };
    },

    /**
     * Save web clock domain
     * Endpoint: /clock/web/save
     *
     * @param payload - Request payload with HostName and Domain
     */
    async saveWebClock(payload: WebClockModifyModel) {
      return await ClockApiService.clockApiSaveWebClock(payload);
    },
  },
});
