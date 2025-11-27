/* Custom model - not auto-generated */
/* istanbul ignore file */
/* tslint:disable */
import type { EGrantType } from '@/enums/grantType.enum';

export type LoginRequest = {
  username: string;
  password: string;
  grant_type: EGrantType;
};
