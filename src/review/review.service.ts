import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review/review';
import { User } from '../user/entities/user';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createReview(userId: string, reviewerId: string, rating: number, comment?: string): Promise<Review> {
    if (userId === reviewerId) {
      throw new BadRequestException('You cannot review yourself');
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const reviewer = await this.userRepository.findOne({ where: { id: reviewerId } });

    if (!user || !reviewer) {
      throw new BadRequestException('Invalid user or reviewer');
    }

    const newReview = this.reviewRepository.create({
      rating: parseFloat(String(rating)),
      comment: comment || undefined,
      userId,
      reviewerId,
      user,
      reviewer,
    });

    return await this.reviewRepository.save(newReview);
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    const reviews = await this.reviewRepository.find({
      where: { userId },
      relations: ['reviewer'], 
      select: {
        reviewer: {
          name: true,
        },
      },
    });

    return reviews;
  }
}
