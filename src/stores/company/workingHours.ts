import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
import type { IWorkingHourDay, IWorkingHour } from '@/interfaces/company/workingHour';

interface State {
  Days: IWorkingHourDay[];
  MaxIdleTime: IWorkingHour['MaxIdleTime'];
  ShiftRangeTime: IWorkingHour['ShiftRangeTime'];
  TimeZone: IWorkingHour['TimeZone'];
}

export const useCompanyWorkingHoursStore = defineStore(EStoreNames.COMPANY_WORKING_HOURS, {
  state: (): State => ({
    Days: [],
    MaxIdleTime: '',
    ShiftRangeTime: '',
    TimeZone: '',
  }),
  actions: {
    filter() {
      const api = '/webapi/company/workhours';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            this.Days = useMockData ? response[api].Days : (response as IWorkingHour).Days;
            this.MaxIdleTime = useMockData ? response[api].MaxIdleTime : (response as IWorkingHour).MaxIdleTime;
            this.ShiftRangeTime = useMockData ? response[api].ShiftRangeTime : (response as IWorkingHour).ShiftRangeTime;
            this.TimeZone = useMockData ? response[api].TimeZone : (response as IWorkingHour).TimeZone;

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
