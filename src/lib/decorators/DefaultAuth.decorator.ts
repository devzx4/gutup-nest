import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export function DefaultAuth() {
  return applyDecorators(ApiBearerAuth('JWT-auth'));
}
