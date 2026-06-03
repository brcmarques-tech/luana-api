import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://luana-1-ano.onrender.com',
      'https://luana.bcmtech.com.br',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'http://localhost:8081',
      'http://localhost:8090',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`luana-api rodando na porta ${port}`);
}

bootstrap();
