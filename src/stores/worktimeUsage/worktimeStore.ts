

import { defineStore } from 'pinia';

import { ClockService } from '@/client';
import { formatByPerspective, sumDomainSeconds } from '@/helpers/perspective';
import { useProfileStore } from '@/stores/profile/profile';

import type {
  ClockDistribution,
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

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface State {
  sectionData: ClockSectionResponse | null;

  employeeData: IEmployeeResponse | null;

  loading: ILoadingState;

  error: IErrorState;

  lastSectionRequest: ClockSectionRequestDto | null;
  lastEmployeeRequest: ClockEmployeeRequestDto | null;
}

interface LegacyStatCell {
  time: string;
}

interface SummaryRow {
  Work?: number | null;
  Meeting?: number | null;
  Leisure?: number | null;
  Unclassified?: number | null;
  WorkCost?: string | null;
  MeetingCost?: string | null;
  LeisureCost?: string | null;
  UnclassifiedCost?: string | null;
}

function perspectiveCellFor(
  row: SummaryRow,
  key: 'Work' | 'Meeting' | 'Leisure' | 'Unclassified',
  perspective: string | undefined,
  currency: string,
): LegacyStatCell {
  const totalSeconds = sumDomainSeconds(row);
  return {
    time: formatByPerspective({
      seconds: row[key] ?? 0,
      cost: row[`${key}Cost`] ?? '0',
      totalSeconds,
      perspective,
      currency,
    }),
  };
}

function secondsToClockTime(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return '-';
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600) % 24;
  const m = Math.floor((total % 3600) / 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function clockTimeCell(seconds: number | null | undefined): LegacyStatCell {
  return { time: secondsToClockTime(seconds) };
}

type SummaryLike = {
  Work?: number;
  Meeting?: number;
  Leisure?: number;
  Unclassified?: number;
  WorkCost?: string;
  MeetingCost?: string;
  LeisureCost?: string;
  UnclassifiedCost?: string;
  StartTime?: number | null;
  EndTime?: number | null;
  Start?: number | null;
  End?: number | null;
};

function summaryObjectToArray(
  summary: SummaryLike,
  perspective: string | undefined,
  currency: string,
): ISummary[] {
  const start = summary.StartTime ?? summary.Start ?? null;
  const end = summary.EndTime ?? summary.End ?? null;
  const row: SummaryRow = {
    Work: summary.Work,
    Meeting: summary.Meeting,
    Leisure: summary.Leisure,
    Unclassified: summary.Unclassified,
    WorkCost: summary.WorkCost,
    MeetingCost: summary.MeetingCost,
    LeisureCost: summary.LeisureCost,
    UnclassifiedCost: summary.UnclassifiedCost,
  };
  return [
    { id: 'work', statisticType: 'work', time: perspectiveCellFor(row, 'Work', perspective, currency).time },
    { id: 'meeting', statisticType: 'meeting', time: perspectiveCellFor(row, 'Meeting', perspective, currency).time },
    { id: 'leisure', statisticType: 'leisure', time: perspectiveCellFor(row, 'Leisure', perspective, currency).time },
    {
      id: 'unclassified',
      statisticType: 'unclassified',
      time: perspectiveCellFor(row, 'Unclassified', perspective, currency).time,
    },
    { id: 'starttime', statisticType: 'starttime', time: secondsToClockTime(start) },
    { id: 'endtime', statisticType: 'endtime', time: secondsToClockTime(end) },
  ];
}

function distributionsToLegacy(
  distribution: ClockDistribution[],
  perspective: string | undefined,
  currency: string,
): IDistribution[] {
  const totalSeconds = distribution.reduce((acc, r) => acc + (r.Seconds ?? 0), 0);
  return distribution.map((row) => {
    const apps = (row.Applications ?? []).filter((a) => (a.Seconds ?? 0) > 0);
    const rowTotalApps = apps.reduce((acc, a) => acc + (a.Seconds ?? 0), 0);
    return {
      id: String(row.Domain).toLowerCase(),
      statisticType: String(row.Domain).toLowerCase(),
      time: formatByPerspective({
        seconds: row.Seconds ?? 0,
        cost: row.Cost ?? '0',
        totalSeconds,
        perspective,
        currency,
      }),
      Applications: apps.map((app) => ({
        imgPath: '',
        title: app.Name ?? '',
        time: formatByPerspective({
          seconds: app.Seconds ?? 0,
          cost: app.Cost ?? '0',
          totalSeconds: rowTotalApps,
          perspective,
          currency,
        }),
      })),
      Chart: apps.map((app) => ({
        label: app.Name ?? '',
        value: app.Seconds ?? 0,
      })),
    };
  }) as unknown as IDistribution[];
}

function buildProductivityGraph(
  days: Array<{ Date?: string; Work?: number; Meeting?: number; Leisure?: number; Unclassified?: number }>,
): IGraph {
  if (!days?.length) return {} as IGraph;
  const labels = days.map((d) => d.Date ?? '');
  const toHours = (s: number | undefined): number =>
    Number(((s ?? 0) / 3600).toFixed(2));
  const datasets = [
    { label: 'work', data: days.map((d) => toHours(d.Work)) },
    { label: 'meeting', data: days.map((d) => toHours(d.Meeting)) },
    { label: 'leisure', data: days.map((d) => toHours(d.Leisure)) },
    { label: 'unclassified', data: days.map((d) => toHours(d.Unclassified)) },
  ];
  return { Summary: { labels, datasets, Unit: 'h' } } as IGraph;
}

export interface IWellBeingGraph {
  Type: string;
  Name: string;
  Color: 'red' | 'yellow' | 'green';
  Icon: string;
  Graph: { labels: string[]; datasets: Array<{ label: string; data: number[] }>; Unit: string };
}
function buildWellBeingGraphs(
  graphs: Array<{ Type?: string; Points?: Array<{ Date?: string; Value?: number }> }>,
): IWellBeingGraph[] {
  return (graphs ?? []).map((g) => {
    const type = g.Type ?? '';
    const unit = WELLBEING_TYPE_UNIT[type] ?? '';
    const toUnit = (v: number | undefined): number =>
      unit === 'h' ? Number(((v ?? 0) / 3600).toFixed(2)) : (v ?? 0);
    const labels = (g.Points ?? []).map((p) => p.Date ?? '');
    const data = (g.Points ?? []).map((p) => toUnit(p.Value));
    return {
      Type: type,
      Name: type,
      Color: 'yellow' as const,
      Icon: WELLBEING_TYPE_ICON[type] ?? 'fas fa-heart',
      Graph: {
        labels,
        datasets: [{ label: type, data }],
        Unit: unit,
      },
    };
  });
}

const WELLBEING_LEVEL_COLOR: Record<number, 'red' | 'yellow' | 'green'> = {
  0: 'red',
  1: 'yellow',
  2: 'green',
};
const WELLBEING_TYPE_ICON: Record<string, string> = {
  Overload: 'fas fa-fire-extinguisher',
  Distract: 'fas fa-volume-slash',
  Automation: 'fas fa-cogs',
  Fragmentation: 'fas fa-fast-forward',
  Overmeeting: 'fas fa-clock',
  Overtime: 'fas fa-clock',
  Nocturnal: 'fas fa-clock',
  Uninterrupted: 'fas fa-coffee',
  Mailbulk: 'fas fa-mail-bulk',
  Balanced: 'fas fa-walking',
};
const WELLBEING_TYPE_UNIT: Record<string, string> = {
  Overtime: 'h',
  Overmeeting: 'h',
  Nocturnal: 'h',
  Overload: 'h',
  Uninterrupted: 'h',
  Distract: 'count',
  Automation: 'count',
  Fragmentation: 'count',
  Mailbulk: 'count',
  Balanced: 'h',
};
function buildIndividualWellbeings(
  wellbeings: Array<{
    Type?: string;
    Notification?: number;
    Level?: number;
    Points?: Array<{ Date?: string; Value?: number }>;
  }>,
): IEmployeeResponse['WellBeings'] {
  return (wellbeings ?? []).map((wb) => {
    const type = wb.Type ?? '';
    const unit = WELLBEING_TYPE_UNIT[type] ?? '';
    const toUnit = (v: number | undefined): number =>
      unit === 'h' ? Number(((v ?? 0) / 3600).toFixed(2)) : (v ?? 0);
    const labels = (wb.Points ?? []).map((p) => p.Date ?? '');
    const data = (wb.Points ?? []).map((p) => toUnit(p.Value));
    return {
      Type: type,
      Name: type,
      Color: WELLBEING_LEVEL_COLOR[wb.Level ?? 0] ?? 'yellow',
      Icon: WELLBEING_TYPE_ICON[type] ?? 'fas fa-heart',
      Notification: wb.Notification ?? 0,
      Level: wb.Level ?? 0,
      Description: '',
      Suggestion: '',
      Graph: {
        labels,
        datasets: [{ label: type, data }],
        Unit: unit,
      },
    } as IEmployeeResponse['WellBeings'][number];
  });
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
