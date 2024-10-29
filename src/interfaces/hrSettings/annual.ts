export interface IAnnual {
  ID: string;
  StartDate: string;
  StartTime: string;
  EndDate: string;
  EndTime: string;
  StartFullDay: boolean;
  EndFullDay: boolean;
  MemberName: string;
  MemberId: string;
  LeaveType: string;
  Abbreviation: string;
  ImageUrl: string;
  Days: number;
  IsActive: boolean;
  StartDateText: string;
  EndDateText: string;
}

export interface IAnnualDTO {
  ActiveAnnuals: IAnnual[];
  PassedAnnuals: IAnnual[];
}
