/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockAllocationViewModel = {
    Id: string;
    Name?: string;
    Feature: ClockAllocationViewModel.Feature;
    Domain: ClockAllocationViewModel.Domain;
};
export namespace ClockAllocationViewModel {
    export enum Feature {
        NONE = 'None',
        EXECUTABLE = 'Executable',
        LOGOUT = 'Logout',
        IDLE = 'Idle',
        MEETING = 'Meeting',
        WEB = 'Web',
        MANUAL = 'Manual',
        PHONE = 'Phone',
        LOCATION = 'Location',
    }
    export enum Domain {
        NONE = 'None',
        UNCLASSIFIED = 'Unclassified',
        LEISURE = 'Leisure',
        MEETING = 'Meeting',
        WORK = 'Work',
    }
}

