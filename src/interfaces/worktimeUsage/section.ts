export interface ICard {
  ImageUrl: string;
  Name: string;
  Title: string;
  Abbreviation: string;
  Email: string;
  Availability: string;
}

export interface ISummary {
  id: string;
  statisticType: string;
  time: string;
}

export interface IBreadcrumb {
  id: string;
  title: string;
  path: string;
  isLastElement: boolean;
}

export interface IDistributions {
  id: string;
  statisticType: string;
  time: string;
  Applications: {
    imgPath: string;
    title: string;
    time: string;
  }[];
  Chart: {
    label: string;
    value: number;
  }[];
}

export interface IGraphs {
  WellBeings: any[];
  Summary: {
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      stack: string;
    };
  };
}

export interface Supervisor {
  Name: string;
  Abbreviation: string;
  ImageUrl: string;
  Availability: string;
}
export interface Start {
  time: string;
  statisticType: string;
}
export interface End {
  time: string;
  statisticType: string;
}
export interface Work {
  time: string;
  statisticType: string;
}
export interface Leisure {
  time: string;
  statisticType: string;
}
export interface Meeting {
  time: string;
  statisticType: string;
}
export interface Unclassified {
  time: string;
  statisticType: string;
}
export interface Wellbeing {
  Danger: any[];
  Warning: any[];
  Success: any[];
}

export interface UserType {
  Name: string;
  Availability: string;
  Abbreviation: string;
  ImageUrl: string;
  MemberUrl: string;
  OnLeave: boolean;
  LeaveType: string;
}
export interface IIndividuals {
  ID: string;
  EmployeeName: string;
  TeamName: string;
  Employee: UserType;
  Start: Start;
  End: End;
  Work: Work;
  Leisure: Leisure;
  Meeting: Meeting;
  Unclassified: Unclassified;
  Wellbeing: Wellbeing;
  Team: UserType;
  Tags: string[];
  TagsDisplay: string;
}

export interface Teams {
  ID: string;
  TeamName: string;
  SuperVisorName: string;
  Team: UserType;
  Supervisor: Supervisor;
  Start: Start;
  End: End;
  Work: Work;
  Leisure: Leisure;
  Meeting: Meeting;
  Unclassified: Unclassified;
  Wellbeing: Wellbeing;
}

export interface ITeamset {
  IsTeam: boolean;
  Teams: Teams[];
  Members: any[];
}

export interface IEmployee {
  id: string;
  fullname: string;
  teamname: string | null;
  teamid: string | null;
  abbreviation: string;
  avatarcolor: string;
  title: string;
  imageurl: string;
  since: string;
  uninstalldate: string;
  islicensed: boolean;
  Availability: number;
  AvailabilityImageUrl: string;
  Tags: any[]; // Tags detaylıysa ayrı interface tanımlanabilir
  HasAnnual: boolean;
  AnnualStart: string | null;
  AnnualEnd: string | null;
  AnnualDays: number;
  AnnualType: string | null;
  Email: string | null;
  CompanyName: string | null;
}

export interface ISection {
  Individuals: IIndividuals[];
  Card: ICard;
  Summary: ISummary[];
  WellBeings: any[];
  Breadcrumb: IBreadcrumb[];
  Distributions: IDistributions[];
  Graphs: IGraphs[];
  Teamset: ITeamset;
  Invitations: any[];
  DownloadKey: string;
  Employee?: IEmployee[];
}

export interface IChart2 {
  data: number[];
  labels: string[];
}

export interface IChart {
  data: any; // Eğer tip kesinleşirse (örneğin: number[]), burada güncelleme yapılabilir.
  valueField: string | null;
  titleField: string | null;
}

export interface IAllocation {
  id: string;
  name: string;
  imageurl: string | null;
  spend: string;
  icon: string;
  color: string;
  frontcolor: string;

  Allocations: IAllocation[]; // iç içe aynı yapı
  Chart2: IChart2;
  Chart: IChart;

  Description: string | null;
  Time: string | null;
  Type: number;
  BackgroundColor: string | null;
  BorderColor: string | null;
}

export interface ICalendar {
  view: string;
  date: string;
  events: ICalendarEvent[];
}

export interface ICalendarEvent {
  [key: string]: any;
}

export interface IModelSummary {
  Start: string;
  End: string;
  Remain: string;
  Extra: string;
  RemainPercent: string;
  Allocations: IAllocation[];
}

export interface IWebClock {
  ID: string | null;
  Url: string;
  TopicName: string;
  Spent: string; // "00:35" gibi string süre
  Date: string; // "17.07.2025"
  AllocationName: string | null;
  RecordDate: string; // ISO format gibi
  AllocationId: string;
  Domain: number;
}

export interface IWebClocks {
  Name: string;
  WebClocks: IWebClock[];
  Type: number;
  Spent: string;
  Color: string;
  Icon: string;
  ID: string;
  Chart: IChart;
}

export interface IIndividualEmployeeModel {
    Allocations: IAllocation[];
    Calendar: ICalendar[];
    Employee: IEmployee[];
    Graph: IGraphs[];
    Manuals: any[];
    Summary: ISummary;
    WebClocks: IWebClocks[];
    WellBeings: any[];
  }

export interface IIndividualEmployee {
  Breadcrumb: IBreadcrumb[];
  Card: ICard;
  Model: IIndividualEmployeeModel;
  Graphs: IGraphs[];
}
