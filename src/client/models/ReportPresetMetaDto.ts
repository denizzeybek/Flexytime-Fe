/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReportPresetMetaDto = {
    id: string;
    name: string;
    dataSource: ReportPresetMetaDto.dataSource;
    requiresWorktime: boolean;
};
export namespace ReportPresetMetaDto {
    export enum dataSource {
        TIME_ENTRY = 'time-entry',
        WORKTIME = 'worktime',
    }
}

