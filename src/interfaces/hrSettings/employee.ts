export interface IEmployeeMember {
  Abbreviation: string;
  RoleName: string;
  TeamName: string;
  ImageUrl: string;
  ManagementTitleId: any;
  EmployeeTitleId: any;
  EmployeeTitles: any;
  ManagerTitles: any;
  TagsDisplay: string;
  EnabledDisplay: string;
  ID: string;
  MemberName: string;
  TeamId: string;
  TitleId: string;
  TitleName: string;
  Salary: string;
  OperatingUser: string,
  Password: any;
  Email: any;
  WindowsIdentity: string;
  Enabled: boolean;
  Role: number;
  Tags: any[];
  ImageData: any;
}

export interface IEmployeeRole {
  ID: string;
  Name: string;
  Type: number;
}

export interface IEmployeeTitle {
  ID: string;
  Name: string;
  Type: number;
}

export interface IManagerTitle {
  ID: string;
  Name: string;
  Type: number;
}

export interface IEmployeeTeam {
  ID: string;
  Name: string;
  Type: number;
}

export interface IEmployeeTag {
  ID: string;
  Name: string;
  Type: number;
}

export interface IEmployeeInvitation {
  ID: string;
  Name: string;
  Type: number;
}

export interface IEmployee {
  Members: IEmployeeMember[];
  Roles: IEmployeeRole[];
  EmployeeTitles: IEmployeeTitle[];
  ManagerTitles: IManagerTitle[];
  Teams: IEmployeeTeam[];
  Tags: IEmployeeTag[];
  Invitations: IEmployeeInvitation[];
}
