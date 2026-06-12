/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockEmployeeManualEntry = {
    /**
     * TraceClock._id.
     */
    ID: string;
    /**
     * Start of the manual block (ISO 8601 UTC instant).
     */
    StartDate: string;
    /**
     * End of the manual block (ISO 8601 UTC instant).
     */
    EndDate: string;
    /**
     * Duration in seconds.
     */
    Spent: number;
    /**
     * Free-text description / reason the admin recorded.
     */
    Description: string;
    /**
     * Numeric `PerformAllocationDomain` of the underlying Manual allocation.
     */
    Domain: ClockEmployeeManualEntry.Domain;
};
export namespace ClockEmployeeManualEntry {
    /**
     * Numeric `PerformAllocationDomain` of the underlying Manual allocation.
     */
    export enum Domain {
        NONE = 'None',
        UNCLASSIFIED = 'Unclassified',
        LEISURE = 'Leisure',
        MEETING = 'Meeting',
        WORK = 'Work',
    }
}

