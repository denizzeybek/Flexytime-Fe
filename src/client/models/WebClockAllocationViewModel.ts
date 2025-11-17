/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Chart2ViewModel } from './Chart2ViewModel';
import type { WebClockViewModel } from './WebClockViewModel';
export type WebClockAllocationViewModel = {
    Name?: string;
    WebClocks?: Array<WebClockViewModel>;
    Type?: WebClockAllocationViewModel.Type;
    Spent?: string;
    Color?: string;
    Icon?: string;
    ID?: string;
    Chart?: Chart2ViewModel;
};
export namespace WebClockAllocationViewModel {
    export enum Type {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
    }
}

