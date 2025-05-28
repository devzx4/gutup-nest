import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EMAIL_TEMPLATE, MailContact } from './mailer.types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MailService {
  private readonly logger: Logger;

  constructor(private configService: ConfigService, private readonly httpService: HttpService) {
    this.logger = new Logger(MailService.name);
  }

  async sendMail(
    to: MailContact[], // Array of recipient email addresses
    subject: string, // Email subject
    template: EMAIL_TEMPLATE, // Email template
    context: Record<string, unknown> = {}, // Email context data - will change according to template
    sender?: MailContact,
    bcc?: MailContact[], // Optional: Array of email addresses for BCC
    cc?: MailContact[], // Optional: Array of email addresses for BCC
  ): Promise<void> {
    try {
      const payload = {
        templateId: template,
        to,
        bcc,
        cc,
        params: context,
        subject,
        sender,
      };
      // const { data } = await firstValueFrom(
      //   this.httpService.post(`https://webhook.site/28c7e470-3ce9-4fe6-9a60-19e0a023e912?sample=wwww`),
      // );
      const { data } = await firstValueFrom(
        this.httpService.post('https://api.brevo.com/v3/smtp/email', payload, {
          headers: {
            Accept: 'application/json',
            'api-key': this.configService.get<string>('BREVO_API_KEY'),
            'Content-Type': 'application/json',
          },
        }),
      );
      this.logger.log(`Email sent successfully to: ${to.map(({ email }) => email).join(', ')}`);
    } catch (err) {
      this.logger.error(`Sending email failed`);
      this.logger.error(err);
      throw err;
    }
  }
}
