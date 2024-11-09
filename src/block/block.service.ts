import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './entities/block/block';
import { User } from 'src/user/entities/user';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async blockUser(blockerId: string, blockedUserId: string): Promise<Block> {
    const existingBlock = await this.blockRepository.findOne({
      where: { blocker: { id: blockerId }, blocked: { id: blockedUserId } },
    });

    if (existingBlock) {
      throw new BadRequestException('User already blocked');
    }

    const blocker = await this.userRepository.findOne({ where: { id: blockerId } });
    const blocked = await this.userRepository.findOne({ where: { id: blockedUserId } });

    if (!blocker || !blocked) {
      throw new NotFoundException('User not found');
    }

    const block = this.blockRepository.create({
      blocker,
      blocked,
    });

    return await this.blockRepository.save(block);
  }

  async getBlockedUsers(userId: string): Promise<User[]> {
    const blockedUsers = await this.blockRepository.find({
      where: { blocker: { id: userId } },
      relations: ['blocked'],  
    });

    return blockedUsers.map((block) => block.blocked);
  }

  async unblockUser(blockerId: string, blockedUserId: string): Promise<void> {
    const block = await this.blockRepository.findOne({
      where: { blocker: { id: blockerId }, blocked: { id: blockedUserId } },
    });

    if (!block) {
      throw new NotFoundException('Block record not found');
    }

    await this.blockRepository.remove(block);
  }
}
