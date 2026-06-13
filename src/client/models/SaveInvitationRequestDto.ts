/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SaveInvitationRequestDto = {
    /**
     * Team to pre-assign the invited employee when they accept.
     */
    TeamId?: string;
    /**
     * Title to pre-assign the invited employee when they accept.
     */
    TitleId?: string;
    Emails?: Array<string>;
};

