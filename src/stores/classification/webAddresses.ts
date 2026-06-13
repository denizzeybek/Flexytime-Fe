import { defineStore } from 'pinia';

import { CategoryService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { WebClockModifyDto } from '@/client';

/**
 * v2 `WebAddressViewModel` shape returned by `category/webaddresses` (list +
 * query) and `category/webaddress` (single). The RESHAPED-v2 contract dropped
 * the legacy presentational fields (`DomainDisplay`, `TopicName`,
 * `IsWork/IsMeeting/IsLeisure`, `Timeout`) — the FE i18n labels + icons now
 * derive from the numeric `Domain` directly via `EDomain` / `getDomainEnum`.
 */
export interface WebAddressViewModel {
  ID: string;
  HostName: string;
  Name: string;
  AlwaysOn: boolean;
  Domain: number;
}

/**
 * What the FE table emits when paginating / sorting / searching. Mirrors the
 * legacy `DataTableQueryModel` (lowercase) so the table components don't
 * change; the store maps it to the v2 PascalCase `ClassificationQuery` shape
 * before sending.
 */
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
      loading: false,
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
          // v2 ClassificationQuery body (PascalCase). `Start` is 1-based on
          // the BE side.
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
      async save(payload: WebClockModifyDto) {
        await CategoryService.categoryControllerSaveWebAddress(payload as never);

        // In-place mutation to avoid re-querying the full page.
        const idx = this.list.findIndex((item) => item.ID === payload.ID);
        if (idx !== -1) {
          // Domain === 1 is "Unclassified-skip": keep the previous domain value.
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
