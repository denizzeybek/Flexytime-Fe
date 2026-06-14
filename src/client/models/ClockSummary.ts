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
     * Summed `Cost` (decimal-string) for Work-domain rows in the window.
     */
    WorkCost: string;
    /**
     * Summed `Cost` (decimal-string) for Meeting-domain rows in the window.
     */
    MeetingCost: string;
    /**
     * Summed `Cost` (decimal-string) for Leisure-domain rows in the window.
     */
    LeisureCost: string;
    /**
     * Summed `Cost` (decimal-string) for Unclassified-domain rows in the window.
     */
    UnclassifiedCost: string;
    /**
     * Averaged shift start, seconds-since-midnight; `null` when no shift covers the window.
     */
    StartTime: number | null;
    /**
     * Averaged shift end, seconds-since-midnight; `null` when no shift covers the window.
     */
    EndTime: number | null;
};

