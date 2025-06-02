import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientID = configService.get<string>('GAUTH_CLIENT_ID');
    const clientSecret = configService.get<string>('GAUTH_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');
    
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
    
    this.logger.log(`Google Auth Strategy initialized with:`);
    this.logger.log(`- Client ID: ${clientID?.substring(0, 8)}...`);
    this.logger.log(`- Callback URL: ${callbackURL}`);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      this.logger.log(`Google auth validate called for profile ID: ${profile.id}`);
      const { name, emails, photos } = profile;

      if (!emails || emails.length === 0) {
        this.logger.error('No email found in Google profile');
        return done(new Error('No email found in Google profile'), null);
      }

      // Extract user info from Google profile
      const userData = {
        email: emails[0].value,
        name: name ? `${name.givenName || ''} ${name.familyName || ''}`.trim() : 'Google User',
        googleId: profile.id, // Make sure to pass the googleId
        picture: photos && photos.length > 0 ? photos[0].value : null,
      };

      this.logger.log(`Processing Google user with ID: ${userData.googleId}`);
      
      // Process the user (find or create) and return login response
      const result = await this.authService.handleGoogleUser(userData);

      this.logger.log(`Google auth successful for user: ${userData.email}`);
      done(null, result);
    } catch (error) {
      this.logger.error(`Google auth failed: ${error.message}`);
      done(error, null);
    }
  }
}