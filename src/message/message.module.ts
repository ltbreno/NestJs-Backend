import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { Message } from './entities/message';
import { User } from '../user/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
