import { CreateQueryParams, RequestQueryBuilder } from '@nestjsx/crud-request';

import { axiosInstance } from '../../core/services';

import type { LoginResponse, RefreshTokenResponse, RegisterProDTO } from '../../types';
import type { LoginGoogleUserDTO, User } from '@the-crew/common';

const basePath = `/auth`;

const instance = axiosInstance;

function login(creds: { email: string; password: string }) {
  const url = `${basePath}/login`;
  return instance.post<LoginResponse>(url, creds, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function loginViaGoogle(payload: LoginGoogleUserDTO) {
  const url = `${basePath}/login/google`;
  return instance.post<LoginResponse>(url, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function register(data: RegisterProDTO) {
  const url = `${basePath}/register`;
  return instance.post<User>(url, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function whoAmI(query: CreateQueryParams = {}) {
  const url = `${basePath}/me`;
  const params = RequestQueryBuilder.create(query).query();
  return instance.get<User>(url, { params });
}

function refreshToken(refreshToken: string) {
  const url = `${basePath}/token/refresh`;
  return instance.post<RefreshTokenResponse>(
    url,
    { refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

function logout(): Promise<void> {
  const url = `${basePath}/logout`;
  return instance.get(url);
}

export const authApi = {
  login,
  loginViaGoogle,
  logout,
  register,
  refreshToken,
  whoAmI,
};

export { login, logout, register, whoAmI, refreshToken };
