import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message';
import { User } from '../user/entities/user';
import * as swearjar from 'swearjar';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const sender = await this.userRepository.findOneBy({ id: senderId });
    const receiver = await this.userRepository.findOneBy({ id: receiverId });

    if (!sender || !receiver) {
      throw new BadRequestException('User not found');
    }

    if (swearjar.profane(content)) {
      throw new BadRequestException('Your message contains inappropriate language. Please rephrase.');
    }

    const message = this.messageRepository.create({
      sender,
      receiver,
      content,
    });

    return await this.messageRepository.save(message);
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } }
      ],
      order: { sentAt: 'ASC' },
      relations: ['sender', 'receiver'],
    });
  }
}
