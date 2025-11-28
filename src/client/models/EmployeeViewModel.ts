/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EmployeeViewModel = {
    id?: string;
    fullname?: string;
    teamname?: string;
    teamid?: string;
    abbreviation?: string;
    avatarcolor?: string;
    title?: string;
    imageurl?: string;
    since?: string;
    uninstalldate?: string;
    islicensed?: boolean;
    Availability?: EmployeeViewModel.Availability;
    readonly AvailabilityImageUrl?: string;
    Tags?: Array<string>;
    HasAnnual?: boolean;
    AnnualStart?: string;
    AnnualEnd?: string;
    AnnualType?: string;
    Email?: string;
    CompanyName?: string;
};
export namespace EmployeeViewModel {
    export enum Availability {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
    }
}

