/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataResultErrorViewModel } from './DataResultErrorViewModel';
export type DataResultViewModel = {
    Status?: DataResultViewModel.Status;
    Description?: string;
    Errors?: Array<DataResultErrorViewModel>;
};
export namespace DataResultViewModel {
    export enum Status {
        '_0' = 0,
        '_-4' = -4,
        '_-3' = -3,
        '_-2' = -2,
        '_-1' = -1,
    }
}

