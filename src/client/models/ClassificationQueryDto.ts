/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClassificationQueryDto = {
    /**
     * 1-based page index. `skip = (Start - 1) * Length`.
     */
    Start: number;
    /**
     * Page size. `-1` → unbounded.
     */
    Length: number;
    /**
     * Free-text filter over `Name` (+ `HostName` for web addresses).
     */
    Search?: string;
    /**
     * Field to sort by.
     */
    Sort?: string;
    /**
     * Sort direction.
     */
    Descending?: boolean;
};

