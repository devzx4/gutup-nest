export interface iStrapiLoginApiRes {
  user: Record<string, unknown>;
  access_token: string;
}

export interface iStrapiUserApiRes {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}
