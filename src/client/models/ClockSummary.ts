/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockSummary = {
    Work: number;
    Meeting: number;
    Leisure: number;
    Unclassified: number;
    /**
     * Averaged shift start, seconds-since-midnight; `null` when no shift covers the window.
     */
    StartTime: number | null;
    /**
     * Averaged shift end, seconds-since-midnight; `null` when no shift covers the window.
     */
    EndTime: number | null;
};

