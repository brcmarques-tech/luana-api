import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://luana.bcmtech.com.br',
      'http://localhost:8081',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT'],
  });

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(`luana-api rodando na porta ${port}`);
}

bootstrap();
