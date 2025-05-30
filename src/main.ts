import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';

import { swaggerConfig, swaggerCustomCss } from '@config/swagger.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WinstonLogger } from '@lib/helpers/winston.logger';
import { OAuthDiagnostic } from './utils/oauth-diagnostic';

async function bootstrap() {
  const logger = new WinstonLogger();

  // Check OAuth configuration during startup
  OAuthDiagnostic.checkGoogleOAuthConfig();

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    customCss: swaggerCustomCss,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // transform request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // transform response
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application running on: ${await app.getUrl()}`);
  logger.log(`Google OAuth callback URL: ${process.env.GOOGLE_CALLBACK_URL}`);
}
bootstrap();
