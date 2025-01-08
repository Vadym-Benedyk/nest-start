import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const options = new DocumentBuilder()
    .setTitle('Template - API')
    .setDescription('Platform API')
    .setVersion('v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app as any, options);
  SwaggerModule.setup('api', app as any, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
