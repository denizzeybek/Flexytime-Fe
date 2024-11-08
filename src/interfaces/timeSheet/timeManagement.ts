export interface ITimeManagementChild {
  Name: string;
  Days: string[];
}

export interface ITimeManagement {
  Name: string;
  Children: ITimeManagementChild[];
  Days: string[];
}
