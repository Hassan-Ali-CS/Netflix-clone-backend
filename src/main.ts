import { ValidationPipe } from '@nestjs/common';  //built-in utillity,helps validate incoming data (request payloads) against the defined DTO's
import { NestFactory } from '@nestjs/core'; //core module responsible for creating and bootstraping a NestJs application instance.
import { AppModule } from './app.module'; //Root Module. Defines the structure of the application. App module contains the logic for handling routes, business logic and database interactions. These are the endpoints the frontend communicates with.
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';  //Interface that defines the configuration options for enabling Cross-Origin Resource Sharing. CORS is a security mechanism that allows or restrict web application running at one origin (domain) to access resource hosted on another Origin.


async function bootstrap() {
  const app = await NestFactory.create(AppModule);  //This creates the core application(app) by loading the AppModule. The AppModule is the starting point of the NestJs app and contains the main componenets such as controllers, services and middleware.
  app.useGlobalPipes(new ValidationPipe());   //Registers the validationPipe globally, meaning it will apply to all the incoming requests across the application.

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }

  app.enableCors(corsOptions);  //enable CORS for the application using the CORS option
  // app.useGlobalGuards(new JwtAuthGuard(app.get(AuthService)));  //global guard
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap(); //This starts the bootstraping process.
