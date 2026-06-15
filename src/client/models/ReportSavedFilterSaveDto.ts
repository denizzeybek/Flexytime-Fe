/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportSavedFilterSaveDto = {
    ID?: string;
    Name: string;
    DataSource: ReportSavedFilterSaveDto.DataSource;
    FilterSpec: Record<string, any>;
};
export namespace ReportSavedFilterSaveDto {
    export enum DataSource {
        TIME_ENTRY = 'time-entry',
        WORKTIME = 'worktime',
    }
}

