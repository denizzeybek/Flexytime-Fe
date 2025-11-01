import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import type {
  ISection,
  ICard,
  ISummary,
  IBreadcrumb,
  IDistributions,
  IGraphs,
  ITeamset,
  IIndividuals,
  IIndividualEmployeeModel,
} from '@/interfaces/worktimeUsage/section';

interface State {
  Card: ICard;
  Individuals?: IIndividuals[];
  Summary?: ISummary[];
  WellBeings?: any[];
  Breadcrumb?: IBreadcrumb[];
  Distributions?: IDistributions[];
  Graphs?: IGraphs[];
  Teamset?: ITeamset;
  Invitations?: any[];
  DownloadKey?: string;
  IndividualEmployeeModel?: IIndividualEmployeeModel;
  isLoading: boolean;
}

export const useSectionsStore = defineStore(EStoreNames.WORKTIME_USAGE_SECTION, {
  state: (): State => ({
    Card: {} as ICard,
    Individuals: [],
    Summary: [],
    WellBeings: [],
    Breadcrumb: [],
    Distributions: [],
    Teamset: {} as ITeamset,
    Invitations: [],
    DownloadKey: '',
    IndividualEmployeeModel: {} as IIndividualEmployeeModel,
    isLoading: false,
  }),
  actions: {
    async filter(payload) {
      const url = '/webapi/clock/section';
      this.isLoading = true;
      const response = await axios.post<ISection>(url, payload);
      this.Card = (response.data as ISection).Card;
      this.Summary = (response.data as ISection).Summary;
      this.Individuals = (response.data as ISection).Individuals;
      this.WellBeings = (response.data as ISection).WellBeings;
      this.Breadcrumb = (response.data as ISection).Breadcrumb;
      this.Distributions = (response.data as ISection).Distributions;
      this.Teamset = (response.data as ISection).Teamset;
      this.Invitations = (response.data as ISection).Invitations;
      this.DownloadKey = (response.data as ISection).DownloadKey;
      this.isLoading = false;
      return response.data;
    },
    async filterSection(payload) {
      const url = '/webapi/clock/section';
      this.isLoading = true;

      const response = await axios.post<ISection>(url, payload);
      this.Card = (response.data as ISection).Card;
      this.Summary = (response.data as ISection).Summary;
      this.Individuals = (response.data as ISection).Individuals;
      this.WellBeings = (response.data as ISection).WellBeings;
      this.Breadcrumb = (response.data as ISection).Breadcrumb;
      this.Distributions = (response.data as ISection).Distributions;
      this.Teamset = (response.data as ISection).Teamset;
      this.Invitations = (response.data as ISection).Invitations;
      this.DownloadKey = (response.data as ISection).DownloadKey;
      this.isLoading = false;
      return response.data;
    },
    async filterEmployee(payload) {
      const url = '/webapi/clock/employeev2';
      this.isLoading = true;

      const response = await axios.post<ISection>(url, payload);
      this.Card = (response.data as ISection).Card;
      this.Breadcrumb = (response.data as ISection).Breadcrumb;
      this.Summary = (response.data as ISection).Summary;
      this.WellBeings = (response.data as ISection).WellBeings;
      this.Distributions = (response.data as ISection).Distributions;
      this.Graphs = (response.data as ISection).Graphs;
      this.isLoading = false;
      return response.data;
    },
  },
});
