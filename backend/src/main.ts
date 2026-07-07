import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  if (process.env.CLOUD_FUNCTIONS === 'true') {
    // Cloud Functions environment - allow all origins (configure in Firebase Console)
    app.enableCors({
      origin: true,
      credentials: true,
    });
  } else if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      origin: '*',
      credentials: false,
    });
  } else {
    const allowedOrigins = (
      process.env.FRONTEND_URL || 'http://localhost:5173'
    ).split(',');
    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });
  }

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
