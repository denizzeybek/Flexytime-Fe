/**
 * API Request and Response Type Definitions for Worktime Usage V2
 */

import type {
  ClockEmployeeRequestDto,
  ClockSectionRequestDto,
} from '@/client';


/**
 * Request payload for /clock/section endpoint
 * Used for Team and Department views, also provides Individuals data
 */
export type ISectionRequest = ClockSectionRequestDto;

/**
 * Request payload for /clock/employee endpoint
 * Used for Individual employee view
 */
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


/**
 * BE-computed breadcrumb segment (mirror of ClockBreadcrumbSegment). `Type`
 * drives FE rendering and click handling:
 *  - `home`     → render the home icon, click navigates to section root.
 *  - `team`     → render Label, click navigates to TeamId (unless IsLast).
 *  - `employee` → render Label, non-clickable terminal segment.
 */
export interface IBreadcrumb {
  Type: 'home' | 'team' | 'employee';
  Label: string;
  TeamId: string | null;
  IsLast: boolean;
}


export type ITeam = ClockSectionTeam;

export type ITeamset = ClockSectionTeamset;


export type IIndividual = ClockSectionIndividual;


export type IDistribution = ClockDistribution;


export type IGraph = ClockGraphGroup | GraphViewModel2;


export type IWebClock = WebClockViewModel;

export type IWebClocks = ClockAllocationViewModel;


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

/**
 * Adapter-built wellbeing shape consumed by the IndividualWellbeingCard. v2
 * BE ships the raw `{Type, Notification, Level, Points}`; the store's
 * `buildIndividualWellbeings` enriches each row with derived `Name`,
 * `Color`, `Icon`, and a `Graph` built from `Points`. `Description` and
 * `Suggestion` are blank until the legacy i18n bundle is ported (Rule 20:
 * better empty than fabricated).
 */
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

/**
 * Response from /clock/section endpoint
 * Contains team/department data AND individuals list
 */
export type ISectionResponse = ClockSectionResponse;

/**
 * Response from /clock/employee endpoint
 * Contains individual employee detailed data
 */
export interface IEmployeeResponse {
  Card: ICard | null;
  Breadcrumb: IBreadcrumb[];
  Summary: ISummary[];
  WellBeings: IIndividualWellbeing[];
  Distributions: IDistribution[];
  Graphs: IGraph;
  WebClocks?: IWebClocks[];
}
