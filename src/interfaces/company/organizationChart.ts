export interface IOrganizationChartNodes {
  title: string;
  children: IOrganizationChartNodes[];
  Abbreviation?: string;
  Name?: string;
  ID?: string;
  TitleName?: string;
  TitleId?: string;
  MemberId?: string;
  MemberName?: string | null;
  TeamId?: string | null;
}

export interface IOrganizationChartMembers {
  ID: string;
  Name: string;
}

export interface IOrganizationChartTitles {
  ID: string;
  Name: string;
}

export interface IOrganizationChart {
  Nodes: IOrganizationChartNodes[];
  Members: IOrganizationChartMembers[];
  Titles: IOrganizationChartTitles[];
}
