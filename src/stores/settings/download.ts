import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
import type { IDownload } from '@/interfaces/settings/download';

interface State {
  InvitationLink: IDownload['InvitationLink'];
  InvitationId: IDownload['InvitationId'];
  ServiceKey: IDownload['ServiceKey'];
}

export const useSettingsDownloadsStore = defineStore(EStoreNames.SETTINGS_DOWNLOAD, {
  state: (): State => ({
    InvitationLink: '',
    InvitationId: '',
    ServiceKey: '',
  }),
  actions: {
    filter() {
      const api = '/webapi/setting/download';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            this.InvitationLink = useMockData
              ? response[api].InvitationLink
              : (response as IDownload).InvitationLink;
            this.InvitationId = useMockData
              ? response[api].InvitationId
              : (response as IDownload).InvitationId;
            this.ServiceKey = useMockData
              ? response[api].ServiceKey
              : (response as IDownload).ServiceKey;

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
