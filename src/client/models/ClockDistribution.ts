/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { ClockDistributionChart } from './ClockDistributionChart';
import type { ClockDistributionItem } from './ClockDistributionItem';
export type ClockDistribution = {
    id?: string;
    statisticType?: string;
    time?: string;
    Applications?: Array<ClockDistributionItem>;
    Chart?: Array<ClockDistributionChart>;
};

