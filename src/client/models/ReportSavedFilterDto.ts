/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportSavedFilterDto = {
    ID: string;
    CompanyId: string;
    UserId: string;
    Name: string;
    DataSource: ReportSavedFilterDto.DataSource;
    FilterSpec: Record<string, any>;
    CreatedOn?: string;
};
export namespace ReportSavedFilterDto {
    export enum DataSource {
        TIME_ENTRY = 'time-entry',
        WORKTIME = 'worktime',
    }
}

