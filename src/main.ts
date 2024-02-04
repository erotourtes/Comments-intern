import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  HttpExceptionFilter,
  UnhandledExceptionFilter,
} from './app.exception.filter';
import { PrismaExceptionFilter } from './prisma/prisma-exception/prisma.exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new UnhandledExceptionFilter(),
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
