import { defineStore } from 'pinia';

import axios from 'axios';

import { EStoreNames } from '@/stores/storeNames.enum';

import type { IWorkingHour,IWorkingHourDay } from '@/interfaces/company/workingHour';

interface State {
  days: IWorkingHourDay[];
  maxIdleTime: IWorkingHour['MaxIdleTime'];
  shiftRangeTime: IWorkingHour['ShiftRangeTime'];
  timeZone: IWorkingHour['TimeZone'];
}

export const useCompanyWorkingHoursStore = defineStore(EStoreNames.COMPANY_WORKING_HOURS, {
  state: (): State => ({
    days: [],
    maxIdleTime: '',
    shiftRangeTime: '',
    timeZone: '',
  }),
  actions: {
    async filter() {
      const url = '/webapi/company/workhours';
      const response = await axios.get<IWorkingHour>(url);

      this.days = (response.data as IWorkingHour).Days;
      this.maxIdleTime = (response.data as IWorkingHour).MaxIdleTime;
      this.shiftRangeTime = (response.data as IWorkingHour).ShiftRangeTime;
      this.timeZone = (response.data as IWorkingHour).TimeZone;

      return response.data;
    },
    async save(payload) {
      const url = '/webapi/company/workhours/save';
      return await axios.post<IWorkingHour>(url, payload);
    },
  },
});
