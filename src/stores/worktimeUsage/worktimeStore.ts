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
  ClockEmployeeRequestDto,
  ClockEmployeeResponse,
  ClockSectionRequestDto,
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
  lastSectionRequest: ClockSectionRequestDto | null;
  lastEmployeeRequest: ClockEmployeeRequestDto | null;
}

/**
 * The team / individual rows the legacy tables expect — one stat-cell per
 * domain with `time` strings (seconds-formatted). v2 returns a single
 * `Summary` object per row instead; we widen back into the field shape the
 * existing column markup reads.
 */
interface LegacyStatCell {
  time: string;
}
function statCell(seconds: number | null | undefined): LegacyStatCell {
  return { time: String(seconds ?? 0) };
}

/**
 * Format seconds-since-midnight as `HH:mm` clock time (e.g. 30600 → "08:30").
 * Used for Start/End columns and badges, which carry a wall-clock instant
 * for the day rather than a duration. Returns "-" for null/zero/invalid so
 * the table cell stays readable when the shift bound is unknown.
 */
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

/**
 * v2 `Summary` is a single object with the four per-domain seconds; the legacy
 * tab UI iterates an `ISummary[]` keyed by `statisticType`. We expand the
 * v2 object back into the legacy array shape so the existing tab markup keeps
 * rendering until it gets refactored.
 */
function summaryObjectToArray(
  summary: ClockEmployeeResponse['Summary'] & {
    StartTime?: number | null;
    EndTime?: number | null;
    Start?: number | null;
    End?: number | null;
  },
): ISummary[] {
  // v2: `Start*`/`End*` are seconds-since-midnight (legacy ConvertSummary
  // averages). The badge component matches on the lowercase statisticType
  // 'starttime' / 'endtime' (see EStatisticType + BadgeGroup.mapStatistic-
  // TypeToBadge). Work/Meeting/Leisure/Unclassified stay as raw seconds —
  // the badge runs them through `formatDuration` for the "8h 30m" label.
  // Start/End are pre-formatted to "HH:mm" here so the badge bypasses
  // the duration formatter and surfaces a real clock time.
  const start = summary.StartTime ?? summary.Start ?? null;
  const end = summary.EndTime ?? summary.End ?? null;
  return [
    { id: 'work', statisticType: 'work', time: String(summary.Work ?? 0) },
    { id: 'meeting', statisticType: 'meeting', time: String(summary.Meeting ?? 0) },
    { id: 'leisure', statisticType: 'leisure', time: String(summary.Leisure ?? 0) },
    {
      id: 'unclassified',
      statisticType: 'unclassified',
      time: String(summary.Unclassified ?? 0),
    },
    { id: 'starttime', statisticType: 'starttime', time: secondsToClockTime(start) },
    { id: 'endtime', statisticType: 'endtime', time: secondsToClockTime(end) },
  ];
}

/**
 * v2 `Distribution[]` ships `{Domain, Seconds, Applications: [{Name, Seconds}]}`.
 * The legacy `IDistribution` shape carried a `Chart[]` array the doughnut
 * fed off ({ label, value } pairs). Build it from `Applications` so each
 * domain card shows a per-app pie of the time spent within that domain —
 * matches what the v1 chart did. Dropping zero-Seconds apps so a 12-app
 * list with one real entry doesn't render a sea of identical empty slices.
 */
function distributionsToLegacy(distribution: ClockDistribution[]): IDistribution[] {
  return distribution.map((row) => {
    const apps = (row.Applications ?? []).filter((a) => (a.Seconds ?? 0) > 0);
    return {
      id: String(row.Domain).toLowerCase(),
      statisticType: String(row.Domain).toLowerCase(),
      time: String(row.Seconds ?? 0),
      Applications: apps.map((app) => ({
        imgPath: '',
        title: app.Name ?? '',
        time: String(app.Seconds ?? 0),
      })),
      Chart: apps.map((app) => ({
        label: app.Name ?? '',
        value: app.Seconds ?? 0,
      })),
    };
  }) as IDistribution[];
}

