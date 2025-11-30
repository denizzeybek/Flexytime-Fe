/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TimeEntryRangeDisplayModel } from './TimeEntryRangeDisplayModel';
import type { TimeProjectViewModel } from './TimeProjectViewModel';
import type { TimeTagViewModel } from './TimeTagViewModel';
import type { TimeTaskViewModel } from './TimeTaskViewModel';
export type TimeEntryDisplayModel = {
    DateRangeText?: string;
    TimeSpanText?: string;
    RecordDate?: string;
    ID?: string;
    Task?: TimeTaskViewModel;
    Project?: TimeProjectViewModel;
    Tags?: Array<TimeTagViewModel>;
    Ranges?: Array<TimeEntryRangeDisplayModel>;
    Billable?: boolean;
};

