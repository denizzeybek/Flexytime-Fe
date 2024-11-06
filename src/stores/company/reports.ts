import type { IReportFilter, IReportGraph, IReportGrouping, IReportQuery, IReportSummary } from '@/interfaces/company/report';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';

interface State {
  filters: IReportFilter;
  query: IReportQuery;
  summary: IReportSummary;
  graphs: IReportGraph;
  grouping: IReportGrouping;
}

export const useCompanyReportsStore = defineStore(EStoreNames.COMPANY_REPORTS, {
  state: (): State => ({
    filters: {} as IReportFilter,
    query: {} as IReportQuery,
    summary: {} as IReportSummary,
    graphs: {} as IReportGraph,
    grouping: {} as IReportGrouping,
  }),
  actions: {
    fetchFilters() {
      const api = '/webapi/report/filters';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const filters = useMockData ? response[api] : (response as IReportFilter);
            this.filters = filters;

            resolve(filters);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    fetchElasticReportQuery() {
      const api = '/webapi/report/query';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            const query = useMockData ? response[api] : (response as IReportQuery);
            this.query = query;
            this.summary = query.Summary;
            this.graphs = query.Graphs;
            this.grouping = query.Grouping

            resolve(query);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
