import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
import type {
  ISection,
  ICard,
  ISummary,
  IBreadcrumb,
  IDistributions,
  IGraphs,
  ITeamset,
  IIndividuals,
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
  }),
  actions: {
    async filter(payload) {
      const url = '/webapi/clock/section';

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
      return response.data;
    },
    filterSection(payload) {
      const api = '/webapi/clock/section';

      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url, payload)
          .then((response: any) => {
            this.Card = (response as ISection).Card;
            this.Summary = (response as ISection).Summary;
            this.Individuals = (response as ISection).Individuals;
            this.WellBeings = (response as ISection).WellBeings;
            this.Breadcrumb = (response as ISection).Breadcrumb;
            this.Distributions = (response as ISection).Distributions;
            this.Teamset = (response as ISection).Teamset;
            this.Invitations = (response as ISection).Invitations;
            this.DownloadKey = (response as ISection).DownloadKey;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  },
});
