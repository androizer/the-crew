export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type AuthCreds = {
  email: string;
  password: string;
};

export type RefreshTokenResponse = LoginResponse;
