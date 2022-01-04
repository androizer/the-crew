/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import AuthConfig from './configs/auth.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  const configService = app.get(ConfigService);
  const authConfig = configService.get<ConfigType<typeof AuthConfig>>('auth');

  app.enableCors({
    credentials: true,
    origin: authConfig.corsOrigins,
  });
  app.use(cookieParser(authConfig.cookieSecrets));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder().setTitle('The Crew').setVersion('1.0.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('explorer', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    Logger.log('Listening at ' + port + '/' + globalPrefix);
  });
}

bootstrap();
