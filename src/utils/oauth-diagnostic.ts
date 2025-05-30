import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class OAuthDiagnostic {
  private static logger = new Logger('OAuthDiagnostic');

  public static checkGoogleOAuthConfig(): void {
    this.logger.log('Checking Google OAuth Configuration...');
    const clientId = process.env.GAUTH_CLIENT_ID;
    const secret = process.env.GAUTH_SECRET;
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

    if (!clientId) {
      this.logger.error('GAUTH_CLIENT_ID is missing or empty');
    } else {
      this.logger.log(`GAUTH_CLIENT_ID: ${clientId.substring(0, 10)}...`);
    }

    if (!secret) {
      this.logger.error('GAUTH_SECRET is missing or empty');
    } else {
      this.logger.log(`GAUTH_SECRET: ${secret.substring(0, 5)}...`);
    }

    if (!callbackUrl) {
      this.logger.error('GOOGLE_CALLBACK_URL is missing or empty');
    } else {
      this.logger.log(`GOOGLE_CALLBACK_URL: ${callbackUrl}`);

      // Check common issues with callback URLs
      if (!callbackUrl.startsWith('http://') && !callbackUrl.startsWith('https://')) {
        this.logger.error('Callback URL must start with http:// or https://');
      }

      if (callbackUrl.endsWith('/')) {
        this.logger.warn('Callback URL should not end with a trailing slash');
      }

      // Check if the callback URL follows the pattern in the controller
      if (!callbackUrl.includes('/v1/auth/google/callback')) {
        this.logger.warn('Callback URL may not match the controller route path');
        this.logger.warn('Expected pattern: */v1/auth/google/callback');
      }
    }

    this.logger.log('Google OAuth configuration check completed');
  }
}

// You can call this in main.ts during startup for diagnostic purposes:
// OAuthDiagnostic.checkGoogleOAuthConfig();
