/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClockGraphPoint } from './ClockGraphPoint';
export type ClockEmployeeWellBeing = {
    Type: ClockEmployeeWellBeing.Type;
    Notification: number;
    Level: number;
    Points: Array<ClockGraphPoint>;
};
export namespace ClockEmployeeWellBeing {
    export enum Type {
        AUTOMATION = 'Automation',
        BALANCED = 'Balanced',
        DISTRACT = 'Distract',
        FRAGMENTED = 'Fragmented',
        MASS_EMAIL = 'MassEmail',
        NOCTURNAL = 'Nocturnal',
        OVERLOADED = 'Overloaded',
        OVER_MEETING = 'OverMeeting',
        OVERTIME = 'Overtime',
        UNINTERRUPTED = 'Uninterrupted',
    }
}

