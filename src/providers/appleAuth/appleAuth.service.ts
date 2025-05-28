import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign as signJwt, decode as decodeJwt } from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';

import { AppleAuthApiRes, AppleAuthUser } from './appleAuth.types';

@Injectable()
export class AppleAuthService {
  private readonly appleAuthConfig;
  private readonly logger: Logger;

  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    this.logger = new Logger(AppleAuthService.name);
    this.appleAuthConfig = {
      clientId: this.configService.get<string>('APPLE_BUNDLE_ID'),
      clientSecret: '',
      keyId: this.configService.get<string>('APPLE_KEY_ID'),
      signingKey: this.configService.get<string>('APPLE_SIGNING_KEY'),
      teamId: this.configService.get<string>('APPLE_TEAM'),
    };

    /**
     * INFO: since we can re-use clientSecrets, better to generate it once and store it in memory.
     * However, if the clientSecret could technically expire if the Node instance runs 150d without turning off!
     * https://developer.apple.com/documentation/accountorganizationaldatasharing/creating-a-client-secret
     */
    const clientSecret = signJwt({}, this.appleAuthConfig.signingKey, {
      header: { alg: 'ES256', typ: undefined },
      keyid: this.appleAuthConfig.keyId,
      issuer: this.appleAuthConfig.teamId,
      expiresIn: '150d',
      audience: 'https://appleid.apple.com',
      subject: this.appleAuthConfig.clientId,
    });

    this.appleAuthConfig.clientSecret = clientSecret;
  }

  async validateToken(authorizationCode: string): Promise<AppleAuthUser> {
    try {
      const payload = {
        client_id: this.appleAuthConfig.clientId,
        client_secret: this.appleAuthConfig.clientSecret,
        code: authorizationCode,
        grant_type: 'authorization_code',
      };

      const { data: response } = await firstValueFrom(
        this.httpService.post<AppleAuthApiRes>('https://appleid.apple.com/auth/token', payload, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );

      // TODO: add token verification as well https://developer.apple.com/documentation/sign_in_with_apple/fetch_apple_s_public_key_for_verifying_token_signature

      const userFromIdToken = decodeJwt(response.id_token);

      if (typeof userFromIdToken === 'string') {
        throw new Error(`Invalid idToken - ${userFromIdToken}`);
      }

      return { email: userFromIdToken.email };
    } catch (err) {
      this.logger.error(`Apple Auth for code ${authorizationCode.slice(0, 4)}* failed :: ${err}`);
    }
  }
}
