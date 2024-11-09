import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user';
import { Block } from '../block/entities/block/block';
import { Category } from 'src/category/entities/category/category';
import { Subcategory } from 'src/subcategory/entities/subcategory/subcategory';

@Module({
  imports: [TypeOrmModule.forFeature([User, Block, Category, Subcategory])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
