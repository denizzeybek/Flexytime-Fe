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
      ...(request.code && { code: request.code }), // Add code if present
    }).toString();

    // Basic auth credentials - hardcoded from .env
    // OpenAPI.USERNAME/PASSWORD would work but headers is more explicit
    const BASIC_AUTH = 'QzFBMDNCMTAtN0Q1OS00MDdBLUE5M0UtQjcxQUIxN0FEOEMyOjE3N0UzMjk1LTA2NTYtNDMxNy1CQzkxLUREMjcxQTE5QUNGRg==';

    return __request(OpenAPI, {
      method: 'POST',
      url: '/oauth/token',
      mediaType: 'application/x-www-form-urlencoded',
      headers: {
        'Authorization': `Basic ${BASIC_AUTH}`,
      },
      body: formData,
    });
  }

  /**
   * Login with Google OAuth code to get access token
   * @param code Google OAuth code from backend callback
   * @returns TokenResponse OK
   * @throws ApiError
   */
  public static loginWithGoogle(code: string): CancelablePromise<TokenResponse> {
    return this.login({
      username: '',
      password: '',
      grant_type: 'password' as any,
      code,
    });
  }
}
