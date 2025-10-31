/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { LoginModel } from '../models/LoginModel';
import type { LoginResponse } from '../models/LoginResponse';
import qs from 'qs';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
  /**
   * @param body
   * @returns LoginResponse OK
   * @throws ApiError
   */
  public static Login(body?: LoginModel): CancelablePromise<LoginResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/oauth/token',
      body: qs.stringify(body),
      headers: {
        Authorization:
          'BASIC QzFBMDNCMTAtN0Q1OS00MDdBLUE5M0UtQjcxQUIxN0FEOEMyOjE3N0UzMjk1LTA2NTYtNDMxNy1CQzkxLUREMjcxQTE5QUNGRg==',
      },
      // errors: {
      //   400: `Bad Request`,
      //   401: `Unauthorized`,
      // },
    });
  }
}
