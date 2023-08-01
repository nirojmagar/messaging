import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Kafka, Partitioners } from 'kafkajs';
import { SocketGateway } from './socket.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});

  // Set up Kafka producer
  const kafka = new Kafka({
    clientId: 'message-producer-backend',
    brokers: ['kafka:9092'],
  });
  await kafka.admin().createTopics({
    topics:[
      {
        topic:'messages',
      }
    ]
  })
  // remove createPartitioner: Partitioners.LegacyPartitioner and set KAFKAJS_NO_PARTITIONER_WARNING to get rid of warning 
  // Ref : https://kafka.js.org/docs/migration-guide-v2.0.0
  const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
  await producer.connect();

  // Inject Kafka producer instance into Socket.IO gateway
  const socketGateway = app.get(SocketGateway);
  socketGateway.setProducer(producer);

  // Start the NestJS application
  await app.listen(3000);
  let serverUrl = await app.getUrl();
  serverUrl = serverUrl.replace('[::1]', 'localhost');
  console.log(` Backend Producer Running At : ${serverUrl}`);
}
bootstrap();
