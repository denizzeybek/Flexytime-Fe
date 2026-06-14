/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClockBreadcrumbSegment } from './ClockBreadcrumbSegment';
import type { ClockDistribution } from './ClockDistribution';
import type { ClockEmployeeIdentity } from './ClockEmployeeIdentity';
import type { ClockEmployeeManualEntry } from './ClockEmployeeManualEntry';
import type { ClockEmployeeSummary } from './ClockEmployeeSummary';
import type { ClockEmployeeWebClockEntry } from './ClockEmployeeWebClockEntry';
import type { ClockEmployeeWellBeing } from './ClockEmployeeWellBeing';
import type { ClockProductivityDay } from './ClockProductivityDay';
export type ClockEmployeeResponse = {
    Employee: ClockEmployeeIdentity;
    Summary: ClockEmployeeSummary;
    Distribution: Array<ClockDistribution>;
    WellBeings: Array<ClockEmployeeWellBeing>;
    ProductivityGraph: Array<ClockProductivityDay>;
    /**
     * Admin-recorded manual time entries within the window.
     */
    Manuals: Array<ClockEmployeeManualEntry>;
    /**
     * Per-Web-allocation aggregate (the "Web History" tab) for the window.
     */
    WebClocks: Array<ClockEmployeeWebClockEntry>;
    HasRefreshScheduled: boolean;
    /**
     * Alert badges (legacy `/clock/alerts` shape).
     */
    Alerts: Record<string, any>;
    Breadcrumb: Array<ClockBreadcrumbSegment>;
};

