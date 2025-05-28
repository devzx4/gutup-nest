export interface iStrapiTransformedLoginApiRes {
  accessToken: string;
}

export interface CreateStrapiUserDto {
  email: string;
  username: string;
  password: string;
  role: number;
  confirmed?: boolean;
  blocked?: boolean;
}

export interface iStrapiTransformedUserApiRes {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}
