import { defineStore } from 'pinia';

import { ReportApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  ReportFilterViewModel,
  ReportGraphGroupViewModel,
  ReportGroupViewModel,
  ReportQueryViewModel,
  ReportResultViewModel,
  ReportSummaryViewModel,
} from '@/client';

interface State {
  filters: ReportFilterViewModel | null;
  result: ReportResultViewModel | null;
  summary: ReportSummaryViewModel | null;
  graphs: ReportGraphGroupViewModel | null;
  grouping: ReportGroupViewModel[];
  downloadKey: string | null;
  isLoading: boolean;
  isFiltersLoading: boolean;
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
  }),
  getters: {
    getFilters: (state) => state.filters,
    getResult: (state) => state.result,
    getSummary: (state) => state.summary,
    getGraphs: (state) => state.graphs,
    getGrouping: (state) => state.grouping,
    getDownloadKey: (state) => state.downloadKey,
  },
  actions: {
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
  },
});
