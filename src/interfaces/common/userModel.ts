export interface Timezone {
  ID: string;
  Name: string;
}

export interface Language {
  Culture: string;
  Code: string;
  Name: string;
}

export interface Alerts {
  IsLicenseDanger: boolean;
  ExpireDays: number;
  IsLicenseWarning: boolean;
  Email: string;
  IsConfirmation: boolean;
  IsDownloaded: boolean;
  IsWaitingData: boolean;
  CardError: string | null;
  IsCardError: boolean;
}

export interface Employee {
  id: string | null;
  fullname: string;
  teamname: string | null;
  teamid: string | null;
  abbreviation: string;
  avatarcolor: string | null;
  title: string;
  imageurl: string;
  since: string | null;
  uninstalldate: string | null;
  islicensed: boolean;
  Availability: number;
  AvailabilityImageUrl: string;
  Tags: string[];
  HasAnnual: boolean;
  AnnualStart: string | null;
  AnnualEnd: string | null;
  AnnualDays: number;
  AnnualType: string | null;
  Email: string;
  CompanyName: string;
}

export interface Wizard {
  IsSingleUser: boolean;
  IsFresh: boolean;
  Permissions: string[];
  Roles: string[];
  MemberId: string;
  AccessKey: string | null;
  Email: string;
  Fullname: string;
  CompanyName: string;
  IsEmployee: boolean;
  IsHR: boolean;
  IsManager: boolean;
}

export interface UserModel {
  UserDuty: string | null;
  UserTitle: string;
  ImagePath: string;
  EmailConfirmed: boolean;
  EmailAddress: string;
  IsMailSubscribe: boolean;
  HasGoogle: boolean;
  HasOffice: boolean;
  Timezones: Timezone[];
  TimeZone: string;
  Languages: Language[];
  LanguageCode: string;
  HasOutlook: boolean;
  GoogleCalendars: any[];
  OfficeCalendars: any[];
  OutlookCalendars: any[];
  Alerts: Alerts;
  Employee: Employee;
  Wizard: Wizard;
  IsUnsubscribe: boolean;
}
