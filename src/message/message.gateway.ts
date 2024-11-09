import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Permitir todas as origens (use com cuidado em produção)
  },
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { senderId: string, receiverId: string, content: string }
  ) {
    const message = await this.messageService.sendMessage(data.senderId, data.receiverId, data.content);
    
    // Emitir o evento para o destinatário
    this.server.to(`${data.receiverId}`).emit('receiveMessage', message);
    return message;
  }

  handleConnection(client: any) {
    // Aqui, você pode associar o client.id ao usuário
    const userId = client.handshake.query.userId;
    client.join(`${userId}`);
  }

  handleDisconnect(client: any) {
    // Quando o cliente desconecta
  }
}
