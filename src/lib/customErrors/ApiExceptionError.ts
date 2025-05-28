/**
 * INFO: Adapted from TZ
 */

import { HttpException } from '@nestjs/common';

const CUSTOM_HTTP_ERROR_CODE = 411;

export class ApiException extends HttpException {
  constructor(message: string) {
    super(message, CUSTOM_HTTP_ERROR_CODE);
  }
}
