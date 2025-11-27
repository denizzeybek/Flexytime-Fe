/* Custom service - not auto-generated */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '@/client/core/CancelablePromise';
import { OpenAPI } from '@/client/core/OpenAPI';
import { request as __request } from '@/client/core/request';

import type { LoginRequest } from '../models/LoginRequest';
import type { TokenResponse } from '../models/TokenResponse';

export class LoginService {
  /**
   * Login with username and password to get access token
   * @param request Login credentials (username, password, grant_type)
   * @returns TokenResponse OK
   * @throws ApiError
   */
  public static login(request: LoginRequest): CancelablePromise<TokenResponse> {
    // Convert object to application/x-www-form-urlencoded format
    const formData = new URLSearchParams({
      username: request.username,
      password: request.password,
      grant_type: request.grant_type,
    }).toString();

    return __request(OpenAPI, {
      method: 'POST',
      url: '/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
  }
}
