/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { ClockSectionSupervisorAvatar } from './ClockSectionSupervisorAvatar';
import type { ClockSectionTeamAvatar } from './ClockSectionTeamAvatar';
import type { ClockStatistic } from './ClockStatistic';
import type { ClockWellBeing } from './ClockWellBeing';
export type ClockSectionTeam = {
    ID?: string;
    TeamName?: string;
    SupervisorName?: string;
    Team?: ClockSectionTeamAvatar;
    Supervisor?: ClockSectionSupervisorAvatar;
    Start?: ClockStatistic;
    End?: ClockStatistic;
    Work?: ClockStatistic;
    Leisure?: ClockStatistic;
    Meeting?: ClockStatistic;
    Unclassified?: ClockStatistic;
    Wellbeing?: ClockWellBeing;
};

