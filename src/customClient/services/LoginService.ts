/**
 * Deprecated — kept only so any orphan caller on the v2 backend fails loudly
 * instead of silently sending an HTTP Basic + grant_type=password form to a
 * route that no longer exists.
 *
 * The legacy flow (`POST /oauth/token` with hard-coded Basic auth +
 * `grant_type=password`) is gone. v2 uses:
 *
 *   - `AuthService.authControllerLogin({ username, password })` for
 *     email/password sign-in,
 *   - `AuthService.googleControllerGoogle({ idToken })` for Google Sign-In,
 *
 * both returning `AuthResponseDto` directly. The store wrappers live in
 * `src/stores/auth.ts` (see `login`, `register`, `loginWithGoogle`,
 * `refreshToken`).
 *
 * Delete this file once `src/customClient/index.ts` and any of its other
 * consumers (DownloadService, PaymentService) move to the auto-generated
 * `@/client` clients too.
 */
/* tslint:disable */
/* eslint-disable */

import { CancelablePromise } from '@/client/core/CancelablePromise';

import type { LoginRequest } from '../models/LoginRequest';
import type { TokenResponse } from '../models/TokenResponse';

const NOT_IMPLEMENTED_MSG =
  'LoginService is deprecated. Use AuthService.authControllerLogin / authControllerRefresh / googleControllerGoogle from @/client. See src/stores/auth.ts.';

export class LoginService {
  public static login(_request: LoginRequest): CancelablePromise<TokenResponse> {
    return new CancelablePromise<TokenResponse>((_resolve, reject) => {
      reject(new Error(NOT_IMPLEMENTED_MSG));
    });
  }

  public static loginWithGoogle(_code: string): CancelablePromise<TokenResponse> {
    return new CancelablePromise<TokenResponse>((_resolve, reject) => {
      reject(new Error(NOT_IMPLEMENTED_MSG));
    });
  }
}
