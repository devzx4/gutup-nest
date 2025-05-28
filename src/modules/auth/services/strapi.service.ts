import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { StrapiApiClient } from '@lib/api/strapi/StrapiApiClient';

@Injectable()
export class StrapiApiClientService {
  private readonly logger: Logger;

  private apiClient: StrapiApiClient;

  constructor(private configService: ConfigService) {
    this.logger = new Logger(StrapiApiClientService.name);
    this.apiClient = new StrapiApiClient(
      this.configService.get('STRAPI_ACCESS_TOKEN'),
      this.configService.get('STRAPI_BASE_URL'),
    );
  }

  getApiClient() {
    return this.apiClient;
  }
}
