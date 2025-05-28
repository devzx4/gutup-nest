import { Logger } from '@nestjs/common';

import BaseApiClient from '@abstracts/BaseApiClient';
import { ApiException } from '@lib/customErrors/ApiExceptionError';
import { CreateStrapiUserDto, iStrapiTransformedLoginApiRes } from '@lib/types/strapi.types';

import { iStrapiLoginApiRes, iStrapiUserApiRes } from './StrapiApi.types';
import { transformStrapiLogin, transformStrapiUser } from './util';

const SUCCESS_STATUS = 200;
const SUCCESS_CREATED_STATUS = 201;
const ACCESS_TOKEN_HEADER_KEY = 'Authorization';

export class StrapiApiClient extends BaseApiClient {
  private logger = new Logger(StrapiApiClient.name);

  constructor(accessToken: string, baseUrl: string) {
    super(baseUrl);
    this.setAccessTokenToHeader(`Bearer ${accessToken}`, ACCESS_TOKEN_HEADER_KEY);
  }

  async loginUser(email: string): Promise<iStrapiTransformedLoginApiRes> {
    try {
      const { status, data: responseData } = await this.axiosInstance.post<iStrapiLoginApiRes>(`/auth/server`, {
        email,
      });

      if (status !== SUCCESS_STATUS) {
        throw new ApiException('Failed to login Strapi user');
      }

      return transformStrapiLogin(responseData);
    } catch (err) {
      this.logger.error(`loginUser error ${err}`);
      throw new ApiException('Failed to login Strapi user');
    }
  }

  async createUser(newUser: CreateStrapiUserDto) {
    try {
      const { status, data: responseData } = await this.axiosInstance.post<iStrapiUserApiRes>(`/users`, {
        email: newUser.email,
        username: newUser.email,
        password: newUser.password,
        role: newUser.role,
        ...(newUser.confirmed ? { confirmed: newUser.confirmed } : {}),
        ...(newUser.blocked ? { blocked: newUser.blocked } : {}),
      });

      if (status !== SUCCESS_CREATED_STATUS) {
        throw new ApiException('Failed to create Strapi user');
      }

      return transformStrapiUser(responseData);
    } catch (err) {
      this.logger.error(`createUser error ${err}`);
      throw new ApiException('Failed to create Strapi user');
    }
  }
}
