export interface IHoliday {
  ID: string;
  StartDate: string;
  StartTime: string;
  EndDate: string;
  EndTime: string;
  StartFullDay: boolean;
  EndFullDay: boolean;
  Name: string;
  Repeat: boolean;
  Days: number;
  StartDateText: string;
  EndDateText: string;
}
