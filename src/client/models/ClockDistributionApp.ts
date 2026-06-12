/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockDistributionApp = {
    /**
     * `TraceAllocation._id` of this application.
     */
    AllocationId: string;
    /**
     * Raw `TraceAllocation.Name`.
     */
    Name: string;
    /**
     * Summed `Spent` (seconds) for this application within the domain.
     */
    Seconds: number;
    /**
     * Summed `Cost` (decimal-string) for this application within the domain.
     */
    Cost: string;
};

