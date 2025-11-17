/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Chart2ViewModel } from './Chart2ViewModel';
import type { ChartViewModel } from './ChartViewModel';
export type AllocationViewModel = {
    id?: string;
    name?: string;
    imageurl?: string;
    spend?: string;
    icon?: string;
    color?: string;
    frontcolor?: string;
    Allocations?: Array<AllocationViewModel>;
    Chart2?: Chart2ViewModel;
    Chart?: ChartViewModel;
    Description?: string;
    Time?: string;
    Type?: AllocationViewModel.Type;
    BackgroundColor?: string;
    BorderColor?: string;
};
export namespace AllocationViewModel {
    export enum Type {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
    }
}

