import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: ['error', 'warn'] },
    );

    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async (req: any, res: any) => {
  const server = await bootstrapServer();
  return server(req, res);
};
