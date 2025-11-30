import { defineStore } from 'pinia';

import { CompanyApiService, ReportApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  PerformNameValueModel,
  PerformReportViewModel,
  ReportFilterViewModel,
  ReportGraphGroupViewModel,
  ReportGroupViewModel,
  ReportModifyModel,
  ReportQueryViewModel,
  ReportResultViewModel,
  ReportSummaryViewModel,
  ReportViewModel,
} from '@/client';

interface State {
  // Elastic Reports
  filters: ReportFilterViewModel | null;
  result: ReportResultViewModel | null;
  summary: ReportSummaryViewModel | null;
  graphs: ReportGraphGroupViewModel | null;
  grouping: ReportGroupViewModel[];
  downloadKey: string | null;
  isLoading: boolean;
  isFiltersLoading: boolean;
  // Default Reports
  defaultReports: PerformReportViewModel | null;
  defaultReportItems: ReportViewModel[];
  reportTypes: PerformNameValueModel[];
  sectionList: PerformNameValueModel[];
  isDefaultReportsLoading: boolean;
}

export const useCompanyReportsStore = defineStore(EStoreNames.COMPANY_REPORTS, {
  state: (): State => ({
    // Elastic Reports
    filters: null,
    result: null,
    summary: null,
    graphs: null,
    grouping: [],
    downloadKey: null,
    isLoading: false,
    isFiltersLoading: false,
    // Default Reports
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
    // Elastic Reports Actions
    async fetchFilters() {
      this.isFiltersLoading = true;
      try {
        const response = await ReportApiService.reportApiGetFilters();
        this.filters = response;
        return response;
      } finally {
        this.isFiltersLoading = false;
      }
    },

    async queryReport(request: ReportQueryViewModel) {
      this.isLoading = true;
      try {
        const response = await ReportApiService.reportApiQueryReport(request);
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

    // Default Reports Actions
    async fetchDefaultReports() {
      this.isDefaultReportsLoading = true;
      try {
        const response = await CompanyApiService.companyApiReports();
        this.defaultReports = response;
        this.defaultReportItems = response.Items ?? [];
        this.reportTypes = response.ReportTypes ?? [];
        this.sectionList = response.SectionList ?? [];
        return response;
      } finally {
        this.isDefaultReportsLoading = false;
      }
    },

    async saveReport(request: ReportModifyModel) {
      const response = await CompanyApiService.companyApiSaveReport(request);
      await this.fetchDefaultReports();
      return response;
    },

    async deleteReport(id: string) {
      const response = await CompanyApiService.companyApiDeleteReport({ ID: id });
      await this.fetchDefaultReports();
      return response;
    },
  },
});
