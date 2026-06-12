/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClockCompany } from './ClockCompany';
import type { ClockDistribution } from './ClockDistribution';
import type { ClockIndividualSummary } from './ClockIndividualSummary';
import type { ClockProductivityDay } from './ClockProductivityDay';
import type { ClockSummary } from './ClockSummary';
import type { ClockTeamSummary } from './ClockTeamSummary';
import type { ClockWellBeing } from './ClockWellBeing';
import type { ClockWellBeingGraph } from './ClockWellBeingGraph';
export type ClockSectionResponse = {
    Summary: ClockSummary;
    Distribution: Array<ClockDistribution>;
    WellBeings: Array<ClockWellBeing>;
    ProductivityGraph: Array<ClockProductivityDay>;
    WellBeingGraph: Array<ClockWellBeingGraph>;
    Teams: Array<ClockTeamSummary>;
    Individuals: Array<ClockIndividualSummary>;
    Company: ClockCompany;
};

