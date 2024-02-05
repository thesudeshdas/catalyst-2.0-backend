export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  userId: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
