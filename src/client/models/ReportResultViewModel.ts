/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportGraphGroupViewModel } from './ReportGraphGroupViewModel';
import type { ReportGroupViewModel } from './ReportGroupViewModel';
import type { ReportSummaryViewModel } from './ReportSummaryViewModel';
export type ReportResultViewModel = {
    Summary?: ReportSummaryViewModel;
    Graphs?: ReportGraphGroupViewModel;
    Grouping?: Array<ReportGroupViewModel>;
    DownloadKey?: string;
};

