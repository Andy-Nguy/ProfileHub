import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Global Prefix ───────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ── Cookie Parser ───────────────────────────────────────────────────
  // Required for reading refresh tokens from httpOnly cookies
  app.use(cookieParser());

  // ── CORS ────────────────────────────────────────────────────────────
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') ?? [
    'http://localhost:5173',
  ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true, // Required for cookies to be sent cross-origin
  });

  // ── Global Validation Pipe ──────────────────────────────────────────
  // Automatically validates and transforms incoming DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Strip unknown properties
      forbidNonWhitelisted: true, // Reject requests with unknown properties
      transform: true,       // Auto-transform payloads to DTO instances
    }),
  );

  // ── Swagger Configuration ───────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('ProfileHub API')
    .setDescription('The official API documentation for ProfileHub service.')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('refresh_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'ProfileHub API Docs',
  });

  // ── Start Server ────────────────────────────────────────────────────
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 ProfileHub service running on http://localhost:${port}/api`);
  console.log(`📝 Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
