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

export interface ISection {
  Individuals: IIndividuals[]
  Card: ICard;
  Summary: ISummary[];
  WellBeings: any[];
  Breadcrumb: IBreadcrumb[];
  Distributions: IDistributions[];
  Graphs: IGraphs[];
  Teamset: ITeamset;
  Invitations: any[];
  DownloadKey: string;
}
