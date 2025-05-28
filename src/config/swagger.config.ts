import { DocumentBuilder } from '@nestjs/swagger';

// TODO: add custom css for swagger API documentation
export const swaggerCustomCss = ``;

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Nest Server API')
  .setDescription('Nest Server template API')
  .setVersion('1.0')
  .addBearerAuth({ in: 'header', type: 'http' }, 'JWT-auth')
  .build();
