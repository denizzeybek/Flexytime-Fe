import { defineStore } from 'pinia';

import { CompanyService, DefinitionService, ReportService, TimesheetService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  PerformNameValueModel,
  PerformReportViewModel,
  ReportGraphGroupViewModel,
  ReportGroupViewModel,
  ReportModifyDto,
  ReportQueryDto,
  ReportResultViewModel,
  ReportSummaryViewModel,
  ReportViewModel,
} from '@/client';

interface ReportFilterItem {
  ID: string;
  Name: string;
}

export interface ReportFilterViewModel {
  Projects: ReportFilterItem[];
  Tags: ReportFilterItem[];
  Employees: ReportFilterItem[];
  Teams: ReportFilterItem[];
}

interface State {
  filters: ReportFilterViewModel | null;
  result: ReportResultViewModel | null;
  summary: ReportSummaryViewModel | null;
  graphs: ReportGraphGroupViewModel | null;
  grouping: ReportGroupViewModel[];
  downloadKey: string | null;
  isLoading: boolean;
  isFiltersLoading: boolean;
  defaultReports: PerformReportViewModel | null;
  defaultReportItems: ReportViewModel[];
  reportTypes: PerformNameValueModel[];
  sectionList: PerformNameValueModel[];
  isDefaultReportsLoading: boolean;
}

export const useCompanyReportsStore = defineStore(EStoreNames.COMPANY_REPORTS, {
  state: (): State => ({
    filters: null,
    result: null,
    summary: null,
    graphs: null,
    grouping: [],
    downloadKey: null,
    isLoading: false,
    isFiltersLoading: false,
    defaultReports: null,
    defaultReportItems: [],
    reportTypes: [],
    sectionList: [],
    isDefaultReportsLoading: false,
  }),
  getters: {
    getFilters: (state) => state.filters,
    getResult: (state) => state.result,
    getSummary: (state) => state.summary,
    getGraphs: (state) => state.graphs,
    getGrouping: (state) => state.grouping,
    getDownloadKey: (state) => state.downloadKey,
    getDefaultReportItems: (state) => state.defaultReportItems,
    getReportTypes: (state) => state.reportTypes,
    getSectionList: (state) => state.sectionList,
  },
  actions: {
    async fetchFilters(teamId?: string) {
      this.isFiltersLoading = true;
      try {
        const [teamsRes, projectsRes, tagsRes, employeesRes] = await Promise.all([
          CompanyService.companyControllerTeams(),
          TimesheetService.timesheetControllerGetProjects(),
          TimesheetService.timesheetControllerGetTags(),
          // reason: openapi-typescript-codegen returns generic any until the next gcl picks up the new optional teamId query parameter.
          (DefinitionService.definitionControllerEmployees as (teamId?: string) => Promise<unknown>)(
            teamId,
          ),
        ]);

        const pickString = (v: unknown): string => (typeof v === 'string' ? v : '');
        const toIdName = (row: unknown): ReportFilterItem => {
          const r = (row ?? {}) as Record<string, unknown>;
          return {
            ID: pickString(r['ID']),
            Name: pickString(r['Name']) || pickString(r['MemberName']),
          };
        };

        const teams = Array.isArray(teamsRes) ? (teamsRes as unknown[]).map(toIdName) : [];
        const projects = Array.isArray(projectsRes) ? (projectsRes as unknown[]).map(toIdName) : [];
        const tags = Array.isArray(tagsRes) ? (tagsRes as unknown[]).map(toIdName) : [];
        const employeesObj = (employeesRes ?? {}) as { Members?: unknown };
        const members = Array.isArray(employeesObj.Members)
          ? (employeesObj.Members as unknown[]).map(toIdName)
          : [];

        const next: ReportFilterViewModel = {
          Teams: teams,
          Projects: projects,
          Tags: tags,
          Employees: members,
        };
        this.filters = next;
        return next;
      } finally {
        this.isFiltersLoading = false;
      }
    },

    async refetchEmployees(teamId?: string) {
      this.isFiltersLoading = true;
      try {
        // reason: openapi-typescript-codegen returns generic any until the next gcl picks up the new optional teamId query parameter.
        const employeesRes: unknown = await (
          DefinitionService.definitionControllerEmployees as (
            teamId?: string,
          ) => Promise<unknown>
        )(teamId);
        const employeesObj = (employeesRes ?? {}) as { Members?: unknown };
        const pickString = (v: unknown): string => (typeof v === 'string' ? v : '');
        const members = Array.isArray(employeesObj.Members)
          ? (employeesObj.Members as unknown[]).map((row) => {
              const r = (row ?? {}) as Record<string, unknown>;
              return {
                ID: pickString(r['ID']),
                Name: pickString(r['Name']) || pickString(r['MemberName']),
              };
            })
          : [];
        if (this.filters) {
          this.filters = { ...this.filters, Employees: members };
        }
      } finally {
        this.isFiltersLoading = false;
      }
    },

    async queryReport(request: ReportQueryDto) {
      this.isLoading = true;
      try {
        const response = await ReportService.reportControllerQueryReport(request);
        this.result = response;
        this.summary = response.Summary ?? null;
        this.graphs = response.Graphs ?? null;
        this.grouping = response.Grouping ?? [];
        this.downloadKey = response.DownloadKey ?? null;
        return response;
      } finally {
        this.isLoading = false;
      }
    },

    clearResults() {
      this.result = null;
      this.summary = null;
      this.graphs = null;
      this.grouping = [];
      this.downloadKey = null;
    },

    async fetchDefaultReports() {
      this.isDefaultReportsLoading = true;
      try {
        const response = await CompanyService.companyControllerReports();
        this.defaultReports = response;
        this.defaultReportItems = response.Items ?? [];
        this.reportTypes = response.ReportTypes ?? [];
        this.sectionList = response.SectionList ?? [];
        return response;
      } finally {
        this.isDefaultReportsLoading = false;
      }
    },

    async saveReport(request: ReportModifyDto) {
      const response = await CompanyService.companyControllerSaveReport(request);
      await this.fetchDefaultReports();
      return response;
    },

    async deleteReport(id: string) {
      const response = await CompanyService.companyControllerDeleteReport({ ID: id });
      await this.fetchDefaultReports();
      return response;
    },
  },
});
