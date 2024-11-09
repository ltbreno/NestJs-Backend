import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { Block } from './entities/block/block';
import { User } from 'src/user/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([Block, User])],
  providers: [BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
