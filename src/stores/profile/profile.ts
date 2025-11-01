import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import type { ITimeZone, IProfileUser, IProfile, ILicanse } from '@/interfaces/profile/profile';
// import type {UserModel, Timezone, Language, Alerts, Employee, Wizard} from '@/interfaces/common/userModel';
interface State {
  TimeZoneList: ITimeZone[];
  User: IProfileUser;
  IsMailSubscribe: IProfile['IsMailSubscribe'];
  License: ILicanse;
  TimeZone: IProfile['TimeZone'];
  LanguageCode: IProfile['LanguageCode'];
  GeneralProfile: IProfile;
}

export const useProfileStore = defineStore(EStoreNames.PROFILE, {
  state: (): State => ({
    GeneralProfile: {} as IProfile,
    User: {} as IProfileUser,
    TimeZoneList: [],
    IsMailSubscribe: false,
    License: {} as ILicanse,
    TimeZone: '',
    LanguageCode: '',
  }),
  actions: {
    async filter() {
      const url = '/webapi/profile';
      const response = await axios.get<IProfile>(url);
      this.GeneralProfile = response.data as IProfile;
      this.User = (response.data as IProfile).Employee;
      this.TimeZone = (response.data as IProfile).TimeZone;
      this.LanguageCode = (response.data as IProfile).LanguageCode;
      this.IsMailSubscribe = (response.data as IProfile).IsMailSubscribe;
      this.TimeZoneList  = (response.data as IProfile).Timezones;

      return response.data;
    },
    async filterLicense() {
      const url = '/webapi/license';
      const response = await axios.post<ILicanse>(url);
      this.License = response.data as ILicanse;
      
      return response.data;
    },
  },
});
