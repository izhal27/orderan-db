import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: '*:*' })
export class WebSocketService {
  @WebSocketServer() server: Server;

  emitEvent(event: string, data: any, userId: number) {
    this.server.emit(event, { data, userId });
  }
}