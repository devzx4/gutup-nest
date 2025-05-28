import { ApnsClient, Notification, NotificationOptions, Errors as ApnsErrors } from 'apns2';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApnsService {
  private readonly apnsClient: ApnsClient;
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    this.logger = new Logger(ApnsService.name);
    this.apnsClient = new ApnsClient({
      team: this.configService.get<string>('APPLE_TEAM'),
      keyId: this.configService.get<string>('APPLE_KEY_ID'),
      signingKey: this.configService.get<string>('APPLE_SIGNING_KEY'),
      defaultTopic: this.configService.get<string>('APPLE_BUNDLE_ID'),
      keepAlive: true,
      host: this.configService.get<string>('APPLE_APNS_HOST'),
    });
  }

  async sendNotification(deviceToken: string, notificationOptions: NotificationOptions) {
    const notification = new Notification(deviceToken, notificationOptions);

    try {
      this.logger.log(`Sending notification to device ${deviceToken.slice(0, 4)}*`);
      await this.apnsClient.send(notification);
    } catch (err) {
      const typedError: { reason: ApnsErrors } = err;
      this.logger.error(`Sending notification to device ${deviceToken.slice(0, 4)}* failed :: ${typedError.reason}`);
      throw new Error(typedError.reason);
    }
  }
}
