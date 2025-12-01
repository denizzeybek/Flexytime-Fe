/* Custom service - not auto-generated */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { CancelablePromise } from '@/client/core/CancelablePromise';
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

    // Temporarily clear TOKEN to prevent Bearer auth from overriding Basic auth
    // The request.ts getHeaders() adds Bearer token if OpenAPI.TOKEN exists,
    // which would override our Basic auth header
    const savedToken = OpenAPI.TOKEN;
    OpenAPI.TOKEN = undefined;

    const result = __request<TokenResponse>(OpenAPI, {
      method: 'POST',
      url: '/oauth/token',
      mediaType: 'application/x-www-form-urlencoded',
      headers: {
        'Authorization': `Basic ${BASIC_AUTH}`,
      },
      body: formData,
    });

    // Restore token after request is created (it's a promise, actual request happens later)
    // We need to restore it in the promise chain to ensure it's restored after the request completes
    return new CancelablePromise<TokenResponse>((resolve, reject, onCancel) => {
      result
        .then((response: TokenResponse) => {
          OpenAPI.TOKEN = savedToken;
          resolve(response);
        })
        .catch((error: unknown) => {
          OpenAPI.TOKEN = savedToken;
          reject(error);
        });

      onCancel(() => {
        OpenAPI.TOKEN = savedToken;
      });
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
