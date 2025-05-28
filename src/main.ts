import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';

import { swaggerConfig, swaggerCustomCss } from '@config/swagger.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WinstonLogger } from '@lib/helpers/winston.logger';

async function bootstrap() {
  const logger = new WinstonLogger();

  const app = await NestFactory.create(AppModule);

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
  logger.log(`Running on port ${process.env.PORT || 3000}`);
}
bootstrap();
