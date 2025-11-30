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
  SectionClockSummary,
  WebClockModifyModel,
} from '@/client';
import type { IIndividualEmployeeModel } from '@/interfaces/worktimeUsage/section';

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
  IndividualEmployeeModel?: IIndividualEmployeeModel;
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
    IndividualEmployeeModel: {} as IIndividualEmployeeModel,
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
        // EmployeeClockViewModel has different structure - store the whole model
        this.IndividualEmployeeModel = response.Model as any;
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
