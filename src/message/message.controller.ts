import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
@ApiTags('Messages')  
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Send a new message' }) 
  @ApiResponse({ status: 201, description: 'Message sent successfully.' })  
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        senderId: { type: 'string', example: '1', description: 'ID of the user sending the message' },
        receiverId: { type: 'string', example: '2', description: 'ID of the user receiving the message' },
        content: { type: 'string', example: 'Hello, how are you?', description: 'Content of the message' },
      },
    },
  })  
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('content') content: string
  ) {
    return await this.messageService.sendMessage(senderId, receiverId, content);
  }

  @Get(':userId1/:userId2')
  @ApiOperation({ summary: 'Get all messages between two users' })  // Descrição da operação
  @ApiResponse({ status: 200, description: 'List of messages between the two users.' })  // Resposta de sucesso
  @ApiParam({ name: 'userId1', description: 'ID of the first user', example: '1' })  // Parâmetro da URL
  @ApiParam({ name: 'userId2', description: 'ID of the second user', example: '2' })  // Parâmetro da URL
  async getMessagesBetweenUsers(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string
  ) {
    return await this.messageService.getMessagesBetweenUsers(userId1, userId2);
  }
}

