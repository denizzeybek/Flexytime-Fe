export interface ICompany {
  ID: string;
  Name: string;
  Fullname: string;
  Email: string;
  Password: string | null;
  UserCount: number;
  Month: number;
  License: string;
  CreateDate: string;
  LastActivityDate: string | null;
  DashboardActivityDate: string | null;
}
