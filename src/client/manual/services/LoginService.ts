/* manually created - not generated */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { TokenResponse } from '../models/TokenResponse';
import type { CancelablePromise } from '../../core/CancelablePromise';
import { OpenAPI } from '../../core/OpenAPI';
import { request as __request } from '../../core/request';

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
