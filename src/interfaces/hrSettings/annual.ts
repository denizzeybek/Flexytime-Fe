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
  Name?: string;
  Repeat: boolean;
}

export interface IAnnualMember {
  ID: string;
  Name: string;
  Type: number;
}

export interface IAnnualDTO {
  ActiveAnnuals: IAnnual[];
  PassedAnnuals: IAnnual[];
  Members: IAnnualMember[];
}
