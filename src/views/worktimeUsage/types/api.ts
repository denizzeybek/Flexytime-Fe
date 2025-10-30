/**
 * API Request and Response Type Definitions for Worktime Usage V2
 */

// ============================================
// API Request Payloads
// ============================================

/**
 * Request payload for /clock/section endpoint
 * Used for Team and Department views, also provides Individuals data
 */
export interface ISectionRequest {
  Perspective: number;
  Interval: string;
  TeamId: string | null;
}

/**
 * Request payload for /clock/employee endpoint
 * Used for Individual employee view
 */
export interface IEmployeeRequest {
  Perspective: number;
  Interval: string;
  MemberId: string;
}

// ============================================
// Common Shared Types
// ============================================

export interface IUserType {
  Name: string;
  Availability: string;
  Abbreviation: string;
  ImageUrl: string;
  MemberUrl: string;
  OnLeave: boolean;
  LeaveType: string;
}

export interface ISupervisor {
  Name: string;
  Abbreviation: string;
  ImageUrl: string;
  Availability: string;
  MemberId?: string;
  MemberUrl?: string;
}

export interface ITimeMetric {
  time: string;
  statisticType: string;
}

export interface IWellbeing {
  Danger: any[];
  Warning: any[];
  Success: any[];
}

// ============================================
// Card & User Badge
// ============================================

export interface ICard {
  ImageUrl: string;
  Name: string;
  Title: string;
  Abbreviation: string;
  Email: string;
  Availability: string;
}

// ============================================
// Summary & Badges
// ============================================

export interface ISummary {
  id: string;
  statisticType: string;
  time: string;
}

// ============================================
// Breadcrumb
// ============================================

export interface IBreadcrumb {
  id: string;
  title: string;
  path: string;
  isLastElement: boolean;
}

// ============================================
// Team View Data
// ============================================

export interface ITeam {
  ID: string;
  TeamName: string;
  SuperVisorName: string;
  Team: IUserType;
  Supervisor: ISupervisor;
  Start: ITimeMetric;
  End: ITimeMetric;
  Work: ITimeMetric;
  Leisure: ITimeMetric;
  Meeting: ITimeMetric;
  Unclassified: ITimeMetric;
  Wellbeing: IWellbeing;
}

export interface ITeamset {
  IsTeam: boolean;
  Teams: ITeam[];
  Members: any[];
}

// ============================================
// Employee/Individual List Data
// ============================================

export interface IIndividual {
  ID: string;
  EmployeeName: string;
  TeamName: string;
  Employee: IUserType;
  Start: ITimeMetric;
  End: ITimeMetric;
  Work: ITimeMetric;
  Leisure: ITimeMetric;
  Meeting: ITimeMetric;
  Unclassified: ITimeMetric;
  Wellbeing: IWellbeing;
  Team: IUserType;
  Tags: string[];
  TagsDisplay: string;
}

// ============================================
// Distribution Data
// ============================================

export interface IDistribution {
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

// ============================================
// Graph Data
// ============================================

export interface IGraph {
  WellBeings?: any[];
  Summary?: {
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      stack: string;
    }[];
    labels: string[];
    Unit: string;
  };
}

// ============================================
// Web History Data
// ============================================

export interface IWebClock {
  ID: string | null;
  Url: string;
  TopicName: string;
  Spent: string;
  Date: string;
  AllocationName: string | null;
  RecordDate: string;
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
  Chart: {
    data: any;
    valueField: string | null;
    titleField: string | null;
  };
}

// ============================================
// API Response Types
// ============================================

/**
 * Response from /clock/section endpoint
 * Contains team/department data AND individuals list
 */
export interface ISectionResponse {
  Card: ICard;
  Summary: ISummary[];
  WellBeings: any[];
  Breadcrumb: IBreadcrumb[];
  Distributions: IDistribution[];
  Graphs: IGraph;
  Teamset: ITeamset;
  Individuals: IIndividual[];
  Invitations: any[];
  DownloadKey: string;
}

/**
 * Response from /clock/employee endpoint
 * Contains individual employee detailed data
 */
export interface IEmployeeResponse {
  Card: ICard;
  Breadcrumb: IBreadcrumb[];
  Summary: ISummary[];
  WellBeings: any[];
  Distributions: IDistribution[];
  Graphs: IGraph;
  WebClocks?: IWebClocks[];
}
