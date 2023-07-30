import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});

  // Start the NestJS application
  await app.listen(3001);
  let serverUrl = await app.getUrl();
  serverUrl = serverUrl.replace('[::1]', 'localhost');
  console.log(` Backend Consumer Running At : ${serverUrl}`);
}
bootstrap();
