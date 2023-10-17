import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalFilters(
    new PrismaExceptionFilter(app.get(HttpAdapterHost)?.httpAdapter),
  );

  const config = new DocumentBuilder()
    .setTitle("Slayer's Drama")
    .setDescription("The Slayer's Drama API description")
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: 0,
      docExpansion: 'none',
    },
  });

  await app.listen(3000);
}
bootstrap();
