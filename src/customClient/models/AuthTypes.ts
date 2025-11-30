/* Custom auth types - not in OpenAPI spec */
/* istanbul ignore file */
/* tslint:disable */
 

import type { WizardProfileViewModel } from '@/client';

/**
 * Payload for setting authentication state
 */
export interface AuthPayload {
  authentication?: string | null;
  user?: WizardProfileViewModel | null;
}

/**
 * Result from getProfile action
 */
export interface GetProfileResult {
  user?: WizardProfileViewModel;
}

/**
 * Extended response type for register endpoint
 * Backend returns DTO but OpenAPI spec doesn't include it
 * TODO: Request backend to update OpenAPI spec
 */
export interface RegisterResponse {
  Status?: number;
  Description?: string;
  DTO?: {
    AccessKey?: string;
  };
}
