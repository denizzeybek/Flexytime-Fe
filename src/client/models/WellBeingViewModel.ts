/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GraphViewModel2 } from './GraphViewModel2';
export type WellBeingViewModel = {
    Color?: string;
    Icon?: string;
    Type?: WellBeingViewModel.Type;
    Name?: string;
    Suggestion?: string;
    Description?: string;
    Level?: WellBeingViewModel.Level;
    Unit?: WellBeingViewModel.Unit;
    Notification?: number;
    Graph?: GraphViewModel2;
};
export namespace WellBeingViewModel {
    export enum Type {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
        '_4' = 4,
        '_5' = 5,
        '_6' = 6,
        '_7' = 7,
        '_8' = 8,
        '_9' = 9,
    }
    export enum Level {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
    }
    export enum Unit {
        '_0' = 0,
        '_1' = 1,
    }
}

