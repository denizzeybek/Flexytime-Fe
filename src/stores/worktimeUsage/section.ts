import { defineStore } from 'pinia';

import { ClockApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  CardViewModel,
  ClockBreadCrumb,
  ClockDistribution,
  ClockEmployeeRequest,
  ClockGraphGroup,
  ClockInvitation,
  ClockSectionIndividual,
  ClockSectionRequest,
  ClockSectionTeamset,
  ClockWellBeingDetail,
  EmployeeClockViewModel,
  SectionClockSummary,
  WebClockModifyModel,
} from '@/client';

interface State {
  Card: CardViewModel;
  Individuals?: ClockSectionIndividual[];
  Summary?: SectionClockSummary[];
  WellBeings?: ClockWellBeingDetail[];
  Breadcrumb?: ClockBreadCrumb[];
  Distributions?: ClockDistribution[];
  Graphs?: ClockGraphGroup;
  Teamset?: ClockSectionTeamset;
  Invitations?: ClockInvitation[];
  DownloadKey?: string;
  IndividualEmployeeModel?: EmployeeClockViewModel;
  isLoading: boolean;
}

export const useSectionsStore = defineStore(EStoreNames.WORKTIME_USAGE_SECTION, {
  state: (): State => ({
    Card: {} as CardViewModel,
    Individuals: [],
    Summary: [],
    WellBeings: [],
    Breadcrumb: [],
    Distributions: [],
    Graphs: undefined,
    Teamset: {} as ClockSectionTeamset,
    Invitations: [],
    DownloadKey: '',
    IndividualEmployeeModel: {} as EmployeeClockViewModel,
    isLoading: false,
  }),
  actions: {
    async filter(payload: ClockSectionRequest) {
      this.isLoading = true;
      try {
        const response = await ClockApiService.clockApiGetSection(payload);
        this.Card = response.Card!;
        this.Summary = response.Summary;
        this.Individuals = response.Individuals;
        this.WellBeings = response.WellBeings;
        this.Breadcrumb = response.Breadcrumb;
        this.Distributions = response.Distributions;
        this.Graphs = response.Graphs;
        this.Teamset = response.Teamset;
        this.Invitations = response.Invitations;
        this.DownloadKey = response.DownloadKey;
        return response;
      } finally {
        this.isLoading = false;
      }
    },
    async filterSection(payload: ClockSectionRequest) {
      this.isLoading = true;
      try {
        const response = await ClockApiService.clockApiGetSection(payload);
        this.Card = response.Card!;
        this.Summary = response.Summary;
        this.Individuals = response.Individuals;
        this.WellBeings = response.WellBeings;
        this.Breadcrumb = response.Breadcrumb;
        this.Distributions = response.Distributions;
        this.Graphs = response.Graphs;
        this.Teamset = response.Teamset;
        this.Invitations = response.Invitations;
        this.DownloadKey = response.DownloadKey;
        return response;
      } finally {
        this.isLoading = false;
      }
    },
    async filterEmployee(payload: ClockEmployeeRequest) {
      this.isLoading = true;
      try {
        const response = await ClockApiService.clockApiGetEmployee(payload);
        this.Card = response.Card!;
        this.Breadcrumb = response.Breadcrumbs as ClockBreadCrumb[];
        this.IndividualEmployeeModel = response.Model;
        return response;
      } finally {
        this.isLoading = false;
      }
    },
    async saveWebClock(payload: WebClockModifyModel) {
      return await ClockApiService.clockApiSaveWebClock(payload);
    },
  },
});
