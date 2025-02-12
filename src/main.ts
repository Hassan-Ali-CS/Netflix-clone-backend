import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());   //global declaration

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }

  app.enableCors(corsOptions);
  // app.useGlobalGuards(new JwtAuthGuard(app.get(AuthService)));  //global guard
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
