import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.enableCors({ origin: true, credentials: true });
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
  console.log(`Backend running on http://localhost:${process.env.PORT ?? 4000}`);
}

bootstrap();
