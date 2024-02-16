export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  firstName: string;
  lastName?: string;
  email: string;
  userId: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
