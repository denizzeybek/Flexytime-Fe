/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockEmployeeWebClockEntry = {
    /**
     * TraceAllocation._id (the Web allocation).
     */
    AllocationId: string;
    /**
     * The host (e.g. `github.com`).
     */
    HostName: string;
    /**
     * Numeric `PerformAllocationDomain` (its current classification).
     */
    Domain: ClockEmployeeWebClockEntry.Domain;
    /**
     * Summed seconds the employee spent on this host across the window.
     */
    Seconds: number;
    /**
     * Summed cost (decimal-string) for this host across the window.
     */
    Cost: string;
};
export namespace ClockEmployeeWebClockEntry {
    /**
     * Numeric `PerformAllocationDomain` (its current classification).
     */
    export enum Domain {
        NONE = 'None',
        UNCLASSIFIED = 'Unclassified',
        LEISURE = 'Leisure',
        MEETING = 'Meeting',
        WORK = 'Work',
    }
}

