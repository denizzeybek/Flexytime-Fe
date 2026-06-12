/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClockDistributionApp } from './ClockDistributionApp';
export type ClockDistribution = {
    Domain: ClockDistribution.Domain;
    /**
     * Summed `Spent` (seconds) for this domain across the window.
     */
    Seconds: number;
    /**
     * Summed `Cost` (decimal-string) for this domain across the window.
     */
    Cost: string;
    /**
     * Per-application drill-down for this domain.
     */
    Applications: Array<ClockDistributionApp>;
};
export namespace ClockDistribution {
    export enum Domain {
        NONE = 'None',
        UNCLASSIFIED = 'Unclassified',
        LEISURE = 'Leisure',
        MEETING = 'Meeting',
        WORK = 'Work',
    }
}

