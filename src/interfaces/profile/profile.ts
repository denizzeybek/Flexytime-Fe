export interface ITimeZone {
  ID: string;
  Name: string;
}

export interface IProfileUser {
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

export interface IProfile {
  UserDuty: string | null;
  UserTitle: string;
  ImagePath: string;
  EmailConfirmed: boolean;
  EmailAddress: string;
  IsMailSubscribe: boolean;
  HasGoogle: boolean;
  HasOffice: boolean;
  TimeZone: string;
  LanguageCode: string;
  IsUnsubscribe: boolean;
  Employee: IProfileUser;
}

export interface ILicanse {
  CustomerName: string;
  ExpireDate: string;
  RemainingDays: number;
  TotalUsers: number;
  ActiveUsers: number;
  LicensedUsers: number;
  RemainingUsers: number;
  IsUnsubscribe: true;
  LicenseKey: string;
}
