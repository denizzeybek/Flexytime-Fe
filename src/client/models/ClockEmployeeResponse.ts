/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlertViewModel } from './AlertViewModel';
import type { BreadCrumbViewModel } from './BreadCrumbViewModel';
import type { CardViewModel } from './CardViewModel';
import type { EmployeeClockViewModel } from './EmployeeClockViewModel';
export type ClockEmployeeResponse = {
    IsAuthorized?: boolean;
    AnyData?: boolean;
    Breadcrumbs?: Array<BreadCrumbViewModel>;
    IsConfirmation?: boolean;
    Card?: CardViewModel;
    Model?: EmployeeClockViewModel;
    Alerts?: AlertViewModel;
    DownloadKey?: string;
};

