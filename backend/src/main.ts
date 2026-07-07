import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  // Swagger documentation (only for non-Cloud Functions)
  if (process.env.CLOUD_FUNCTIONS !== 'true') {
    const config = new DocumentBuilder()
      .setTitle('Customer Order Management API')
      .setDescription('API for managing customer orders')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  if (process.env.CLOUD_FUNCTIONS !== 'true') {
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 API documentation: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
