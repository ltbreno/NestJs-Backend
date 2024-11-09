import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria uma nova avaliação' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 1, description: 'ID do usuário avaliado' },
        reviewerId: { type: 'string', example: 2, description: 'ID do revisor' },
        rating: { type: 'number', example: 4.5, description: 'Nota da avaliação (entre 1 e 5)' },
        comment: { type: 'string', example: 'Ótima pessoa!', description: 'Comentário opcional' },
      },
    },
  })
  async createReview(
    @Body('userId') userId: string,
    @Body('reviewerId') reviewerId: string,
    @Body('rating') rating: number,
    @Body('comment') comment?: string,
  ) {
    return this.reviewService.createReview(userId, reviewerId, rating, comment);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({ summary: 'Obtém todas as avaliações de um usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário cujas avaliações serão buscadas' })
  async getUserReviews(@Param('userId') userId: string) {
    return this.reviewService.getUserReviews(userId);
  }
}
