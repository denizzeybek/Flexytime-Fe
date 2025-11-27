/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformSectionSelectModel } from './PerformSectionSelectModel';
import type { WorkDayViewModel } from './WorkDayViewModel';
export type WorkSettingViewModel = {
    Days?: Array<WorkDayViewModel>;
    Sections?: Array<PerformSectionSelectModel>;
    MaxIdleTime?: string;
    Unclassified?: boolean;
    ShiftRangeTime?: string;
    TimeZone?: string;
};

