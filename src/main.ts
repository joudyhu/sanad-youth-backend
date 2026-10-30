import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { mkdirSync } from 'node:fs';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  const config = app.get(ConfigService);
  mkdirSync(config.get('UPLOAD_DIR', 'uploads'), { recursive: true });
  await app.listen(config.get<number>('PORT', 3000));
}
bootstrap();
