import type { IAnnual, IAnnualDTO, IAnnualMember } from '@/interfaces/hrSettings/annual';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';

interface State {
  activeList: IAnnual[];
  passiveList: IAnnual[];
  activeTotalItems: number;
  passiveTotalItems: number;
  members: IAnnualMember[]
}

export const useHRSettingsAnnualsStore = defineStore(EStoreNames.HR_SETTINGS_ANNUALS, {
  state: (): State => ({
    activeList: [],
    passiveList: [],
    activeTotalItems: 0,
    passiveTotalItems: 0,
    members: []
  }),
  actions: {
    async filter() {
      const url = '/webapi/definition/annuals';
      const response = await axios.get<IAnnualDTO>(url);

      const data = response.data as IAnnualDTO;
      this.activeList = data.ActiveAnnuals;
      this.activeTotalItems = data.ActiveAnnuals?.length || 0;

      this.passiveList = data.PassedAnnuals;
      this.passiveTotalItems = data.PassedAnnuals?.length || 0;

      this.members = data.Members;

      return data;
    },
    async save(payload) {
      const url = '/webapi/definition/annual/save';
      return await axios.post<any>(url, payload);
    },
    async delete(ID: { ID: string }) {
      const url = '/webapi/definition/annual/delete';
      return await axios.post<any>(url, ID);
    },
  },
});
