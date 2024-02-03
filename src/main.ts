import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  HttpExceptionFilter,
  UnhandledExceptionFilter,
} from './app.exception.filter';
import { PrismaExceptionFilter } from './prisma/prisma-exception/prisma.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new UnhandledExceptionFilter(),
    new HttpExceptionFilter(),
    new PrismaExceptionFilter(),
  );
  await app.listen(3000);
}
bootstrap();
