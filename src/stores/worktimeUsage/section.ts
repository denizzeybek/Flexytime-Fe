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
    filterSection() {
      const api = '/webapi/clock/section';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            this.Card = useMockData ? response[api].Card : (response as ISection).Card;
            this.Summary = useMockData ? response[api].Summary : (response as ISection).Summary;
            this.Individuals = useMockData
              ? response[api].Individuals
              : (response as ISection).Individuals;
            this.WellBeings = useMockData
              ? response[api].WellBeings
              : (response as ISection).WellBeings;
            this.Breadcrumb = useMockData
              ? response[api].Breadcrumb
              : (response as ISection).Breadcrumb;
            this.Distributions = useMockData
              ? response[api].Distributions
              : (response as ISection).Distributions;
            this.Teamset = useMockData ? response[api].Teamset : (response as ISection).Teamset;
            this.Invitations = useMockData
              ? response[api].Invitations
              : (response as ISection).Invitations;
            this.DownloadKey = useMockData
              ? response[api].DownloadKey
              : (response as ISection).DownloadKey;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
