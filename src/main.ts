import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  // add config service
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
