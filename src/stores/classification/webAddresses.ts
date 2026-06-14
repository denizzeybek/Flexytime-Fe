import { defineStore } from 'pinia';

import { CategoryService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { WebClockModifyDto } from '@/client';

export interface WebAddressViewModel {
  ID: string;
  HostName: string;
  Name: string;
  AlwaysOn: boolean;
  Domain: number;
}

export interface WebAddressesFilterRequest {
  start?: number;
  length?: number;
  search?: string;
  sort?: string;
  descending?: boolean;
}

interface QueryResponse {
  Total?: number;
  Filtered?: number;
  Items?: WebAddressViewModel[];
}

interface State {
  list: WebAddressViewModel[];
  totalItems: number;
  loading: boolean;
  lastQuery: WebAddressesFilterRequest | null;
}

export const useClassificationWebAddressesStore = defineStore(
  EStoreNames.CLASSIFICATION_WEB_ADDRESSES,
  {
    state: (): State => ({
      list: [],
      totalItems: 0,
      loading: true,
      lastQuery: null,
    }),
    getters: {
      isLoading: (state): boolean => state.loading,
    },
    actions: {
      async filter(payload: WebAddressesFilterRequest) {
        try {
          this.loading = true;
          this.lastQuery = payload;
          const body = {
            Start: payload.start ?? 1,
            Length: payload.length ?? 10,
            Sort: payload.sort ?? '',
            Descending: payload.descending ?? false,
            Search: payload.search ?? '',
          };
          const response = (await CategoryService.categoryControllerQueryWebAddresses(
            body as never,
          )) as unknown as QueryResponse;

          this.list = Array.isArray(response.Items) ? response.Items : [];
          this.totalItems = typeof response.Total === 'number' ? response.Total : 0;
          return this.list;
        } finally {
          this.loading = false;
        }
      },
      async save(payload: WebClockModifyDto & { ID?: string; AlwaysOn?: boolean; Domain?: number }) {
        await CategoryService.categoryControllerSaveWebAddress(payload as never);

        const idx = this.list.findIndex((item) => item.ID === payload.ID);
        if (idx !== -1) {
          if (typeof payload.Domain === 'number' && payload.Domain !== 1) {
            this.list[idx].Domain = payload.Domain;
          }
          if (typeof payload.AlwaysOn === 'boolean') {
            this.list[idx].AlwaysOn = payload.AlwaysOn;
          }
        }
      },
    },
  },
);
