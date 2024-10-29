export interface IWorkingHour {
  MaxIdleTime: string;
  ShiftRangeTime: string;
  TimeZone: string;
  Days: IWorkingHourDay[];
}

export interface IWorkingHourDay {
  ID: number;
  Name: string;
  IsWorkday: boolean;
  StartTime: string;
  EndTime: string;
}

export interface ITimeZone {
  ID: string;
  Name: string;
}
