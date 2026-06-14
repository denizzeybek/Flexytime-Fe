

import type {
  ClockEmployeeRequestDto,
  ClockSectionRequestDto,
} from '@/client';

export type ISectionRequest = ClockSectionRequestDto;

export type IEmployeeRequest = ClockEmployeeRequestDto;

import type {
  CardViewModel,
  ClockAllocationViewModel,
  ClockDistribution,
  ClockGraphGroup,
  ClockSectionIndividual,
  ClockSectionSupervisorAvatar,
  ClockSectionTeam,
  ClockSectionTeamAvatar,
  ClockSectionTeamset,
  ClockStatistic,
  ClockWellBeing,
  GraphViewModel2,
  SectionClockSummary,
  WebClockViewModel,
} from '@/client';

export type IUserType = ClockSectionTeamAvatar;

export type ISupervisor = ClockSectionSupervisorAvatar;

export type ITimeMetric = ClockStatistic;

export type IWellbeing = ClockWellBeing;

export type ICard = CardViewModel;

export type ISummary = SectionClockSummary;

export interface IBreadcrumb {
  Type?: 'home' | 'team' | 'employee';
  Label?: string;
  TeamId?: string | null;
  IsLast?: boolean;
  id?: string;
  title?: string;
  path?: string;
  isLastElement?: boolean;
}

export type ITeam = ClockSectionTeam;

export type ITeamset = ClockSectionTeamset;

export type IIndividual = ClockSectionIndividual;

export type IDistribution = ClockDistribution & {
  time?: string;
  statisticType?: string;
  Chart?: Array<{ label: string; value: number }>;
  Applications?: Array<{
    title?: string;
    time?: string;
    Name?: string;
    Seconds?: number;
    Cost?: string;
    AllocationId?: string;
  }>;
};

export type IGraph = ClockGraphGroup | GraphViewModel2;

export type IWebClock = WebClockViewModel;

export type IWebClocks = ClockAllocationViewModel & {
  ID?: string;
  Type?: number;
  Spent?: number | string;
  WebClocks?: IWebClock[];
};

export interface IIndividualWellbeingGraph {
  labels?: string[];
  datasets?: {
    label?: string;
    data?: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
  Unit?: string;
}

export interface IIndividualWellbeing {
  Type: string;
  Name: string;
  Color: 'red' | 'yellow' | 'green';
  Icon: string;
  Notification: number;
  Level: number;
  Description: string;
  Suggestion: string;
  Graph: IIndividualWellbeingGraph;
}

import type { ClockSectionResponse } from '@/client';

export type ISectionResponse = ClockSectionResponse;

export interface IEmployeeResponse {
  Card: ICard | null;
  Breadcrumb: IBreadcrumb[];
  Summary: ISummary[];
  WellBeings: IIndividualWellbeing[];
  Distributions: IDistribution[];
  Graphs: IGraph;
  WebClocks?: IWebClocks[];
}
