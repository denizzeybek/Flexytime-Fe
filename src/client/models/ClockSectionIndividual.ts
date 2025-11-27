/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClockSectionEmployee } from './ClockSectionEmployee';
import type { ClockSectionTeamAvatar } from './ClockSectionTeamAvatar';
import type { ClockStatistic } from './ClockStatistic';
import type { ClockWellBeing } from './ClockWellBeing';
export type ClockSectionIndividual = {
    ID?: string;
    EmployeeName?: string;
    TeamName?: string;
    Employee?: ClockSectionEmployee;
    Start?: ClockStatistic;
    End?: ClockStatistic;
    Work?: ClockStatistic;
    Leisure?: ClockStatistic;
    Meeting?: ClockStatistic;
    Unclassified?: ClockStatistic;
    Wellbeing?: ClockWellBeing;
    Team?: ClockSectionTeamAvatar;
    Tags?: Array<string>;
    TagsDisplay?: string;
};

