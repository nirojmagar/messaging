import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Kafka, Consumer } from 'kafkajs';
import { SocketGateway } from './socket.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});

  // Set up Kafka consumer
  const kafka = new Kafka({
    clientId: 'message-consumer-backend',
    brokers: ['kafka:9092'],
  });
  await kafka.admin().createTopics({
    topics:[
      {
        topic:'messages',
      }
    ]
  })
  const consumer = kafka.consumer({ groupId: 'messaging-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'messages', fromBeginning: true });

  // Inject Kafka consumer instance into Socket.IO gateway
  const socketGateway = app.get(SocketGateway);
  socketGateway.setConsumer(consumer);

  // Start the NestJS application
  await app.listen(3001);
  let serverUrl = await app.getUrl();
  serverUrl = serverUrl.replace('[::1]', 'localhost');
  console.log(` Backend Consumer Running At : ${serverUrl}`);
}
bootstrap();
