import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
import type { ITimeZone, IProfileUser, IProfile, ILicanse } from '@/interfaces/profile/profile';

interface State {
  TimeZoneList: ITimeZone[];
  User: IProfileUser;
  IsMailSubscribe: IProfile['IsMailSubscribe'];
  License: ILicanse;
  TimeZone: IProfile['TimeZone'];
  LanguageCode: IProfile['LanguageCode'];
}

export const useProfileStore = defineStore(EStoreNames.PROFILE, {
  state: (): State => ({
    TimeZoneList: [],
    User: {} as IProfileUser,
    IsMailSubscribe: false,
    License: {} as ILicanse,
    TimeZone: '',
    LanguageCode: '',
  }),
  actions: {
    filter() {
      const api = '/webapi/profile';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            this.User = useMockData ? response[api].Employee : (response as IProfile).Employee;
            this.TimeZone = useMockData ? response[api].TimeZone : (response as IProfile).TimeZone;
            this.LanguageCode = useMockData ? response[api].LanguageCode : (response as IProfile).LanguageCode;
            this.IsMailSubscribe = useMockData
              ? response[api].IsMailSubscribe
              : (response as IProfile).IsMailSubscribe;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    filterLicense() {
      const api = '/webapi/license';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            this.License = useMockData ? response[api] : (response as ILicanse);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    filterTimeZones() {
      const api = '/webapi/company/timezones';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            this.TimeZoneList = useMockData ? response[api] : (response as ITimeZone);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
