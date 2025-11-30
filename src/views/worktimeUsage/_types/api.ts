/**
 * API Request and Response Type Definitions for Worktime Usage V2
 */

import type {
  ClockEmployeeRequest,
  ClockSectionRequest,
} from '@/client';

// ============================================
// API Request Payloads - Use OpenAPI types directly
// ============================================

/**
 * Request payload for /clock/section endpoint
 * Used for Team and Department views, also provides Individuals data
 */
export type ISectionRequest = ClockSectionRequest;

/**
 * Request payload for /clock/employee endpoint
 * Used for Individual employee view
 */
export type IEmployeeRequest = ClockEmployeeRequest;

import type {
  CardViewModel,
  ClockBreadCrumb,
  ClockDistribution,
  ClockGraphGroup,
  ClockSectionIndividual,
  ClockSectionSupervisorAvatar,
  ClockSectionTeam,
  ClockSectionTeamAvatar,
  ClockSectionTeamset,
  ClockStatistic,
  ClockWellBeingItem,
  SectionClockSummary,
  WebClockAllocationViewModel,
  WebClockViewModel,
} from '@/client';

// ============================================
// Common Shared Types - Use OpenAPI types
// ============================================

export type IUserType = ClockSectionTeamAvatar;

export type ISupervisor = ClockSectionSupervisorAvatar;

export type ITimeMetric = ClockStatistic;

export type IWellbeing = ClockWellBeingItem;

// ============================================
// Card & User Badge - Use OpenAPI types
// ============================================

export type ICard = CardViewModel;

// ============================================
// Summary & Badges - Use OpenAPI types
// ============================================

export type ISummary = SectionClockSummary;

// ============================================
// Breadcrumb - Use OpenAPI types
// ============================================

export type IBreadcrumb = ClockBreadCrumb;

// ============================================
// Team View Data - Use OpenAPI types
// ============================================

export type ITeam = ClockSectionTeam;

export type ITeamset = ClockSectionTeamset;

// ============================================
// Employee/Individual List Data - Use OpenAPI types
// ============================================

export type IIndividual = ClockSectionIndividual;

// ============================================
// Distribution Data - Use OpenAPI types
// ============================================

export type IDistribution = ClockDistribution;

// ============================================
// Graph Data - Use OpenAPI types
// ============================================

export type IGraph = ClockGraphGroup;

// ============================================
// Web History Data - Use OpenAPI types
// ============================================

export type IWebClock = WebClockViewModel;

export type IWebClocks = WebClockAllocationViewModel;

// ============================================
// Individual Wellbeing Data
// ============================================

export interface IIndividualWellbeingGraph {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
  Unit: string;
}

export interface IIndividualWellbeing {
  Color: 'red' | 'yellow' | 'green';
  Icon: string;
  Type: number;
  Name: string;
  Suggestion: string;
  Description: string;
  Level: number;
  Unit: number;
  Notification: number;
  Graph: IIndividualWellbeingGraph;
}

// ============================================
// API Response Types
// ============================================

import type { ClockSection2Response } from '@/client';

/**
 * Response from /clock/section endpoint
 * Contains team/department data AND individuals list
 */
export type ISectionResponse = ClockSection2Response;

/**
 * Response from /clock/employee endpoint
 * Contains individual employee detailed data
 */
export interface IEmployeeResponse {
  Card: ICard | null;
  Breadcrumb: IBreadcrumb[];
  Summary: ISummary[];
  WellBeings: any[];
  Distributions: IDistribution[];
  Graphs: IGraph;
  WebClocks?: IWebClocks[];
}
