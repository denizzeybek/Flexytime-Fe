/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockBreadcrumbSegment = {
    Type: ClockBreadcrumbSegment.Type;
    Label: string;
    TeamId: string | null;
    IsLast: boolean;
};
export namespace ClockBreadcrumbSegment {
    export enum Type {
        HOME = 'home',
        TEAM = 'team',
        EMPLOYEE = 'employee',
    }
}

