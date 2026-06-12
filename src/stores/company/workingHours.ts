import { defineStore } from 'pinia';

import { CompanyService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { WorkDayViewModel, WorkSettingViewModel } from '@/client';

interface State {
  days: WorkDayViewModel[];
  maxIdleTime: WorkSettingViewModel['MaxIdleTime'];
  shiftRangeTime: WorkSettingViewModel['ShiftRangeTime'];
  timeZone: WorkSettingViewModel['TimeZone'];
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
      const data = await CompanyService.companyControllerWorkHours();

      this.days = data.Days ?? [];
      this.maxIdleTime = data.MaxIdleTime;
      this.shiftRangeTime = data.ShiftRangeTime;
      this.timeZone = data.TimeZone;

      return data;
    },
    async save(payload: WorkSettingViewModel) {
      return await CompanyService.companyControllerSaveWorkHours(payload);
    },
  },
});
