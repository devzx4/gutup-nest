import { iStrapiTransformedLoginApiRes, iStrapiTransformedUserApiRes } from '@lib/types/strapi.types';

import { iStrapiLoginApiRes, iStrapiUserApiRes } from './StrapiApi.types';

export const transformStrapiLogin = (loginResp: iStrapiLoginApiRes): iStrapiTransformedLoginApiRes => ({
  accessToken: loginResp.access_token,
});

export const transformStrapiUser = (strapiUser: iStrapiUserApiRes): iStrapiTransformedUserApiRes => strapiUser;
