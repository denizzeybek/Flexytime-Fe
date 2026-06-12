/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClockAllocationViewModel } from './ClockAllocationViewModel';
export type ClockActivityViewModel = {
    Id: string;
    Title: string;
    Reference: string;
    StartDate: string;
    EndDate: string;
    Spent: number;
    MachineName: string;
    IPAddress: string;
    /**
     * True when the activity's StartDate falls inside any PerformHoliday range for the company.
     */
    IsHoliday: boolean;
    /**
     * True when the activity's StartDate falls inside any PerformAnnual leave for the user.
     */
    IsOnLeave: boolean;
    /**
     * True when the activity's StartDate–EndDate window sits inside the user's
     * TraceShift bounds for that date. Falls back to `false` when no shift exists.
     */
    InShift: boolean;
    /**
     * Leave classification when IsOnLeave=true. `enum` is documentation: legacy data
     * may carry strings outside LeaveType, so the field is `string | null` at runtime.
     */
    LeaveType: ClockActivityViewModel.LeaveType | null;
    Allocation: ClockAllocationViewModel | null;
};
export namespace ClockActivityViewModel {
    /**
     * Leave classification when IsOnLeave=true. `enum` is documentation: legacy data
     * may carry strings outside LeaveType, so the field is `string | null` at runtime.
     */
    export enum LeaveType {
        ANNUAL = 'Annual',
        SICK = 'Sick',
        UNPAID = 'Unpaid',
        MATERNITY = 'Maternity',
        PATERNITY = 'Paternity',
        BEREAVEMENT = 'Bereavement',
    }
}

