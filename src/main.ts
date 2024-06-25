import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { AppModule } from './app.module';

async function bootstrap() {
  await AppDataSource.initialize();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST'],
    // credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
