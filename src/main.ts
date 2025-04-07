import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { startNgrok } from './net-configs/start-ngrok';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
import 'reflect-metadata';
dotenv.config();


async function bootstrap() {

    const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('Template - API')
    .setDescription('Platform API')
    .setVersion('v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app as any, options);
  SwaggerModule.setup('api', app as any, document);
  await startNgrok();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
