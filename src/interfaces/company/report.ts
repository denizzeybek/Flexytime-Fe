export interface IReportEmployee {
  ID: string;
  Name: string;
}

export interface IReportProject {
  ID: string;
  Name: string;
}

export interface IReportTag {
  ID: string;
  Name: string;
}

export interface IReportTeam {
  ID: string;
  Name: string;
}

export interface IReportFilter {
  Employees: IReportEmployee[];
  Projects: IReportProject[];
  Tags: IReportTag[];
  Teams: IReportTeam[];
}

/* ******************************************************** */

export interface IReportSummary {
  Billable: string;
  Unbillable: string;
  Total: string;
}

export interface IReportGraphGroup {
  label: string;
  value: number;
}

export interface IReportDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
}

export interface IReportGraph {
  Main: {
    labels: string[];
    datasets: IReportDataset[];
    Unit: string;
  };
  Group: IReportGraphGroup[];
}

export interface IReportGrouping {
  Group1: string;
  Group2: string;
  Total: string;
}

export interface IReportQuery {
  Summary: IReportSummary;
  Graphs: IReportGraph;
  Grouping: IReportGrouping[];
  DownloadKey: string;
}

/* ******************************************************** */

export interface IReportType {
  ID: string;
  Name: string;
}

export interface IReportRecipientType {
  ID: string;
  Name: string;
}

export interface IReportSection {
  ID: string;
  Name: string;
}

export interface IReportItem {
  CronDisplay: string;
  TypeDisplay: string;
  SectionNameDisplay: string;
  ScheduleDisplay: string;
  ID: string;
  To: string;
  Cc: string;
  Bcc: string;
  Type: number;
  Cron: string | null;
  SectionId: string | null;
  Schedule: string | null;
}

export interface IDefaultReport {
  ReportTypes: IReportType[];
  ReportRecipientTypes: IReportRecipientType[];
  SectionList: IReportSection[];
  Items: IReportItem[];
}
