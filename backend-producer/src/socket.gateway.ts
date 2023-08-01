import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Kafka, Producer } from 'kafkajs';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

@WebSocketGateway({ namespace: 'chat', allowEIO3:true, allowUpgrades:true, cors:{ origin:"*" }, transports: ['websocket'] })
// @WebSocketGateway(3000, { namespace:'chat', transports: ['websocket'] })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  private producer: Producer;

  setProducer(producer: Producer) {
    this.producer = producer;
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any): Promise<void> {
    try {
      // Send the message received from react client via socket.io to Kafka topic
      await this.producer.send({
        topic: 'messages',
        messages: [{ value: JSON.stringify(payload) }],
      });
      console.log([{ value: JSON.stringify(payload) }])
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
    }
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected to producer:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected to producer:', client.id);
  }

}
