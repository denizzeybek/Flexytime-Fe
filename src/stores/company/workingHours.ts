import { defineStore } from 'pinia';

import { CompanyService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { WorkDayViewModel, WorkSettingDto } from '@/client';

interface State {
  days: WorkDayViewModel[];
  maxIdleTime: WorkSettingDto['MaxIdleTime'];
  shiftRangeTime: WorkSettingDto['ShiftRangeTime'];
  timeZone: WorkSettingDto['TimeZone'];
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
    async save(payload: WorkSettingDto) {
      return await CompanyService.companyControllerSaveWorkHours(payload);
    },
  },
});
