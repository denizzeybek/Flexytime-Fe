/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { TimeProjectViewModel } from './TimeProjectViewModel';
import type { TimeTagViewModel } from './TimeTagViewModel';
import type { TimeTaskViewModel } from './TimeTaskViewModel';
export type TimeEntryModifyViewModel = {
    ID?: string;
    Task?: TimeTaskViewModel;
    Project?: TimeProjectViewModel;
    Tags?: Array<TimeTagViewModel>;
    Billable?: boolean;
    StartDate: string;
    EndDate?: string;
};

