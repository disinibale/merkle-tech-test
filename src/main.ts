import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './infrastructure/logger/logger.service';
import { CustomExceptionFilter } from './infrastructure/filters/exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './infrastructure/interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5500'],
    credentials: true,
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Access-Control-Expose-Headers',
      'Authorization',
      'Content-Type',
      'Set-Cookie',
      'X-Requested-With',
      'ngrok-skip-browser-warning',
    ],
  });
  app.useGlobalFilters(new CustomExceptionFilter(new LoggerService()));
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new LogInterceptor(new LoggerService()));

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
