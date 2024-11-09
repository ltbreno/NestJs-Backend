import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review/review';
import { User } from '../user/entities/user';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
