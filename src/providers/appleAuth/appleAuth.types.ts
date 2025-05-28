export interface AppleAuthApiRes {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  id_token: string;
}

export interface AppleAuthUser {
  email: string;
}
