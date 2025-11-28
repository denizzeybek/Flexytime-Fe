/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformNameValueModel } from './PerformNameValueModel';
import type { TimeProjectViewModel } from './TimeProjectViewModel';
import type { TimeTagViewModel } from './TimeTagViewModel';
export type ReportFilterViewModel = {
    Projects?: Array<TimeProjectViewModel>;
    Tags?: Array<TimeTagViewModel>;
    Employees?: Array<PerformNameValueModel>;
    Teams?: Array<PerformNameValueModel>;
};

