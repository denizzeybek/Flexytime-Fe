export interface IDetail {
  ID: string;
  Selected: boolean;
  Title: string | null;
  Name: string;
  Domain?: number;
  StartDate: string;
  EndDate: string;
}

export interface IClock {
  ID: string;
  Selected: boolean;
  Title: string | null;
  Name: string;
  Domain: number;
  StartDate: string;
  EndDate: string;
  Details: IDetail[];
}

export interface IRecordItem {
  ID: string;
  RecordDate: string;
  RecordTime: string;
  Selected: boolean;
  Clocks: IClock[];
}
