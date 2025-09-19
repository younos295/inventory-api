import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Set global API prefix so all routes start with /api
  app.setGlobalPrefix('api');

  // Swagger setup (already included)
  const config = new DocumentBuilder()
    .setTitle('E-Commerce Inventory API')
    .setDescription('API documentation for the e-commerce inventory system')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Serve Swagger at /api/docs (respects the global prefix)
  SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
