/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CardViewModel } from './CardViewModel';
import type { ClockBreadCrumb } from './ClockBreadCrumb';
import type { ClockDistribution } from './ClockDistribution';
import type { ClockGraphGroup } from './ClockGraphGroup';
import type { ClockInvitation } from './ClockInvitation';
import type { ClockSectionIndividual } from './ClockSectionIndividual';
import type { ClockSectionTeamset } from './ClockSectionTeamset';
import type { ClockWellBeingDetail } from './ClockWellBeingDetail';
import type { SectionClockSummary } from './SectionClockSummary';
export type ClockSection2Response = {
    Individuals?: Array<ClockSectionIndividual>;
    Card?: CardViewModel;
    Summary?: Array<SectionClockSummary>;
    WellBeings?: Array<ClockWellBeingDetail>;
    Breadcrumb?: Array<ClockBreadCrumb>;
    Distributions?: Array<ClockDistribution>;
    Graphs?: ClockGraphGroup;
    Teamset?: ClockSectionTeamset;
    Invitations?: Array<ClockInvitation>;
    DownloadKey?: string;
};

