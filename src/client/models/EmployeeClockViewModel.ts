/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllocationViewModel } from './AllocationViewModel';
import type { CalendarModelView } from './CalendarModelView';
import type { EmployeeViewModel } from './EmployeeViewModel';
import type { GraphViewModel2 } from './GraphViewModel2';
import type { ManualClockViewModel } from './ManualClockViewModel';
import type { MapClockViewModel } from './MapClockViewModel';
import type { PhoneAllocationViewModel } from './PhoneAllocationViewModel';
import type { ShiftViewModel } from './ShiftViewModel';
import type { WebClockAllocationViewModel } from './WebClockAllocationViewModel';
import type { WellBeingViewModel } from './WellBeingViewModel';
export type EmployeeClockViewModel = {
    Employee?: EmployeeViewModel;
    ID?: string;
    Summary?: ShiftViewModel;
    Graph?: GraphViewModel2;
    Allocations?: Array<AllocationViewModel>;
    HasRefreshScheduled?: boolean;
    Perspective?: EmployeeClockViewModel.Perspective;
    Manuals?: Array<ManualClockViewModel>;
    Map?: MapClockViewModel;
    Phones?: Array<PhoneAllocationViewModel>;
    WebClocks?: Array<WebClockAllocationViewModel>;
    Calendar?: CalendarModelView;
    WellBeings?: Array<WellBeingViewModel>;
};
export namespace EmployeeClockViewModel {
    export enum Perspective {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
        '_3' = 3,
    }
}

