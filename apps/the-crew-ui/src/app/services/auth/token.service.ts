import type { LoginResponse } from '../../types';

type TokenPayload = LoginResponse;

enum AuthKeys {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  EXPIRES_AT = 'expires_at',
}

/**
 * Get access token from local storage
 * @returns Access Token
 */
function getAccessToken() {
  return localStorage.getItem(AuthKeys.ACCESS_TOKEN);
}

/**
 * Set access token value into local storage
 * @param accessToken
 */
function setAccessToken(accessToken: string) {
  localStorage.setItem(AuthKeys.ACCESS_TOKEN, accessToken);
}

/**
 * Get refresh token from local storage
 * @returns
 */
function getRefreshToken() {
  return localStorage.getItem(AuthKeys.REFRESH_TOKEN);
}

/**
 * Set refresh token into local storage
 * @param refreshToken
 */
function setRefreshToken(refreshToken: string) {
  localStorage.setItem(AuthKeys.REFRESH_TOKEN, refreshToken);
}

function setExpireTimestamp(timestamp: number) {
  localStorage.setItem(AuthKeys.EXPIRES_AT, timestamp + '');
}

function getExpireTimestamp(): number {
  return parseInt(localStorage.getItem(AuthKeys.EXPIRES_AT));
}

function setTokenPayload(payload: TokenPayload): void {
  setAccessToken(payload.accessToken);
  setRefreshToken(payload.refreshToken);
  setExpireTimestamp(payload.expiresAt);
}

function getTokenPayload(): TokenPayload {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    expiresAt: getExpireTimestamp(),
  };
}

function clearTokenPayload(): void {
  localStorage.removeItem(AuthKeys.ACCESS_TOKEN);
  localStorage.removeItem(AuthKeys.EXPIRES_AT);
  localStorage.removeItem(AuthKeys.REFRESH_TOKEN);
}

export {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  setExpireTimestamp,
  getExpireTimestamp,
  setTokenPayload,
  getTokenPayload,
  clearTokenPayload,
};

export const TokenService = {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  setExpireTimestamp,
  getExpireTimestamp,
  setTokenPayload,
  getTokenPayload,
  clearTokenPayload,
};
