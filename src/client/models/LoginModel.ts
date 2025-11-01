/* istanbul ignore file */
/* tslint:disable */

import { EGrantType } from '@/enums/grantType.enum';

export type LoginModel = {
  username: string;
  password: string;
  grant_type: EGrantType;
};
