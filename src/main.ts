import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ApiKeyAuthGuard } from './auth/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const apiKeyGuard = app.get(ApiKeyAuthGuard);
  app.useGlobalGuards(apiKeyGuard);

  await app.listen(process.env.PORT || 3000);
  console.log(`Backend running on: ${await app.getUrl()}`);
}

bootstrap();

