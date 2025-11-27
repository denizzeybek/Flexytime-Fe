/* manually created - not generated */
/* istanbul ignore file */
/* tslint:disable */

export type TokenResponse = {
  access_token: string;
  refresh_token?: string; // Optional, artık kullanılmıyor ama backend dönebilir
  token_type?: string;
  expires_in?: number;
};
