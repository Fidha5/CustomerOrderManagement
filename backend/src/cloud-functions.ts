import * as functions from 'firebase-functions';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

const server = express();

let cachedApp: any;

// Initialize NestJS app for Cloud Functions
async function bootstrapApp() {
  if (!cachedApp) {
    const expressApp = new ExpressAdapter(server);
    const app = await NestFactory.create(
      AppModule,
      expressApp,
      { logger: ['error', 'warn'] }, // Reduce logging for Cloud Functions
    );

    // Enable CORS for Firebase
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new (require('@nestjs/common').ValidationPipe)({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // API prefix
    app.setGlobalPrefix('api');

    await app.init();

    cachedApp = app;
  }

  return cachedApp;
}

// Cloud Function for HTTP requests
export const api = functions.https.onRequest(async (req, res) => {
  await bootstrapApp();
  server(req, res);
});
