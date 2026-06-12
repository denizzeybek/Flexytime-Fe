/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockWellBeing = {
    Type: ClockWellBeing.Type;
    /**
     * Count of TraceWellBeing occurrences of this type across the window.
     */
    Notification: number;
    /**
     * True only for the first (most severe) well-being item; matches legacy `items[0].IsActive`.
     */
    IsActive: boolean;
};
export namespace ClockWellBeing {
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

