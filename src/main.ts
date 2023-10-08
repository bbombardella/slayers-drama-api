import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalFilters(
    new PrismaExceptionFilter(app.get(HttpAdapterHost)?.httpAdapter),
  );

  await app.listen(3000);
}
bootstrap();
