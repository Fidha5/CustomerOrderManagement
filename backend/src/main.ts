import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Log environment variables for debugging
  console.log('=== Environment Variables Debug ===');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  console.log('DIRECT_URL:', process.env.DIRECT_URL ? 'SET' : 'NOT SET');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
  console.log('PORT:', process.env.PORT || 'NOT SET');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'NOT SET');
  console.log('CLOUD_FUNCTIONS:', process.env.CLOUD_FUNCTIONS || 'NOT SET');
  console.log('=== End Environment Debug ===');

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
