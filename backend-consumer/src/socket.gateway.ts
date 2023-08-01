import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Kafka, Consumer } from 'kafkajs';

@WebSocketGateway({ namespace: 'chat', allowEIO3:true, allowUpgrades:true, cors:{ origin:"*" }, transports: ['websocket'] })
// @WebSocketGateway(3001, { namespace:'chat', transports: ['websocket'] })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private consumer: Consumer;

  setConsumer(consumer: Consumer) {
    this.consumer = consumer;
    this.runConsumer();
  }

  async runConsumer() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          // Receive messages from Kafka topic and emit to the Socket.IO clients
          const payload = JSON.parse(message.value.toString());
          if( payload.priority < 7 )return;// apply priority filter
          this.server.emit('message', payload);
          console.log( message.value.toString() )
        } catch (error) {
          console.error('Error receiving message from Kafka:', error);
        }
      },
    });
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected to consumer:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected to consumer:', client.id);
  }
}
