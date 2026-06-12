/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClockSummary } from './ClockSummary';
export type ClockIndividualSummary = {
    UserId: string;
    Fullname: string;
    TeamId: string | null;
    Availability: number;
    OnLeave: boolean;
    LeaveType: ClockIndividualSummary.LeaveType | null;
    Summary: ClockSummary;
};
export namespace ClockIndividualSummary {
    export enum LeaveType {
        ANNUAL = 'Annual',
        SICK = 'Sick',
        UNPAID = 'Unpaid',
        MATERNITY = 'Maternity',
        PATERNITY = 'Paternity',
        BEREAVEMENT = 'Bereavement',
    }
}

