import { defineStore } from 'pinia';

import { ClockService } from '@/client';
import { useProfileStore } from '@/stores/profile/profile';

import {
  buildIndividualWellbeings,
  buildProductivityGraph,
  buildWellBeingGraphs,
  clockTimeCell,
  distributionsToLegacy,
  type IWellBeingGraph,
  perspectiveCellFor,
  summaryObjectToArray,
} from './_helpers/worktimeTransform';

import type {
  ClockEmployeeRequestDto,
  ClockSectionRequestDto,
  ClockSectionResponse,
  WebClockModifyDto,
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

export type { IWellBeingGraph };

interface ApiError {
  response?: { data?: { message?: string } };
}

interface State {
  sectionData: ClockSectionResponse | null;
  employeeData: IEmployeeResponse | null;
  loading: ILoadingState;
  error: IErrorState;
  lastSectionRequest: ClockSectionRequestDto | null;
  lastEmployeeRequest: ClockEmployeeRequestDto | null;
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

    getIndividuals: (state) => {
      const teamNameById = new Map(
        (state.sectionData?.Teams ?? []).map((t) => [t.TeamId, t.Name ?? '']),
      );
      const perspective = state.lastSectionRequest?.Perspective;
      const currency = state.sectionData?.Currency ?? 'TRY';
      return (state.sectionData?.Individuals ?? []).map((row) => ({
        ID: row.UserId,
        EmployeeName: row.Fullname ?? '',
        Employee: { MemberUrl: row.UserId, ImageUrl: row.ImageUrl ?? null },
        TeamName: row.TeamId ? (teamNameById.get(row.TeamId) ?? '') : '',
        Team: row.TeamId ? { TeamId: row.TeamId, ImageUrl: null } : null,
        TeamId: row.TeamId ?? null,
        Availability: row.Availability,
        OnLeave: row.OnLeave,
        LeaveType: row.LeaveType ?? '',
        Tags: [],
        TagsDisplay: '',
        Start: clockTimeCell(row.Summary.StartTime),
        End: clockTimeCell(row.Summary.EndTime),
        Work: perspectiveCellFor(row.Summary, 'Work', perspective, currency),
        Leisure: perspectiveCellFor(row.Summary, 'Leisure', perspective, currency),
        Meeting: perspectiveCellFor(row.Summary, 'Meeting', perspective, currency),
        Unclassified: perspectiveCellFor(row.Summary, 'Unclassified', perspective, currency),
      }));
    },

    getTeams: (state) => {
      const perspective = state.lastSectionRequest?.Perspective;
      const currency = state.sectionData?.Currency ?? 'TRY';
      return (state.sectionData?.Teams ?? []).map((row) => ({
        ID: row.TeamId,
        TeamName: row.Name ?? '',
        SupervisorName: '',
        Supervisor: undefined,
        Start: clockTimeCell(row.Summary.StartTime),
        End: clockTimeCell(row.Summary.EndTime),
        Work: perspectiveCellFor(row.Summary, 'Work', perspective, currency),
        Leisure: perspectiveCellFor(row.Summary, 'Leisure', perspective, currency),
        Meeting: perspectiveCellFor(row.Summary, 'Meeting', perspective, currency),
        Unclassified: perspectiveCellFor(row.Summary, 'Unclassified', perspective, currency),
      }));
    },

    getCompanyRow: (state) => {
      const data = state.sectionData;
      if (!data) return null;
      const perspective = state.lastSectionRequest?.Perspective;
      const currency = data.Currency ?? 'TRY';
      return {
        ID: '__company__',
        TeamName: data.Company?.Name ?? '',
        SupervisorName: '',
        Supervisor: undefined,
        Start: clockTimeCell(data.Summary.StartTime),
        End: clockTimeCell(data.Summary.EndTime),
        Work: perspectiveCellFor(data.Summary, 'Work', perspective, currency),
        Leisure: perspectiveCellFor(data.Summary, 'Leisure', perspective, currency),
        Meeting: perspectiveCellFor(data.Summary, 'Meeting', perspective, currency),
        Unclassified: perspectiveCellFor(data.Summary, 'Unclassified', perspective, currency),
      };
    },

    getTeamTree: (state) => {
      const data = state.sectionData;
      if (!data) return [];
      const rawTeams = data.Teams ?? [];
      const individuals = data.Individuals ?? [];
      const perspective = state.lastSectionRequest?.Perspective;
      const currency = data.Currency ?? 'TRY';

      const teamRows = rawTeams.map((row) => {
        const parentId = (row as unknown as { ParentTeamId?: string | null }).ParentTeamId ?? null;
        return {
          ID: row.TeamId,
          ParentTeamId: parentId,
          TeamName: row.Name ?? '',
          SupervisorName: '',
          Supervisor: undefined as unknown,
          Start: clockTimeCell(row.Summary.StartTime),
          End: clockTimeCell(row.Summary.EndTime),
          Work: perspectiveCellFor(row.Summary, 'Work', perspective, currency),
          Leisure: perspectiveCellFor(row.Summary, 'Leisure', perspective, currency),
          Meeting: perspectiveCellFor(row.Summary, 'Meeting', perspective, currency),
          Unclassified: perspectiveCellFor(row.Summary, 'Unclassified', perspective, currency),
        };
      });

      const membersByTeam = new Map<string, typeof individuals>();
      for (const ind of individuals) {
        const teamId = ind.TeamId ?? null;
        if (!teamId) continue;
        const list = membersByTeam.get(teamId) ?? [];
        list.push(ind);
        membersByTeam.set(teamId, list);
      }

      const childrenByParent = new Map<string | null, typeof teamRows>();
      for (const t of teamRows) {
        const list = childrenByParent.get(t.ParentTeamId) ?? [];
        list.push(t);
        childrenByParent.set(t.ParentTeamId, list);
      }

      const buildNode = (team: (typeof teamRows)[number]): Record<string, unknown> => {
        const subTeams = (childrenByParent.get(team.ID) ?? []).map(buildNode);
        const members = (membersByTeam.get(team.ID) ?? []).map((m) => ({
          key: `i:${m.UserId}`,
          data: {
            nodeType: 'individual' as const,
            ID: m.UserId,
            TeamName: m.Fullname ?? '',
            SupervisorName: '',
            Supervisor: undefined,
            Start: clockTimeCell(m.Summary.StartTime),
            End: clockTimeCell(m.Summary.EndTime),
            Work: perspectiveCellFor(m.Summary, 'Work', perspective, currency),
            Leisure: perspectiveCellFor(m.Summary, 'Leisure', perspective, currency),
            Meeting: perspectiveCellFor(m.Summary, 'Meeting', perspective, currency),
            Unclassified: perspectiveCellFor(m.Summary, 'Unclassified', perspective, currency),
          },
        }));
        return {
          key: `t:${team.ID}`,
          data: { nodeType: 'team' as const, ...team },
          children: [...subTeams, ...members],
        };
      };

      return (childrenByParent.get(null) ?? []).map(buildNode);
    },

    sectionSummary: (state): ISummary[] =>
      state.sectionData
        ? summaryObjectToArray(
            state.sectionData.Summary,
            state.lastSectionRequest?.Perspective,
            state.sectionData.Currency ?? 'TRY',
          )
        : [],
    sectionDistributions: (state): IDistribution[] =>
      distributionsToLegacy(
        state.sectionData?.Distribution ?? [],
        state.lastSectionRequest?.Perspective,
        state.sectionData?.Currency ?? 'TRY',
      ),
    sectionGraphs: (state): IGraph | null =>
      state.sectionData
        ? buildProductivityGraph(state.sectionData.ProductivityGraph ?? [])
        : null,
    sectionWellBeingGraphs: (state): IWellBeingGraph[] =>
      buildWellBeingGraphs(state.sectionData?.WellBeingGraph ?? []),

    sectionCard: (state): ICard | null => {
      const companyName = state.sectionData?.Company?.Name ?? '';
      const currentTeamId = state.lastSectionRequest?.TeamId ?? null;
      const team = currentTeamId
        ? (state.sectionData?.Teams ?? []).find((t) => t.TeamId === currentTeamId)
        : null;
      const label = team?.Name ?? companyName;
      if (!label) return null;
      const abbreviation = label
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      return {
        Abbreviation: abbreviation,
        Name: label,
        ImageUrl: '',
        Title: team ? companyName : '',
      };
    },

    sectionBreadcrumb: (state): IBreadcrumb[] => {
      return (state.sectionData?.Breadcrumb ?? []) as unknown as IBreadcrumb[];
    },

    employeeBreadcrumb: (state): IBreadcrumb[] => {
      return (state.employeeData?.Breadcrumb ?? []) as unknown as IBreadcrumb[];
    },

    isSectionLoading: (state): boolean => state.loading.section,
    isEmployeeLoading: (state): boolean => state.loading.employee,
    isLoading: (state): boolean => state.loading.section || state.loading.employee,
    getSectionError: (state): string | null => state.error.section,
    getEmployeeError: (state): string | null => state.error.employee,
  },

  actions: {

    buildCardFromEmployeeIdentity(identity: { Fullname?: string; Title?: string | null } | null): ICard | null {
      const profileStore = useProfileStore();
      const name = identity?.Fullname || profileStore.GeneralProfile?.fullname || '';
      if (!name) return null;
      const title = identity?.Title ?? '';
      const abbreviation = name
        .split(/\s+/)
        .filter(Boolean)
        .map((w: string) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      return {
        Abbreviation: abbreviation,
        Name: name,
        ImageUrl: profileStore.GeneralProfile?.imageUrl || '',
        Title: title,
      };
    },

    buildBreadcrumbFromEmployeeIdentity(
      identity: { Fullname?: string; TeamId?: string | null } | null,
    ): IBreadcrumb[] {
      const profileStore = useProfileStore();
      const name = identity?.Fullname || profileStore.GeneralProfile?.fullname || '';
      if (!name) return [];

      const crumbs: IBreadcrumb[] = [];

      const companyName = this.sectionData?.Company?.Name ?? '';
      if (companyName) {
        crumbs.push({
          id: '__company__',
          title: companyName,
          path: '/clock',
          isLastElement: false,
        });
      }

      const teamId = identity?.TeamId ?? null;
      if (teamId) {
        const team = (this.sectionData?.Teams ?? []).find((t) => t.TeamId === teamId);
        if (team?.Name) {
          crumbs.push({
            id: team.TeamId,
            title: team.Name,
            path: '/clock',
            isLastElement: false,
          });
        }
      }

      crumbs.push({
        id: 'employee',
        title: name,
        path: '/clock',
        isLastElement: true,
      });

      return crumbs;
    },

    buildCardFromProfile(): ICard | null {
      return this.buildCardFromEmployeeIdentity(null);
    },

    buildBreadcrumbFromProfile(): IBreadcrumb[] {
      return this.buildBreadcrumbFromEmployeeIdentity(null);
    },

    async fetchSectionData(
      payload: ClockSectionRequestDto,
      force = false,
    ): Promise<ClockSectionResponse | null> {
      if (!force && this.lastSectionRequest && this.sectionData) {
        const isSameRequest =
          this.lastSectionRequest.Perspective === payload.Perspective &&
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

    async fetchEmployeeData(
      payload: ClockEmployeeRequestDto,
      force = false,
    ): Promise<IEmployeeResponse | null> {
      const cleanMemberId = payload.MemberId?.includes('/')
        ? payload.MemberId.split('/').pop() || payload.MemberId
        : payload.MemberId;
      const cleanPayload: ClockEmployeeRequestDto = { ...payload, MemberId: cleanMemberId };

      if (!force && this.lastEmployeeRequest && this.employeeData) {
        const isSameRequest =
          this.lastEmployeeRequest.Perspective === cleanPayload.Perspective &&
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
        const currency = response.Currency ?? 'TRY';
        const perspective = cleanPayload.Perspective;

        const transformed: IEmployeeResponse = {
          Card: this.buildCardFromEmployeeIdentity(response.Employee ?? null),
          Breadcrumb: (response.Breadcrumb ?? []) as unknown as IEmployeeResponse['Breadcrumb'],
          Summary: summaryObjectToArray(response.Summary, perspective, currency),
          WellBeings: buildIndividualWellbeings(response.WellBeings ?? []),
          Distributions: distributionsToLegacy(response.Distribution ?? [], perspective, currency),
          Graphs: buildProductivityGraph(response.ProductivityGraph ?? []),
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

    async saveWebClock(payload: WebClockModifyDto) {
      return ClockService.clockControllerSaveWebClock(payload);
    },
  },
});