/**
 * v2 ships `ProductivityGraph: [{Date, Work, Meeting, Leisure, Unclassified}]`
 * — raw seconds per day per domain. The legacy chart consumed a stacked-bar
 * dataset shape (`Summary.labels[]` = days, `Summary.datasets[]` = one per
 * domain). Convert seconds → hours (so the y-axis stays readable for week+
 * windows) and stack work/meeting/leisure/unclassified.
 */
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

/**
 * `WellBeingGraph` on the section response is one per-type per-day series
 * (legacy `Model.WellBeingGraphs[]`). Build the card shape — one chart per
 * type with `{Name, Color, Icon, Graph: {labels, datasets, Unit}}` — so the
 * Show-Graph toggle on the Wellbeing tab can render directly. Color defaults
 * to yellow because the section-level series doesn't carry a `Level` (the
 * org-wide severity flag lives on `WellBeings[]`); a future enhancement
 * could join them.
 */
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

/**
 * v2 `ClockEmployeeWellBeing` is the raw `{Type, Notification, Level,
 * Points: [{Date, Value}]}`. The legacy card markup wants
 * `{Name, Color, Icon, Description, Suggestion, Graph: ClockGraph}`.
 * Derive everything except Description/Suggestion (i18n bundle not ported
 * yet — left empty so the field renders blank rather than fabricated).
 */
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

    /**
     * Individuals projected to the legacy `IIndividual` field shape the
     * EmployeeProductivityTable + EmployeeWellbeingTable read. v2 returns
     * `Fullname` / `UserId` / `TeamId` / `Availability` / `OnLeave` /
     * `LeaveType` / `Summary{Work,Meeting,Leisure,Unclassified,StartTime,
     * EndTime}` directly — the table reads `EmployeeName`, `Start.time`,
     * `Work.time` etc., so we widen each row.
     */
    getIndividuals: (state) => {
      // v2 Individuals carry only `TeamId`; the legacy table renders
      // `TeamName`. Build a lookup from the same response's Teams[] so the
      // join happens client-side without a follow-up fetch.
      const teamNameById = new Map(
        (state.sectionData?.Teams ?? []).map((t) => [t.TeamId, t.Name ?? '']),
      );
      return (state.sectionData?.Individuals ?? []).map((row) => ({
        ID: row.UserId,
        EmployeeName: row.Fullname ?? '',
        // Legacy tables render the name/team columns only when `Employee` /
        // `Team` are truthy (v-else-if without v-else). v2 doesn't ship rich
        // MemberUrl/ImageUrl, so we inject a minimal object — avatar falls
        // back to initials, click is a no-op while MemberUrl is empty.
        Employee: { MemberUrl: '', ImageUrl: null },
        TeamName: row.TeamId ? (teamNameById.get(row.TeamId) ?? '') : '',
        Team: row.TeamId ? { TeamId: row.TeamId, ImageUrl: null } : null,
        Availability: row.Availability,
        OnLeave: row.OnLeave,
        LeaveType: row.LeaveType ?? '',
        Tags: [],
        TagsDisplay: '',
        Start: clockTimeCell(row.Summary.StartTime),
        End: clockTimeCell(row.Summary.EndTime),
        Work: statCell(row.Summary.Work),
        Leisure: statCell(row.Summary.Leisure),
        Meeting: statCell(row.Summary.Meeting),
        Unclassified: statCell(row.Summary.Unclassified),
      }));
    },

    /**
     * Teams projected to the legacy `ITeam` field shape the
     * TeamProductivityTable + TeamWellbeingTable read. v2 returns `Name` +
     * `SupervisorUserId` + the same `Summary` object; we map to `TeamName`,
     * `SupervisorName` and the four stat cells.
     */
    getTeams: (state) =>
      (state.sectionData?.Teams ?? []).map((row) => ({
        ID: row.TeamId,
        TeamName: row.Name ?? '',
        // v2 returns the supervisor as a user-id, not a denormalized name.
        // The legacy table renders `SupervisorName` (string) + optional
        // `Supervisor` (avatar metadata). Empty string / undefined here is
        // fine; the FE will follow up with a fan-out to populate names.
        SupervisorName: '',
        Supervisor: undefined,
        Start: clockTimeCell(row.Summary.StartTime),
        End: clockTimeCell(row.Summary.EndTime),
        Work: statCell(row.Summary.Work),
        Leisure: statCell(row.Summary.Leisure),
        Meeting: statCell(row.Summary.Meeting),
        Unclassified: statCell(row.Summary.Unclassified),
      })),

    /**
     * Legacy-shape adapter views over the v2 ClockSectionResponse so the
     * existing index.vue + BadgeGroup + DistributionTab markup keeps
     * rendering. Mirrors what the employee fetch builds inline.
     */
    sectionSummary: (state): ISummary[] =>
      state.sectionData ? summaryObjectToArray(state.sectionData.Summary) : [],
    sectionDistributions: (state): IDistribution[] =>
      distributionsToLegacy(state.sectionData?.Distribution ?? []),
    sectionGraphs: (state): IGraph | null =>
      state.sectionData
        ? buildProductivityGraph(state.sectionData.ProductivityGraph ?? [])
        : null,
    sectionWellBeingGraphs: (state): IWellBeingGraph[] =>
      buildWellBeingGraphs(state.sectionData?.WellBeingGraph ?? []),

    /**
     * Section-mode Card: derived from the v2 response's Company + Teams
     * because the section view at the worktime root is always "current
     * team/department". The avatar's `ImageUrl` stays empty (the BE only
     * gives names); UserBadge falls back to the abbreviation initials.
     */
    sectionCard: (state): ICard | null => {
      const team = state.sectionData?.Teams?.[0];
      const companyName = state.sectionData?.Company?.Name ?? '';
      const label = team?.Name ?? companyName;
      if (!label) return null;
      // Build a 2-letter abbreviation from the team / company name.
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
        Title: companyName && team?.Name && companyName !== team.Name ? companyName : '',
      };
    },

    /**
     * Section-mode Breadcrumb: a single leaf segment whose label is the
     * current team (or, at the root, the company) name. PrimeVue's
     * `<PBreadcrumb>` renders the home-icon segment itself via the
     * `home` prop — we only ever return the trail under it. The legacy
     * BE used to ship a server-built BreadCrumb[]; v2 dropped that, so
     * the FE derives the trail from the Company + Teams blocks.
     */
    sectionBreadcrumb: (state): IBreadcrumb[] => {
      const team = state.sectionData?.Teams?.[0];
      const companyName = state.sectionData?.Company?.Name ?? '';
      const leafName = team?.Name ?? companyName;
      if (!leafName) return [];
      return [
        {
          id: team?.TeamId ?? 'company',
          title: leafName,
          path: '/clock',
          isLastElement: true,
        },
      ];
    },

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

    /**
     * Fetch employee data. Endpoint: `/clock/employee`. v2: response is the
     * flat `ClockEmployeeResponse`. We adapt it to the legacy
     * `IEmployeeResponse` shape for the existing tab components.
     */
    async fetchEmployeeData(
      payload: ClockEmployeeRequestDto,
      force = false,
    ): Promise<IEmployeeResponse | null> {
      // Extract just the ID from MemberId if it contains a full path
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

        const transformed: IEmployeeResponse = {
          Card: this.buildCardFromProfile(),
          Breadcrumb: this.buildBreadcrumbFromProfile(),
          Summary: summaryObjectToArray(response.Summary),
          WellBeings: buildIndividualWellbeings(response.WellBeings ?? []),
          Distributions: distributionsToLegacy(response.Distribution ?? []),
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

    /** Save web clock domain. Endpoint: `/clock/web/save`. */
    async saveWebClock(payload: WebClockModifyModel) {
      return ClockService.clockControllerSaveWebClock(payload);
    },
  },
});
